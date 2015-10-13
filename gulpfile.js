/* eslint-disable */
var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');

var production = process.env.NODE_ENV === 'production';

var config = {
  port: 9000,
  paths: {
    styles: './styles/*.scss',
    mainScss: './styles/main.scss',
    distCss: './dist/css',
  }
};


/*
 |--------------------------------------------------------------------------
 | Compile scss stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function () {
  gulp.src(config.paths.mainScss)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest(config.paths.distCss));
});


/*
 |--------------------------------------------------------------------------
 | Compile scss and reload browser.
 |--------------------------------------------------------------------------
 */
gulp.task('styles-watch', ['styles'], browserSync.reload);


/*
 |--------------------------------------------------------------------------
 | Run browser-sync server and watch for changes.
 |--------------------------------------------------------------------------
 */
gulp.task('watch', function () {
  browserSync.init({
    server: './',
    port: config.port,
  });

  gulp.watch(config.paths.styles, ['styles-watch']);
});


/*
 |--------------------------------------------------------------------------
 | Run tasks
 |--------------------------------------------------------------------------
 */
gulp.task('default', ['watch']);
gulp.task('build', ['styles']);
