var gulp = require('gulp');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');

var paths = {
    sass: 'project/assets/sass/',
     css: 'project/assets/css/',
     bower: 'project/vendor-front/' ,
    www: 'project/www/'
}

gulp.task('sass', function() {
    return gulp.src(paths.sass + 'main.scss')
        .pipe(sass())
        .pipe(csscomb())
        .pipe(cssbeautify({indent: '    '}))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.css));
});

gulp.task('minify', function() {
    return gulp.src(paths.css + 'main.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.css));
});

// symlink does not work while documentation says they do !
gulp.task('publish', function() { 
    return gulp.src(paths.css + '*.css', {followSymlinks: false})
        .pipe(gulp.dest(paths.www + 'assets/css')); 
});
