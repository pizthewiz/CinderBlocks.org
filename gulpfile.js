/*jshint node:true, strict:false */
'use strict';

var gulp = require('gulp');

var intern = require('./intern.js');

var rename = require('gulp-rename');
var awspublish = require('gulp-awspublish');
var gutil = require('gulp-util');

var publisher = awspublish.create({
  key: process.env.AWS_ID,
  secret: process.env.AWS_SECRET,
  region: 'us-west-1',
  bucket: 'cinderblocks.org'
});

// intern
gulp.task('generate', function (cb) {
  intern.generate(function (err, data) {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    // TODO - use JSON.stringify(data) directly instead of file
    gulp.src('./_blocks.json')
      .pipe(rename('data/blocks.json'))
      .pipe(awspublish.gzip())
      .pipe(publisher.publish())
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
    cb();
  });
});

gulp.task('_search', function (cb) {
  var user = gutil.env.user || 'pizthewiz';
  intern._search(user, function (err) {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    cb();
  });
});

// web
gulp.task('publish', function () {
  return gulp.src('./web/**')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
