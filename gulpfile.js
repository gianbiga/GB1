// Include Gulp plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    prefix = require('gulp-autoprefixer'), 
    plumber = require('gulp-plumber'),
    path = require('path')
    fs = require('fs'); //File System module para ler ou criar arquivos
let cleanCSS = require('gulp-clean-css');

// Compile LESS to CSS
gulp.task('build-less', function(name) {
  return gulp.src('./less/*.less') // path to less file
    .pipe(plumber())
    .pipe(less({
      paths: ['./less/', './css/']
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./_dist/'))// path to css directory
})

// Watch all LESS files, then run build-less
gulp.task('watch', function() {
  gulp.watch('less/*.less', ['build-less'])
})

// Default will run the 'entry' task
gulp.task('default', ['watch', 'build-less'])
