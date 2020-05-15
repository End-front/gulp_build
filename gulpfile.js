// let project_folder = 'dist',
//     source_folder = 'app';
// let path = {
//   build: {
//     html: project_folder + '/',
//     css: project_folder + '/css/',
//     js: project_folder + '/js/',
//     img: project_folder + '/img/',
//     fonts: project_folder + '/fonts/',
//   },
//   watch: {
//     html: source_folder + '/**/*.html',
//     scss: source_folder + '/scss/**/*.scss',
//     js: source_folder + '/js/**/*.js',
//     img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
//     fonts: source_folder + '/fonts/*.*',
//   }
// }

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss = require('gulp-postcss'),
    uncss = require('postcss-uncss');

gulp.task('clean', async function(){
  del.sync('dist')
})

gulp.task('css', async function(){
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scss', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
  return gulp.src('app/js/*.js')
  .pipe(browserSync.reload({stream: true}))
});

// gulp.task('js', function(){
//   return gulp.src('')
//     .pipe(concat('libs.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('app/js'))
//     .pipe(browserSync.reload({stream: true}))
// });

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "app/"
      },
      notify: false,
  });
});


gulp.task('export', function(){
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(postcss([uncss(
      {
        html: ['app/**/*.html'],
        ignore: ['.fade']
      }
    )]))
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
    
  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));   
});

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default', gulp.parallel('css' ,'scss', 'browser-sync', 'watch'));