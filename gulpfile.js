'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('babelify', function () {
  browserify()
    .add(require.resolve('babel/polyfill'))
    .add('./public/js/main.js')
    .transform(babelify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('watch', function () {
  gulp.watch(['public/js/*'], ['babelify']);
});