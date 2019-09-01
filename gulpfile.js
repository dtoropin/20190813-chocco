'use strict';
// gulp 4

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	minify = require('gulp-minify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-csso'),
	gcmq = require('gulp-group-css-media-queries'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var path = {
	html: {
		src: 'app/*.html',
		dest: './',
		watch: 'app/**/*.html'
	},
	style: {
		src: 'app/scss/*.scss',
		dest: 'files/',
		watch: 'app/scss/**/*.scss'
	},
	js: {
		src: 'app/js/*.js',
		dest: 'files/',
		watch: 'app/js/**/*.js'
	},
	fonts: {
		src: 'app/fonts/**/*.*',
		dest: 'files/fonts/',
		watch: 'app/fonts/**/*.*'
	},
	img: {
		src: 'app/img/**/*.*',
		dest: 'files/img/',
		watch: 'app/img/**/*.*'
	},
	clean: './files'
};

var config = {
	server: {
		baseDir: './'
	},
	host: 'localhost',
	port: 9000,
	browser: ['chrome']
};

// html
gulp.task('html', function () {
	return gulp.src(path.html.src)
		.pipe(rigger())
		.pipe(gulp.dest(path.html.dest))
		.pipe(reload({ stream: true }));
});

// js
gulp.task('js', function () {
	return gulp.src(path.js.src)
		.pipe(rigger())
		.pipe(minify({
			noSource: true,
			ext: {
				min: '.min.js'
			}
		}))
		.pipe(gulp.dest(path.js.dest))
		.pipe(reload({ stream: true }));
});

// styles
gulp.task('style', function () {
	return gulp.src(path.style.src)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compact' }).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(prefixer())
		// .pipe(gcmq())
		// .pipe(cssmin())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.style.dest))
		.pipe(reload({ stream: true }));
});

// images
gulp.task('image', function () {
	return gulp.src(path.img.src)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.img.dest))
		.pipe(reload({ stream: true }));
});

// fonts
gulp.task('fonts', function () {
	return gulp.src(path.fonts.src)
		.pipe(gulp.dest(path.fonts.dest))
});

// build
gulp.task('build', gulp.parallel('html', 'js', 'style', 'image', 'fonts'));

// watch
gulp.task('watch', function () {
	watch([path.html.watch], gulp.series('html'));
	watch([path.style.watch], gulp.series('style'));
	watch([path.js.watch], gulp.series('js'));
	watch([path.img.watch], gulp.series('image'));
	watch([path.fonts.watch], gulp.series('fonts'));
});

// server
gulp.task('webserver', function () {
	browserSync(config);
});

// clean
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

// default task
gulp.task('default', gulp.series('clean', 'build', gulp.parallel('webserver', 'watch')));

//svg sprite
var svgSprite = require('gulp-svg-sprite');
gulp.task('svgSprite', function () {
	return gulp.src('source/icons/*.svg') //svg files for sprite
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"  //sprite file name
				}
			},
		}
		))
		.pipe(gulp.dest('app/img/'));
});