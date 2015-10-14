/* eslint-disable */
var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

var production = process.env.NODE_ENV === 'production';

var config = {
  port: 9000,
  paths: {
    js: './src/js/*.js',
    styles: './src/scss/*.scss',
    images: './src/images/**/*',
    mainScss: './src/scss/main.scss',
    distJs:'./dist/js',
    distCss: './dist/css',
    distImages: './dist/images',
  }
};

/*
 |--------------------------------------------------------------------------
 | Minify JavaScript.
 |--------------------------------------------------------------------------
*/
gulp.task('js', function() {
  gulp.src(config.paths.js).pipe(uglify()).pipe(gulp.dest(config.paths.distJs));
});


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
 | Minify Images.
 |--------------------------------------------------------------------------
*/
gulp.task('images', function () {
  return gulp.src(config.paths.images)
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest(config.paths.distImages));
});


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
gulp.task('build', ['js', 'styles', 'images']);
