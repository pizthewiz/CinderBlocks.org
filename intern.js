/*jshint node:true, strict:false */

//
//  Created by Jean-Pierre Mouilleseaux on 09 Jul 2014.
//  Copyright 2014 Chorded Constructions. All rights reserved.
//

var fs = require('fs');
var path = require('path');
var util = require('util');

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var github = require('octonode');

var client = github.client({
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
});

// NB - global search not yet available via API, scrape in the interim. 😁
//  https://developer.github.com/changes/2013-10-18-new-code-search-requirements/
function findBlocksOnPage(page, callback) {
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
  client.repo(fullName).info(function (err, data, headers) {
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
      description: data.description,
      url: data.html_url,
      created: data.created_at,
      updated: data.updated_at,
      star_count: data.stargazers_count,
//      image: null,
//      sample_count: 0,
//      forks: []
    };
    callback(null, block);
  });  
}

function hasImage(fullName, branch, callback) {
  // TODO - use data.default_branch from client.repo(fullName).info()
  var url = util.format("https://raw.githubusercontent.com/%s/%s/cinderblock.png", fullName, branch);
  request.head(url, {}, function (err, res, body) {
    callback(err, res.statusCode === 200);
  });
}

var main = function () {

  function findRepos(cb) {
    // find repos
    var repos = [];
    var status = true;
    var page = 1;
    async.whilst(function () {
      return status;
    }, function (callback) {
      findBlocksOnPage(page++, function (err, data) {
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

  function _readRepos(cb) {
    fs.readFile('./repos.json', function (err, data) {
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

  function blockDescriptions(repos, cb) {
    async.mapLimit(repos, 1, getBlock, function (err, results) {
      cb(err, results);
    });
  }

  async.seq(_readRepos, _trimRepos, blockDescriptions)(function (err, blocks) {
    if (err) {
      console.error('ERROR - ', err);
      return;
    }

    console.log(blocks);
  });
};

if (require.main === module) {
  main();
}
