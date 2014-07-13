/*jshint node:true, strict:false */

var gulp = require('gulp');

var awspublish = require('gulp-awspublish');

// web
gulp.task('publish', function (cb) {
  var publisher = awspublish.create({
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-1',
    bucket: 'cinderblocks.org'
  });

  return gulp.src('./web/*')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
