/*jshint node:true, strict:false */

//
//  Created by Jean-Pierre Mouilleseaux on 09 Jul 2014.
//  Copyright 2014 Chorded Constructions. All rights reserved.
//

var fs = require('fs');
var path = require('path');

var request = require('request');
var cheerio = require('cheerio');
var github = require('octonode');

var client = github.client({
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
});

// flow: find repos (SCRAPE) -=> get repo info (API) -=> save to S3 as blocks.json

var repos = [];

function findReposOnPage(url, callback) {
  request.get(url, {}, function (err, res, body) {
    if (err) {
      console.error('ERROR - ' + err);
      callback(err);
      return;
    }
    if (res.statusCode != 200) {
      console.error('ERROR - status ' + res.statusCode);
      callback(res.statusCode);
      return;
    }

    var $ = cheerio.load(body);
    $('div.code-list-item').each(function () {
      var href = $(this).find('p.title a').attr('href');
      // trim to form 'OWNER-LOGIN/REPO-NAME'
      var fullname = /\/?([\w-]+\/[\w-]+)$/.exec(href)[1];
      repos.push(fullname);
    });

    var nextPage = $('div.pagination a.next_page').attr('href');
    callback(null, nextPage);
  });
}

function findRepos(fragment) {
  var url = 'https://github.com' + fragment;
  findReposOnPage(url, function (err, nextPage) {
    if (err) {
      return;
    }

    if (nextPage) {
      findRepos(nextPage);
    } else {
      console.log('repos ' + repos.length);
      console.log(repos);
    }
  });
}

// NB - global search not yet available via API, scrape in the interim. 😁
//  https://developer.github.com/changes/2013-10-18-new-code-search-requirements/
// findRepos('/search?q=cinder+path%3A%2Fcinderblock.xml&type=Code');

// skip scraper during development and use saved results
repos = JSON.parse(fs.readFileSync('./repos.json'));

var block = {
  id: '',
  name: '',
  owner: {
    id: '',
    name: '',
    url: '',
    avatar_url: ''
  },
  description: '',
  url: '',
  created: null,
  updated: null,
  star_count: 0,
//  image: null,
//  sample_count: 0,
//  forks: []
};

var randomIndex = Math.floor(Math.random() * (repos.length + 1));
var repo = client.repo(repos[randomIndex]);
repo.info(function (err, data, headers) {
  if (err) {
    console.error(err);
    return;
  }

  block.id = data.id;
  block.name = data.name;
  block.owner.id = data.owner.id;
  block.owner.name = data.owner.login;
  block.owner.url = data.owner.html_url;
  block.owner.avatar_url = data.owner.avatar_url;  
  block.description = data.description;
  block.url = data.html_url;
  block.created = data.created_at;
  block.updated = data.updated_at;
  block.star_count = data.stargazers_count;

  console.log(block);
});
