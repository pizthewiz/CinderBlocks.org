/*jshint node:true, strict:false */
'use strict';

var gulp = require('gulp');

var connect = require('gulp-connect');

var intern = require('./intern.js');

gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
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

    cb();
  });
});
