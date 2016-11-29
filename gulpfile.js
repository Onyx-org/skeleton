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
    bower: 'project/bower_components/' ,
    www: 'project/www/',
    fontAwesome: 'project/bower_components/font-awesome/fonts/'
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

gulp.task('publish', ['publish-css', 'publish-fonts']);

// symlink does not work while documentation says they do !
gulp.task('publish-css', function() { 
    return gulp.src(paths.css + '*.css', {followSymlinks: false})
        .pipe(gulp.dest(paths.www + 'assets/css'))
});

// symlink does not work while documentation says they do !
gulp.task('publish-fonts', function() { 
    return gulp.src(paths.fontAwesome + '*.*', {followSymlinks: false})
        .pipe(gulp.dest(paths.www + 'assets/fonts'))
});
