var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var nunjucksRender = require('gulp-nunjucks-render');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');

// Start browserSync server
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app',
			index: 'index.html'
		},
	})
});

// compiling html from templates
gulp.task('nunjucks', function() {
	// Gets .html and .nunjucks files in pages folder
	return gulp.src('app/pages/**/*.+(html|nunjucks)')
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "Compile Error",
					message: "<%= error.message %>",
					sound: "beep"
				})(err);
				this.emit('end');
			}
		}))
		// Renders template with nunjucks
		.pipe(nunjucksRender({
			path: ['app/templates']
		}))
		// Output files in app folder
		.pipe(gulp.dest('app'))
});

// Error
var onError = function (err) {
	console.log(err);
	this.emit('end');
}

// Sass changes and compile into css
gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "Compile Error",
					message: "<%= error.message %>",
					sound: "beep"
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({includePaths: ['app/scss/partials', 'app/scss/modules', 'app/scss/vendors']}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Watchers
gulp.task('watch', ['nunjucks', 'browserSync', 'sass'], function (){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch(['app/templates/**/*.nunjucks', 'app/pages/**/*.nunjucks'], ['nunjucks'], browserSync.reload);
});

// Optimizing CSS and Javascript
gulp.task('useref', function() {
	return gulp.src(['app/**/*.html', '!app/prototype/**/*.html'])
	.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "Compile Error",
					message: "<%= error.message %>",
					sound: "beep"
				})(err);
				this.emit('end');
			}
		}))
	.pipe(useref())
	// minifies only js
	.pipe(gulpIf('*.js', uglify()))
	// minifies only css
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

// Optimize Images
gulp.task('images', function(){
	return gulp.src(['app/images/**/*.+(png|jpg|gif|svg)', '!app/images/**/*.sketch'])
		//Caching images that ran through imagemin
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
});

// Clear Image Cache
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
});

// Copy fonts to Dist Folder
gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

// Clear cache
gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

// Cleaning Dist Folder
gulp.task('clean:dist', function() {
	return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Watch Sequence - compile scss, start server and watch changes
gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync'], 'watch',
		callback)
});

// Build and Compile Sequence - into Dist folder
gulp.task('build', function(callback) {
	runSequence(
		'clean:dist', 
		['sass', 'nunjucks', 'useref', 'images', 'fonts'],
		callback
	)
});