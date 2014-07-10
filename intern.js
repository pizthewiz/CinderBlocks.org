/*jshint node:true, strict:false */

//
//  Created by Jean-Pierre Mouilleseaux on 09 Jul 2014.
//  Copyright 2014 Chorded Constructions. All rights reserved.
//

var request = require('request');
var cheerio = require('cheerio');

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
      repos.push({href: href});
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
findRepos('/search?q=cinder+path%3A%2Fcinderblock.xml&type=Code');
