/*jshint node:true */
'use strict';

var gulp = require('gulp');

var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var del = require('del');
var spa = require('gulp-spa');
var minifyHTML = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var awspublish = require('gulp-awspublish');

var intern = require('./intern.js');

var awsConfig = {
  params: {
    Bucket: 'cinderblocks.org'
  },
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1'
};

// site
gulp.task('lint', function () {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**']).
    pipe(jshint()).
    pipe(jshint.reporter('default')).
    pipe(jshint.reporter('fail'));
});
gulp.task('clean', function (cb) {
  del(['dist/*', '!dist/data'], cb);
});
gulp.task('spa', function () {
  return gulp.src('./app/**/*.html').
    pipe(spa.html({
      assetsDir: 'app/',
      pipelines: {
        main: function (files) {
          return files.pipe(minifyHTML({empty: true, loose: true}));
        },
        js_lib: function (files) {
          return files.
            pipe(uglify()).
            pipe(concat('js/lib.js'));
        },
        js_app: function (files) {
          return files.
            pipe(uglify()).
            pipe(concat('js/app.js'));
        },
        css_lib: function (files) {
          return files.
            pipe(minifyCSS()).
            pipe(concat('css/lib.css'));
        }
      }
    })).
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
gulp.task('connect-dist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('default',
  ['lint', 'connect']
);
gulp.task('build',
  ['lint', 'spa', 'copy-image-files', 'copy-text-files']
);
gulp.task('publish', ['build'], function (cb) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    var e = new Error('both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be defined');
    cb(e);
    return;
  }

  var publisher = awspublish.create(awsConfig);
  return gulp.src(['./dist/**', '!dist/data']).
    pipe(awspublish.gzip()).
    pipe(publisher.publish()).
    // pipe(publisher.cache()).
    pipe(awspublish.reporter());
});

// intern
gulp.task('find-users', function (cb) {
  intern.findUsers(function (err, data) {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    cb();
  });
});
gulp.task('find-blocks', function (cb) {
  intern.findBlocks(function (err, data) {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    cb();
  });
});
gulp.task('publish-blocks', function (cb) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    var e = new Error('both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be defined');
    cb(e);
    return;
  }

  var publisher = awspublish.create(awsConfig);
  return gulp.src('./data/blocks.json').
    pipe(rename(function (path) {
      path.dirname += '/data';
    })).
    pipe(awspublish.gzip()).
    pipe(publisher.publish()).
    // pipe(publisher.cache()).
    pipe(awspublish.reporter());
});
