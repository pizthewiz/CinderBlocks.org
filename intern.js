/*jshint node:true, strict:true */
'use strict';

var fs = require('fs');
var util = require('util');

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var github = require('octonode');
var xml2js = require('xml2js');

var client = github.client({
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
});

// HTTP TRAFFIC:
//  FIND USERS:
//    <(REPOS / 10) + 1> GET to github.com
//  FIND REPOS:
//    <UNIQUE_USERS> GET to api.github.com
//  GET BLOCKS:
//    <REPOS * 3> GET to api.github.com
//    <REPOS * 2> GET to github.com
function generate (cb) {
  async.seq(scrape, _uniqueUsersForRepos, _saveUsers, _addMissingUsers, findRepos, _saveRepos, getBlocks, _saveBlocks)(function (err, data) {
    cb(err, data);
  });
}
module.exports.generate = generate;

// NB - scrape until global search is available via API 😁
//  https://developer.github.com/changes/2013-10-18-new-code-search-requirements/
function scrapeSearchResultsPageForRepos(page, callback) {
  var url = util.format('https://github.com/search?p=%s&q=cinder+path%3A%2Fcinderblock.xml&type=Code', page);
  // var url = util.format('https://github.com/search?p=%s&q=cinderblock.xml+in%3Apath&type=Code', page);
  request.get(url, {}, function (err, res, body) {
    if (err) {
      callback(err);
      return;
    }
    if (res.statusCode != 200) {
      callback({statusCode: res.statusCode});
      return;
    }

    var repos = [];
    var $ = cheerio.load(body);
    $('div.code-list-item').each(function () {
      var href = $(this).find('p.title a').attr('href');
      // trim to fullname, USER/REPO
      var fullname = /\/?([\w-]+\/[\w-]+)$/.exec(href)[1];
      repos.push(fullname);
    });

    callback(null, repos);
  });
}

function searchUser(user, callback) {
  client.search().code({
    q: util.format('cinderblock.xml+in:path+user:%s', user)
    // q: util.format('path:cinderblock.xml+user:%s', user)
  }, function (err, data, headers) {
    if (err) {
      // retry after a delay if rate limited.
      // NB - oddly headers is not populated but in err.headers
      if (err.statusCode == 403 && parseInt(err.headers['x-ratelimit-remaining'], 10) == 0) {
        var s = err.headers['x-ratelimit-reset'];
        var ms = new Date(s * 1000) - new Date();
        setTimeout(function () { searchUser(user, callback); }, ms);
        console.log('rate limited till %d, waiting %d ms to retry', s, ms);
        return;
      } else {
        callback(err);
        return;
      }
    }

    var result = data.items.map(function (item) { return item.repository.full_name; });
    callback(null, result);
  });
};

function getBlock(fullName, callback) {
  var repo = client.repo(fullName);
  var defaultBranch;

  async.seq(_info, _commit, _samples, _png, _xml)(callback);

  function _info(cb) {
    repo.info(function (err, data, headers) {
      if (err) {
        cb(err);
        return;
      }

      var block = {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        user: {
          id: data.owner.id,
          name: data.owner.login,
          url: data.owner.html_url,
          avatar_url: data.owner.avatar_url
        },
        description: data.description,
        url: data.html_url,
        created: data.created_at,
        // NB - date.updated_at reflects repo metadata changes too, not just commits
        updated: data.updated_at,
        commit: {
          date: null
        },
        star_count: data.stargazers_count,
        image_url: null,
        sample_count: 0,
        supports: [],
        template_count: 0,
        forks: []
      };

      defaultBranch = data.default_branch;

      cb(null, block);
    });
  }

  function _commit(block, cb) {
    repo.branch(defaultBranch, function (err, data, headers) {
      if (err) {
        cb(err);
        return;
      }

      // author vs committer
      block.commit.date = data.commit.commit.author.date

      cb(null, block);
    });
  }

  function _samples(block, cb) {
    repo.contents('samples', function (err, data, headers) {
      if (err) {
        // 404 is non-fatal
        if (err.statusCode === 404) {
          cb(null, block);
          return;
        }

        cb(err);
        return;
      }

      // count every directory as a sample
      var count = data.filter(function (f) { return f.type === 'dir'; }).length;
      block.sample_count = count;
      cb(null, block);
    });
  }

  function _png(block, cb) {
    var url = util.format('https://raw.githubusercontent.com/%s/%s/cinderblock.png', block.full_name, defaultBranch);
    hasResource(url, function (err, exists) {
      if (err) {
        cb(err);
        return;
      }

      block.image_url = exists ? url : null;
      cb(null, block);
    });
  }

  function _xml(block, cb) {
    var url = util.format('https://raw.githubusercontent.com/%s/%s/cinderblock.xml', block.full_name, defaultBranch);
    readResource(url, function (err, data) {
      if (err) {
        cb(err);
        return;
      }

      var parser = new xml2js.Parser();
      parser.parseString(data, function (err, result) {
        if (err) {
          console.error('ERROR - failed to parse cinderblock.xml for %s, skipping...', block.full_name);
          // NB - skip this block, don't kill the entire process
          cb(null, null);
          return;
        }

        var rootElement = result.cinder;
        var blockElement = rootElement.block[0];
        block.description = block.description || blockElement.$.summary || '';
        block.supports = blockElement.supports ? blockElement.supports.map(function (e) {
          return e.$.os || null;
        }).filter(function (e) { return e !== null; }) : [];
        block.template_count = rootElement.template ? rootElement.template.length : 0;

        cb(null, block);
      });
    });
  }
}

function hasResource(url, callback) {
  request.head(url, {}, function (err, res, body) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, res.statusCode === 200);
  });
}

function readResource(url, callback) {
  request.get(url, {}, function (err, res, body) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, body);
  });
}

// wrappers
function scrape(cb) {
  var repos = [];
  var status = true;
  var page = 1;

  async.whilst(function () {
    return status;
  }, function (callback) {
    scrapeSearchResultsPageForRepos(page++, function (err, data) {
      if (err) {
        callback(err);
        return;
      }

      repos = repos.concat(data);
      status = data.length > 0;
      callback();
    });
  }, function (err) {
    // reject any repo that occurs more than once, not likely a block
    var results = repos.filter(function (elem, idx, array) {
      return array.indexOf(elem) === array.lastIndexOf(elem);
    });
    console.log('found %d repos, via scraping', results.length);

    cb(err, results);
  });
}

function _uniqueUsersForRepos(data, cb) {
  var results = data.map(function (fullname) {
    // USER/REPO to USER
    return /([\w-]+)\/[\w-]+$/.exec(fullname)[1];
  }).filter(function (elem, idx, array) {
    // unique users
    return array.indexOf(elem) == idx;
  });
  console.log('%d unique users', results.length);

  cb(null, results);
}

function _saveUsers(data, cb) {
  fs.writeFile('./_users.json', JSON.stringify(data), function (err) {
    cb(err, data);
  });
}

function _readUsers(cb) {
  fs.readFile('./_users.json', function (err, data) {
    if (err) {
      cb(err);
      return;
    }

    var repos = JSON.parse(data);
    cb(null, repos);
  });
}

function _addMissingUsers(data, cb) {
  if (!fs.existsSync('./_users-missing.json')) {
    cb(null, data);
    return;
  }

  fs.readFile('./_users-missing.json', function (err, d) {
    if (err) {
      cb(err);
      return;
    }

    var results = data.concat(JSON.parse(d)).filter(function (elem, idx, array) {
      return array.indexOf(elem) === array.lastIndexOf(elem);
    });
    console.log('adding %d missing users', results.length - data.length);

    cb(null, results);
  });
}

function findRepos(data, cb) {
  async.concatSeries(data, searchUser, function (err, results) {
    if (err) {
      cb(err);
      return;
    }

    // reject any repo that occurs more than once, not likely a block
    var repos = results.filter(function (elem, idx, array) {
      return array.indexOf(elem) === array.lastIndexOf(elem);
    });
    console.log('found %d repos', repos.length);

    cb(null, repos);
  });
}

function _saveRepos(data, cb) {
  fs.writeFile('./_repos.json', JSON.stringify(data), function (err) {
    cb(err, data);
  });
}

function _readRepos(cb) {
  fs.readFile('./_repos.json', function (err, data) {
    if (err) {
      cb(err);
      return;
    }

    var repos = JSON.parse(data);
    cb(null, repos);
  });
}

function getBlocks(repos, cb) {
  async.mapLimit(repos, 4, getBlock, function (err, results) {
    // remove nulls representing skipped blocks
    results = results.filter(function (e) { return e !== null; });
    cb(err, results);
  });
}

function _saveBlocks(data, cb) {
  fs.writeFile('./_blocks.json', JSON.stringify(data), function (err) {
    cb(err, data);
  });
}

function _readBlocks(cb) {
  fs.readFile('./_blocks.json', function (err, data) {
    if (err) {
      cb(err);
      return;
    }

    var blocks = JSON.parse(data);
    cb(null, blocks);
  });
}
