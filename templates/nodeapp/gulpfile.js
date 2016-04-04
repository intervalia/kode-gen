var fs = require('fs');
var util = require('util');
var path = require('path');
var gulp = require('gulp');
var compasm = require('gulp-component-assembler');
var minify = require("gulp-uglify");
var rename = require("gulp-rename");
//var watch = require('gulp-watch');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var rootDir = path.join(".");

var paths = {
  "root": rootDir,
  "karma": path.join(rootDir, "test"),
  "src": path.join(rootDir, "src"),
  "dst": path.join(rootDir, "dist"),
  "test": path.join('test', 'server', '*.js')
};

gulp.task('karma', function (done) {
  karma.start({
    configFile: path.join(paths.karma, 'karma.conf'),
    singleRun: true
  }, done)
});

gulp.task('karma-continuous', function (done) {
  karma.start({
    configFile: path.join(paths.karma, 'karma.conf'),
    singleRun: false,
    browsers: ['Chrome']
  }, done)
});

gulp.task("build", function (done) {
  gulp.src("**/assembly.json", {cwd: paths.src})
      .pipe(compasm.assemble({
          "defaultLocale": 'en',
          "minTemplateWS": true,
          "supportTransKeys": false,
          "useExternalLib": true
        }))
      .pipe(gulp.dest("./",{cwd: paths.dst}))
      .pipe(minify())
      .pipe(rename(function (path) {
        path.basename += "-min";
      }))
      .pipe(gulp.dest("./",{cwd: paths.dst}))
      ;
});

gulp.task('stylus', function () {
  gulp.src("**/*.styl", {cwd: paths.src})
      .pipe(stylus({errors: true}))
      .pipe(gulp.dest("./",{cwd: paths.dst}));
});

gulp.task('jshint', function () {
  gulp.src([
    path.join(paths.src, '**/*.js')
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ["jshint", "stylus"], function () {
});
