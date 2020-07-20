var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    bourbon = require('node-bourbon'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    uglifycss = require('gulp-uglifycss'),
    plumber = require('gulp-plumber'),
    mkdirp = require('mkdirp'),
    ngAnnotate = require('gulp-ng-annotate');


const vPath = 'node_modules/';
var path = {
    // [bootstrap-grid, bootstrap-reboot, bootstrap]
  vendorcss: ['src/scss/vendor.scss',
               vPath + 'angular-ui-bootstrap/dist/ui-bootstrap-csp.css'
             ],
  style: 'src/scss/main.scss',
  vendorjs: [
              'src/js/lib/angular.js',
              'src/js/lib/angular-route.js',
              vPath + 'angular-ui-bootstrap/dist/ui-bootstrap.js',
              vPath + 'angular-ui-bootstrap/dist/ui-boostrap-tpls.js',
              vPath + 'angular-ui-ace/src/ui-ace.js',
              vPath + 'angular-bootstrap-contextmenu/contextMenu.js'
            ], // [Bootstrap, Angular, 'Tether', 'Ace', 'ContextMENU', "ngAnimates"]
  scripts: ['src/js/app.js',
            'src/js/**/*.js',
            '!src/js/lib/angular.js',
            '!src/js/lib/angular-route.js',
            '!src/js/lib/tether.js'], // [Custom Scripts]
  images: 'src/images/*.*',
  bourbonPath: 'src/scss/**/*.scss',
  html: './src/views/**/*.html'
};

// Compile SCSS to CSS

gulp.task('html', function() {
    return gulp.src('./src/views/**/*.html')
          .pipe(gulp.dest('./dist/assets/views'))
          .pipe(notify({message: 'html task complete'}));
});


gulp.task('vendorcss', function() {
   return gulp.src(path.vendorcss)
          .pipe(sass())
          .pipe(concat('vendor.css'))
          .pipe(gulp.dest('dist/assets/css'))
          .pipe(notify({message: 'vendor task complete'}))
          .pipe(uglifycss({ "maxLineLen": '0', "uglifyComments": true }))
          .pipe(rename('vendor.min.css'))
          .pipe(sourcemaps.write('maps'))
          .pipe(gulp.dest('dist/assets/css'))
          .pipe(notify({message: 'vendor minified task complete'}));
});

// Styles
gulp.task('styles', function() {
    return gulp.src(path.style)
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(sass({ includePaths : path.bourbonPath }))
          .pipe(concat("main.css"))
          .pipe(gulp.dest('dist/assets/css'))
          .pipe(notify({message: 'styles task complete'}))
          .pipe(uglifycss({ "maxLineLen": '0', "uglifyComments": true }))
          .pipe(rename('main.min.css'))
          .pipe(sourcemaps.write('maps'))
          .pipe(gulp.dest('dist/assets/css'))
          .pipe(notify({message: 'styles min task complete'}));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(path.scripts)
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(concat('app.js', {newLine: ';'}))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('./dist/assets/js'))
          .pipe(uglify())
          .pipe(sourcemaps.write())
          .pipe(rename('app.min.js'))
          .pipe(ngAnnotate())
          .pipe(gulp.dest('./dist/assets/js'))
          .pipe(notify({ message: 'scripts task complete' }));
});

// Compile Bootstrap and JQuery
gulp.task('vendorjs', function() {
  return gulp.src(path.vendorjs)
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(concat('vendor.js'))
          .pipe(gulp.dest('./dist/assets/js'))
          .pipe(uglify())
          .pipe(rename('vendor.min.js'))
          .pipe(sourcemaps.write('maps'))
          .pipe(gulp.dest('./dist/assets/js'))
          .pipe(notify({message: 'vendorJS task complete'}));
});

//Minifying images
gulp.task('images', function() {
  return gulp.src(path.images)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'));
});

// Watch for html changes
gulp.task('html', function() {
  return gulp.src('./*.html')
        .pipe(gulp.dest(''))
        .pipe(notify({message: 'html task complete'}));
});

// Start a server
gulp.task('server', function() {
  gulp.src('./')
        .pipe(webserver({
            fallback: 'index.html',
            livereload: true,
            port: 8000,
            host: '192.168.21.111'
        }));

  gulp.watch(path.scripts, ['scripts']);
  gulp.watch([path.bourbonPath, path.style], ['styles']);
  gulp.watch(path.images, ['images']);
  gulp.watch(path.html, ['html']);
});

gulp.task('default', ['server']);
