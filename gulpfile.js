/*jshint node:true */
'use strict';

var gulp = require('gulp');

// site
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var del = require('del');
var usemin = require('gulp-usemin');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('lint', function () {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**']).
    pipe(jshint()).
    pipe(jshint.reporter('default')).
    pipe(jshint.reporter('fail'));
});
gulp.task('clean', function (cb) {
  del(['dist/*', '!dist/data'], cb);
});
// NB - only one file can be processed https://github.com/zont/gulp-usemin/issues/91
gulp.task('usemin-index', function () {
  gulp.src('./app/index.html').
    pipe(usemin({
      css: [minifyCSS(), 'concat'],
      html: [minifyHTML({empty: true})],
      js: [uglify(), 'concat'],
      jsX: [uglify(), 'concat']
    })).
    pipe(gulp.dest('dist/'));
});
gulp.task('copy-html-files', function () {
  gulp.src(['./app/**/*.html', '!./app/*.html']).
  pipe(gulp.dest('dist/'));
});
gulp.task('copy-image-files', function () {
  gulp.src(['./app/**/*.{png,ico}', '!./app/bower_components/**']).
  pipe(gulp.dest('dist/'));
});
gulp.task('copy-text-files', function () {
  gulp.src(['./app/**/*.txt', '!./app/bower_components/**']).
  pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('default',
  ['lint', 'connect']
);
gulp.task('build',
  ['lint', 'usemin-index', 'copy-html-files', 'copy-image-files', 'copy-text-files']
);

// intern
var intern = require('./intern.js');

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
