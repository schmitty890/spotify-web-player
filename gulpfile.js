const gulp = require('gulp');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const reload = browserSync.reload;
const clean = require('gulp-clean');
const maps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('travis', ['clean', 'serve'], function() {
  process.exit(0);
});

// default gulp task that runs clean and then serve tasks
gulp.task('default', function(done) {
  runSequence('clean', 'serve', function() {
    done();
  });
});

// starts browsersync and watches changes on sass and client side js files. when changes are made, kickoff sass task or concatScripts task
gulp.task('serve', ['browser-sync'], function() {
  gulp.watch('public/assets/sass/*/*.sass', ['sass']);
  gulp.watch('public/assets/js/*/*.js', ['concatScripts']);
});

// browsersync is initialized and starts nodemon to keep the server running
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:8888',
    open: false,
    port: 3000
  });
});

// nodemon watches our application to keep it running when changes are made so we don't have to stop and restart everytime a change is made
gulp.task('nodemon', ['sass', 'concatScripts'], function(done) {
  let running = false;
  return nodemon({
    script: 'server.js',
    watch: 'public/assets'
  }).on('start', function() {
    console.log('--------------------start----------------');
    if(!running) {
      done();
    }
    running = true;
  }).on('restart', function() {
    console.log('--------------------restart----------------');
    setTimeout(function() {
      reload();
    }, 2000);
  });
});

// creates our minified sass file, writes it to the build folder
gulp.task('sass', function() {
  return gulp.src('public/assets/sass/styles.sass')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('build/css'))
  .pipe(cleanCSS())
  .pipe(rename('styles.min.css'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('build/css'))
});


// cleans the folder (removes it so it can be generated again)
gulp.task('clean', function() {
  console.log('gulp clean task');
  return gulp.src([
      'build/'
  ])
  .pipe(clean());
});

// creates our minified js file, writes it to the build folder
gulp.task('concatScripts', function() {
  console.log('gulp concatScripts task');
  return gulp.src([
    './public/assets/js/*/*.js'
  ])
  .pipe(maps.init())
  .pipe(babel({
    presets: ['env']
  }))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(rename('app.min.js'))
  .pipe(uglify())
  .on('error', function() { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  .pipe(maps.write('./'))
  .pipe(gulp.dest('build/js'))
});



