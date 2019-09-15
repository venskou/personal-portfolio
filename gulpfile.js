'use strict';

// Declare plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');
const prettyHtml = require('gulp-pretty-html');

// Config directories
const dirs = {
  src: {
    html: 'src/*.html',
  },
  dist: {
    html: 'dist/',
  },
  watch: {
    html: 'src/*.html',
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

// Watch files
function watch() {
  gulp.watch(dirs.watch.html, gulp.series(buildHTML, reloadServer))
}

// Export tasks
exports.server = server;
exports.watch = watch;
exports.buildHTML = buildHTML;

// Default task
exports.default = gulp.series(buildHTML, server, watch);