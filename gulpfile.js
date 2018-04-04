const gulp = require("gulp");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const uglify = require('gulp-uglify');
const uglifify = require('uglifyify');
const envify = require('envify/custom');

gulp.task('build:debug:posts', () => {
    browserify({
        entries: './_apps/posts/index.jsx',
        extensions: ['jsx'],
        debug: true
    })
    .transform(envify({ global: true, NODE_ENV: 'development' }))
    .transform(babelify, { presets: [ 'env', 'react' ] })
    .bundle()
    .pipe(source('posts.js'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('build:posts', () => {
    browserify({
        entries: './_apps/posts/index.jsx',
        extensions: ['jsx'],
        debug: false
    })
    .transform(envify({ global: true, NODE_ENV: 'production' }))
    .transform(babelify, { presets: [ 'env', 'react' ] })
    .transform(uglifify, { global: true })
    .bundle()
    .pipe(source('posts.js'))
    .pipe(require('vinyl-buffer')())
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('build:debug:gallery', () => {
    browserify({
        entries: './_apps/gallery/index.js',
        extensions: ['jsx', 'js'],
        debug: true
    })
    .transform(babelify, { presets: [ 'env', 'react-app' ] })
    .transform(envify({ NODE_ENV: 'development' }))
    .bundle()
    .pipe(source('gallery.js'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('build:gallery', () => {
    browserify({
        entries: './_apps/gallery/index.js',
        extensions: ['jsx', 'js'],
        debug: false
    })
    .transform(babelify, { presets: [ 'env', 'react-app' ] })
    .transform(envify({ NODE_ENV: 'production' }))
    .transform(uglifify, { global: true })
    .bundle()
    .pipe(source('gallery.js'))
    .pipe(require('vinyl-buffer')())
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('build:debug', [ 'build:debug:gallery', 'build:debug:posts' ]);

gulp.task('build', [ 'build:gallery', 'build:posts' ]);
