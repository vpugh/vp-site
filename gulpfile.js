var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var uncss = require('gulp-uncss');

// Start browserSync server
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	})
});

// Error
var onError = function (err) {
	console.log(err);
	this.emit('end');
}

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
		.pipe(sass({includePaths: ['app/scss/partials', 'app/scss/library']}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('nunjucks', function() {
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
		.pipe(nunjucksRender({path: ['app/templates']}))
		.pipe(gulp.dest('app'))
});

gulp.task('watch', ['nunjucks', 'browserSync', 'sass'], function (){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch(['app/templates/**/*.nunjucks', 'app/pages/**/*.nunjucks'], ['nunjucks'], browserSync.reload);
})

gulp.task('useref', function() {
	return gulp.src('app/*.html')
	.pipe(useref())
	// minifies only js
	.pipe(gulpIf('*.js', uglify()))
	// minifies only css
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/')
	.pipe(gulp.dest('dist/fonts'))
});

gulp.task('ucss', function() {
	return gulp.src('app/css/**/*.css')
	.pipe(uncss({
		html: ['app/index.html']
	}))
	.pipe(gulp.dest('app/out'));
});