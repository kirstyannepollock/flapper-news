'use strict';

var gulp = require('gulp');

var jQueryBase = './bower_components/jquery/dist/';
var jQueryMin = jQueryBase + 'jquery.min.js';

var angularBase = './bower_components/angular/';
var angularMin = angularBase + 'angular.js';

var angularUiRouterBase = './bower_components/angular-ui-router/release/';
var angularUi = angularUiRouterBase + 'angular-ui-router.js';

var bootstrapBase = './bower_components/bootstrap/';
var bootstrapDist = bootstrapBase + 'dist/**/*';

var vendorDest = './vendor' ;

var onError = function(err) 
{
  console.log(err);
};

//==========================================
// SCSS Transpiling
// Not used here - YET!
//==========================================
// //var sass = require('gulp-sass');
//
// var sassSrc = './scss/**/*.scss';
// var cssDest = './css';
//
// gulp.task('sass', function () {
//   gulp.src(sassSrc)
//     .pipe(sass({includePaths: ['./scss']})
//       .on('error', sass.logError))
//     .pipe(gulp.dest(cssDest));
// });
//
//**TODO: add***
//
// gulp.task( 'automate', function() {
//   gulp.watch( [ sassSrc, jsSrc ], [ 'scripts', 'styles' ] );
// });
//==========================================

// ==========================================
// Browserify(requires, bundling)
// ==========================================
//https://omarfouad.com/

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var browserifySrc = './scripts/**/*.js';
//var browserifySrc = './scripts/app.js';
var browserifyDest = './js';

gulp.task('browserify', function() {
	// Grabs the app.js file
    return browserify('./scripts/app.js')
  // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the browserifyDestdirectory
        .pipe(gulp.dest(browserifyDest));
});

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
}

gulp.task('watch', function() {
	gulp.watch(browserifySrc, ['browserify'])
  .on('error', swallowError);
});

// ==========================================

gulp.task( 'bootstrap', function() 
{
  return  gulp.src(bootstrapDist)
            .pipe(gulp.dest(vendorDest + '/bootstrap') );
});


gulp.task( 'jquery', function() 
{
  return  gulp.src(jQueryMin)
            .pipe(gulp.dest(vendorDest) );
});

gulp.task( 'angular', function() 
{
  return  gulp.src(angularMin)
            .pipe(gulp.dest(vendorDest) );
});

 
gulp.task( 'angular-ui-router', function() 
{
  return  gulp.src(angularUi)
            .pipe(gulp.dest(vendorDest) );
});

gulp.task( 'angular-all', ['angular', 'angular-ui-router'] );
gulp.task( 'vendor', ['jquery', 'angular', 'bootstrap'] );