/*jshint node:true */
'use strict';

var gulp = require('gulp');

// site
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');

gulp.task('lint', function () {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**']).
    pipe(jshint()).
    pipe(jshint.reporter('default')).
    pipe(jshint.reporter('fail'));
});
gulp.task('clean', function (cb) {
  del(['dist/*', '!dist/data'], cb);
});
gulp.task('minify-css', function () {
  var opts = {comments: true, spare: true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**']).
    pipe(minifyCSS(opts)).
    pipe(gulp.dest('./dist/'));
});
gulp.task('minify-js', function () {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**']).
    pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    })).
    pipe(gulp.dest('./dist/'));
});
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**').
    pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html').
    pipe(gulp.dest('dist/'));
});
gulp.task('copy-image-files', function () {
  gulp.src('./app/**/*.{png,svg}').
    pipe(gulp.dest('dist/'));
});
gulp.task('copy-text-files', function () {
  gulp.src('./app/**/*.txt').
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
  ['lint', 'minify-css', 'minify-js', 'copy-bower-components', 'copy-html-files', 'copy-image-files', 'copy-text-files', 'connectDist']
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
