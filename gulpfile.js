/*jshint node:true, strict:false */
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var awspublish = require('gulp-awspublish');

var intern = require('./intern.js');

var publisher = awspublish.create({
  key: process.env.AWS_ID,
  secret: process.env.AWS_SECRET,
  region: 'us-west-1',
  bucket: 'cinderblocks.org'
});

// intern
gulp.task('find:users', function (cb) {
  intern.findUsers(function (err, data) {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    cb();
  });
});
gulp.task('find:blocks', function (cb) {
  intern.findBlocks(function (err, data) {
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

// web
gulp.task('publish:web', function () {
  return gulp.src('./web/**')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
