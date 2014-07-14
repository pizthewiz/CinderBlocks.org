/*jshint node:true, strict:true */
'use strict';

var fs = require('fs');
var util = require('util');

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var github = require('octonode');

var client = github.client({
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
});

module.exports.generate = generate;

// HTTP TRAFFIC:
//  FIND REPOS:
//    <PAGES + 1> GET to github.com
//  GET BLOCK:
//    <REPOS> GET to api.github.com
//    <REPOS> GET to github.com
function generate (cb) {
  async.seq(findRepos, getBlocks, _saveBlocks)(function (err, data) {
    cb(err, data);
  });
}

// NB - scrape until global search is available via API 😁
//  https://developer.github.com/changes/2013-10-18-new-code-search-requirements/
function findReposOnPage(page, callback) {
  var url = util.format("https://github.com/search?p=%s&q=cinder+path%3A%2Fcinderblock.xml&type=Code", page);
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
      // trim to form 'OWNER-LOGIN/REPO-NAME'
      var fullname = /\/?([\w-]+\/[\w-]+)$/.exec(href)[1];
      repos.push(fullname);
    });

    callback(null, repos);
  });  
}

function getBlock(fullName, callback) {
//  if (!client.id || !client.secret) {
//    callback({msg: 'Must define GITHUB_ID and GITHUB_SECRET environment variables'});
//    return;
//  }

  var repo = client.repo(fullName);
  repo.info(function (err, data, headers) {
    if (err) {
      callback(err);
      return;
    }

    var block = {
      id: data.id,
      name: data.name,
      full_name: data.full_name,
      owner: {
        id: data.owner.id,
        name: data.owner.login,
        url: data.owner.html_url,
        avatar_url: data.owner.avatar_url
      },
      description: data.description || null,
      url: data.html_url,
      created: data.created_at,
      updated: data.updated_at,
      star_count: data.stargazers_count,
      image_url: null,
//      sample_count: 0,
//      supports: [],
//      template_count: 0,
//      forks: []
    };

    var url = util.format("https://raw.githubusercontent.com/%s/%s/cinderblock.png", data.full_name, data.default_branch);
    hasResource(url, function (err, exists) {
      if (err) {
        callback(err);
        return;
      }

      block.image_url = exists ? url : null;
      callback(null, block);
    });
  });
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
function findRepos(cb) {
  var repos = [];
  var status = true;
  var page = 1;
  async.whilst(function () {
    return status;
  }, function (callback) {
    findReposOnPage(page++, function (err, data) {
      if (err) {
        callback(err);
        return;
      }

      repos = repos.concat(data);
      status = data.length > 0;
      callback();
  });
  }, function (err) {
    cb(err, repos);
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

function _trimRepos(repos, cb) {
  repos = repos.slice(0, 4);
  cb(null, repos);
}

function getBlocks(repos, cb) {
  async.mapLimit(repos, 4, getBlock, function (err, results) {
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
