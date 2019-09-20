'use strict';
// gulp 4

const gulp = require('gulp');
const watch = require('gulp-watch');
const rigger = require('gulp-rigger');
const imagemin = require('gulp-imagemin');
// const image = require('gulp-image');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

sass.compiler = require('node-sass');

var path = {
	html: {
		src: 'app/*.html',
		dest: 'dist/',
		watch: 'app/**/*.html'
	},
	style: {
		src: 'app/scss/*.scss',
		dest: 'dist/files/',
		watch: 'app/scss/**/*.scss'
	},
	js: {
		src: [
			// 'node_modules/jquery/dist/jquery.js',
			'app/js/*.js'
		],
		dest: 'dist/files/',
		watch: 'app/js/**/*.js'
	},
	fonts: {
		src: 'app/fonts/**/*.*',
		dest: 'dist/files/fonts/',
		watch: 'app/fonts/**/*.*'
	},
	img: {
		src: 'app/img/**/*.*',
		dest: 'dist/files/img/',
		watch: 'app/img/**/*.*'
	},
	clean: 'dist/**/*'
};

var config = {
	server: {
		baseDir: 'dist/'
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
		.pipe(sourcemaps.init())
		.pipe(rigger())
		.pipe(concat('main.min.js', { newLine: ';' }))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.js.dest))
		.pipe(reload({ stream: true }));
});

// styles
gulp.task('style', function () {
	return gulp.src(path.style.src)
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.scss'))
		.pipe(sassGlob())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false }))
		// .pipe(gcmq())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.style.dest))
		.pipe(reload({ stream: true }));
});

// images
gulp.task('image', function () {
	return gulp.src(path.img.src)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{ removeViewBox: true }]
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
gulp.task('clean', function () {
	return gulp.src(path.clean, { read: false })
		.pipe(rm())
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