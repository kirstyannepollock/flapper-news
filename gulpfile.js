'use strict';

var gulp = require('gulp');

var jQueryBase = './bower_components/jquery/dist/';
var jQueryMin = jQueryBase + 'jquery.min.js';

var angularBase = './bower_components/angular/';
var angularMin = angularBase + 'angular.min.js';

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

 
 gulp.task( 'vendor', ['jquery', 'angular'] );