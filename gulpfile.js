const { src, dest, series, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const rename = require('gulp-rename');

// Таск компиляции SASS в CSS
function buildSass() {
    return src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
        .pipe(
            postcss([
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ['last 2 versions']
                }),
                cssnano()
            ])
        )
        .pipe(dest('src/css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Таск компиляции SASS в CSS
function buildSassDev() {
    return src('src/scss/**/*.scss')
        .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
        .pipe(
            postcss([
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ['last 2 versions']
                }),
                cssnano()
            ])
        )
        .pipe(dest('src/css'))
        .pipe(browserSync.stream());
}

// Таск работы с html файлами
function buildHtml() {
    return src('src/**/*.html')
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// Таск работы с  js файлами
function buildJs() {
    return src('src/js/index.js')
      .pipe(webpackStream(require('./webpack.config')))
      .pipe(rename('main.min.js'))
      .pipe(dest('src/js'))
      .pipe(dest('dist/js'))
      .pipe(browserSync.stream());
  }

// Таск копирования статичных файлов
function copy() {
    return src(['src/assets/**/*.*'], { base: 'src' }).pipe(dest('dist/'));
}

//Таск копирования js
function copyJs () {
    return src('src/js/*.js').pipe(dest('dist/js'));
};

// Таск очистки dist
function cleanDist() {
    return src('dist', { allowEmpty: true }).pipe(clean());
}

// Таск отслеживания изменения файлов
function serve() {
    watch(['src/js/**/*.js', '!src/js/**/*.min.js'], buildJs);
    watch('src/scss/**/*.scss', buildSassDev);
    watch('src/**/*.html', buildHtml);
}

// Создание дев-сервера
function createDevServer() {
    browserSync.init({
        server: 'src',
        notify: false
    })
}

exports.build = series(cleanDist, parallel(cleanDist, buildSass, buildHtml, copy, buildJs));
exports.default = series([buildSassDev, buildJs], parallel(createDevServer, serve));