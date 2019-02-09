var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

// This runs when 'gulp' is called in command line
gulp.task('default', () => {


  /* Note, watches not sass folder by sass/components. That means:
    a) files outside of sass/components will have to be extended by a file inside sass/components
    b) changes to files outside of sass/components will not trigger update
  */
  watch('sass/components/**/*.scss', {ignoreInitial: false})
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css/'));

});
