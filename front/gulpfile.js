var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

// This runs when 'gulp' is called in command line
gulp.task('default', () => {
  watch('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css/'));
})
