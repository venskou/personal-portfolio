'use strict';

// Declare plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');
const prettyHtml = require('gulp-pretty-html');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const npmDist = require('gulp-npm-dist');
const rimraf = require('gulp-rimraf');

// Config directories
const dirs = {
  src: {
    html: 'src/*.html',
    styles: 'src/styles/styles.scss',
    js: 'src/js/**/*.js',
    vendors: 'src/vendors/'
  },
  dist: {
    html: 'dist/',
    styles: 'dist/styles/',
    js: 'dist/js/',
    vendors: 'dist/vendors/'
  },
  watch: {
    html: 'src/*.html',
    styles: 'src/styles/**/*.scss',
    js: 'src/js/**/*.js',
  },
  clean: ['dist/*']
};

// Local Server
function server(done) {
  browserSync.init({
    server: {
      baseDir: './dist/',
      directory: true,
    },
    logPrefix: 'localhost',
    notify: false,
  });
  done();
}

// Reload local server
function reloadServer(done) {
  browserSync.reload();
  done();
}

// Clean dist folder
function clean() {
  return gulp.src(dirs.clean)
    .pipe(rimraf());
}

// Build HTML
function buildHTML(done) {
  gulp.src(dirs.src.html)
    .pipe(prettyHtml({
      indent_size: 2,
      extra_liners: [],
    }))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest(dirs.dist.html));
  done();
}

// Build styles
function buildStyles(done) {
  gulp.src(dirs.src.styles)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      indentWidth: 2
    }))
    .pipe(autoprefixer({
      cascade: true
    }))
    .pipe(gulp.dest(dirs.dist.styles))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min',
      extname: '.css',
    }))
    .pipe(gulp.dest(dirs.dist.styles));
  done();
}

// Build JS
function buildJS(done) {
  gulp.src(dirs.src.js)
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(dirs.dist.js));
  done();
}

// Copy vendors
function copyVendors(done) {
  gulp.src(npmDist(), { base: './node_modules/' })
    .pipe(gulp.dest(dirs.src.vendors))
    .pipe(gulp.dest(dirs.dist.vendors));
  done();
}

// Watch files
function watch() {
  gulp.watch(dirs.watch.html, gulp.series(buildHTML, reloadServer));
  gulp.watch(dirs.watch.styles, gulp.series(buildStyles, reloadServer));
  gulp.watch(dirs.watch.js, gulp.series(buildJS, reloadServer));
}

// Export tasks
exports.server = server;
exports.watch = watch;
exports.clean = clean;
exports.buildHTML = buildHTML;
exports.buildStyles = buildStyles;
exports.buildJS = buildJS;
exports.copyVendors = copyVendors;
const build = gulp.series(clean, copyVendors, gulp.parallel(buildHTML, buildStyles, buildJS));
exports.build = build;

// Default task
exports.default = gulp.series(build, server, watch);