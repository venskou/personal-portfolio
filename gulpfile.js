'use strict';

// Declare plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');
const prettyHtml = require('gulp-pretty-html');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Config directories
const dirs = {
  src: {
    html: 'src/*.html',
    js: 'src/js/**/*.js'
  },
  dist: {
    html: 'dist/',
    js: 'dist/js/'
  },
  watch: {
    html: 'src/*.html',
    js: 'src/js/**/*.js',
  },
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

// Build JS
function buildJS(done) {
  gulp.src(dirs.src.js)
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(gulp.dest(dirs.dist.js));
  done();
}

// Watch files
function watch() {
  gulp.watch(dirs.watch.html, gulp.series(buildHTML, reloadServer));
  gulp.watch(dirs.watch.js, gulp.series(buildJS, reloadServer));
}

// Export tasks
exports.server = server;
exports.watch = watch;
exports.buildHTML = buildHTML;
exports.buildJS = buildJS;
const build = gulp.parallel(buildHTML, buildJS);
exports.build = build;

// Default task
exports.default = gulp.series(build, server, watch);