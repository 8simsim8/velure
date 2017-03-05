var gulp   = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var Filter = require('gulp-filter');
var cleanCSS = require('gulp-cssmin');
var uglify = require('gulp-uglify');

gulp.task('include-minife-css', function () {

    return gulp.src([
            // './vendor/**.styl',
            './css/**.css'
        ])
        // .pipe(stylus())
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./app/css'));
});

gulp.task('compress', function() {
    return gulp.src([
            './js/**.js'
        ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'));
});

var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');

gulp.task('minifyHtml', function() {
  return gulp.src('**.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./app'));
});

gulp.task('default', ['include-minife-css','compress','minifyHtml']);