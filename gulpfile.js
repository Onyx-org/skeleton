var gulp = require('gulp');
var sass = require('gulp-sass');

var paths = {
    sass: 'project/assets/sass/',
     css: 'project/assets/css/',
     bower: 'project/vendor-front/' ,
    www: 'project/www/'
}

gulp.task('sass', function() {
    return gulp.src(paths.sass + 'main.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths.css));
});

// symlink does not work while documentation says they do !
gulp.task('publish', function() { 
    return gulp.src(paths.css + '*.css', {followSymlinks: false})
        .pipe(gulp.dest(paths.www + 'assets/css')); 
});
