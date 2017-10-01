/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require('gulp-sass'),
    rename = require("gulp-rename"),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();

var paths = {
    webroot: "./"
};


paths.html = "./**/*.html";

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.concatJs = "script.min.js";
paths.jsDest = paths.webroot + "js";

paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatCss = "style.min.css";
paths.cssDest = paths.webroot + "css";

paths.sass = paths.webroot + "sass/**/*.scss";
paths.sassSrc = paths.webroot + "sass/style.scss";


gulp.task('sass', function () {
    return gulp.src(paths.sassSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.cssDest));
});

gulp.task("js", function () {
    return gulp.src([paths.js, "!" + paths.minJs])
        .pipe(concat(paths.concatJs))
        .pipe(uglify())
        .pipe(gulp.dest(paths.jsDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task("css", ['sass'], function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCss))
        .pipe(cssmin())
        .pipe(gulp.dest(paths.cssDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Configure the browserSync task
gulp.task('browserSync',
    function () {
        browserSync.init({
            // proxy: "localhost:4027"
            server: {
	            baseDir: "./"
	        }
        });
    });

gulp.task('bs-reload', function () {
    browserSync.reload();
});


// Default task
gulp.task('default', ['sass', 'css', 'js']);

gulp.task('watch', ['browserSync', 'sass', 'css', 'js'], function () {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.html, ['bs-reload']);
    gulp.watch(paths.sass, ['css']);
});