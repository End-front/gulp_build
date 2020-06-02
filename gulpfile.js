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
    uncss = require('postcss-uncss'),
    doiuse = require('doiuse'),
    flexbugs = require('postcss-flexbugs-fixes'),
    image = require('gulp-image');

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

gulp.task('uncss', async function(){
  return gulp.src([
    // 'app/scss/lib/fontello.css',
    // 'app/scss/lib/owl.carousel.min.css',
    // 'app/scss/lib/owl.theme.default.css',
  ])
    .pipe(concat('lib.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('doiuse', function(){
  return gulp.src('app/scss/style.scss')
  .pipe(postcss([doiuse({browsers: ["> 0.3%", "last 12 versions", "not ie 5.5-9", "not dead", "not op_mini all"], ignore: ['rem', 'css-sel2', 'flexbox'], onFeatureUsage(info) {
    const selector = info.usage.parent.selector;
    const property = `${info.usage.prop}: ${info.usage.value}`;

    let status = info.featureData.caniuseData.status.toUpperCase();

    if (info.featureData.missing) {
        status = 'NOT SUPPORTED'.red;
    } else if (info.featureData.partial) {
        status = 'PARTIAL SUPPORT'.yellow;
    }

    console.log(`\n${status}:\n\n    ${selector} {\n        ${property};\n    }\n`);
  }})]))
});

gulp.task('scss', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(postcss([flexbugs({ bug6: false })]))
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

gulp.task('js', function(){
  return gulp.src('')
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "app/",
      },
      ui: {
        port: 80,
      },
      notify: false,
  });
});

gulp.task('export', function(){
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));
  
  let BuildUncss =  gulp.src([
    'app/css/grid.min.css',
    'app/css/lib.min.css',
  ])
    .pipe(postcss([uncss(
      {
        html: ['app/**/*.html'],
      }
    )]))
    .pipe(gulp.dest('dist/css'));
  
  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
    
  let BuildFonts = gulp.src('app/font/**/*.*')
    .pipe(gulp.dest('dist/font'));

  let BuildImg = gulp.src('app/img/**/*.*')
   .pipe(image()) 
   .pipe(gulp.dest('dist/img'));   
});

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss', 'doiuse'));
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default', gulp.parallel('css', 'doiuse', 'scss', 'browser-sync', 'watch')); //? Добавивить uncss, когда нужно