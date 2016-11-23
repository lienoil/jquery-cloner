var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

var directories = {
    assets: {
        js: 'assets/js',
    },
    build: {
        js: 'build/js',
    },
    dist: {
        js: 'dist/js',
    },
    public: {
        js: 'public/js',
    },
    root: {
        js: 'js',
    },
    resources: {
        js: 'src'
    }
}

var _name = 'jquery-cloner.js';

/*
| # Scripts
|
| The js files to be concatinated
| and saved to different folders.
|
| @run  gulp scripts
|
*/
gulp.task('scripts', function () {
    return gulp.src(directories.resources + '/**/*.js')
        .pipe(concat(_name))
        .pipe(gulp.dest(directory.js.build))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(directory.js.build))
        .pipe(gulp.dest(directory.js.dist))
        .pipe(notify({ message: 'Completed compiling JS Files' }));
});

/*
| # Clean
|
| @run  gulp clean
*/
gulp.task('clean', function () {
    return del(['js']);
});

/*
| # Default Task
|
| @run  gulp default
*/
gulp.task('default', ['clean'], function () {
    gulp.start('scripts');
});

/*
| # Watcher
|
| @run  gulp watch
*/
gulp.task('watch', function () {
    // Create LiveReload server
    // livereload.listen();
    // Watch any files in , reload on change
    // gulp.watch(['**']).on('change', livereload.changed);

    // Watch .js files
    gulp.watch(directories.resources + '/**/*.js', ['scripts']);
});