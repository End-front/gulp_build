var project_folder = 'dist',
    source_folder = 'app';
    
var path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  watch: {
    html: source_folder + '/html/**/*.html',
    scss: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*.*',
  },
  sourse: {
    html: source_folder + "/html",
    scss: source_folder + "/scss",
    js: source_folder + "/js",
    img: source_folder + "/img",
    fonts: source_folder + "/fonts"
  }
};

let config = {
  uncss: {
    html: [path.watch.html],
    ignore: ['.active', /.js-\.*/],
  },
  jscpd: {
    'min-lines': 10,
    verbose: true,
  },
  walidator: true,
  minimg: {},
  babelOff: {
    presets: ['@babel/env']
  }, 
};

const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const uncss = require('postcss-uncss');
const doiuse = require('doiuse');
const flexbugs = require('postcss-flexbugs-fixes');
var autopolyfiller = require('gulp-autopolyfiller');
var mergeStream = require('merge-stream');
var order = require("gulp-order");
var jscpd = require('gulp-jscpd');
var htmlValidator = require('gulp-w3c-html-validator');
var babel = require('gulp-babel');
var pagebuilder = require('gulp-pagebuilder');
var minImage = require('gulp-image');
var fs = require("fs");

function initProject(cb) {
  fs.stat(source_folder, function(err, stats) {
    if (err) {
      fs.mkdirSync(source_folder)
    }
  })
  fs.stat(path.sourse.html, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.sourse.html)
        fs.writeFile(path.sourse.html + "/index.html", '', function(err){
          if (err) {console.log(err);}
        })
        fs.mkdirSync(path.sourse.html + "/include")
        fs.mkdirSync(path.sourse.html + "/page")
    }
  })
  fs.stat(path.sourse.scss, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.sourse.scss)
        fs.writeFile(path.sourse.scss + "/style.scss", '', function(err){
          if (err) {console.log(err);}
        })
        fs.mkdirSync(path.sourse.scss + "/generic")
        fs.mkdirSync(path.sourse.scss + "/module")
        fs.mkdirSync(path.sourse.scss + "/lib")
    }
  })
  fs.stat(path.sourse.js, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.sourse.js)
        fs.writeFile(path.sourse.js + "/script.js", '', function(err){
          if (err) {console.log(err);}
        })
        fs.mkdirSync(path.sourse.js + "/vendor")
    }
  })
  fs.stat(path.sourse.img, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.sourse.img)
        fs.mkdirSync(path.sourse.img + "/favicon")
    }
  })
  fs.stat(path.sourse.fonts, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.sourse.fonts)
    }
  })
  fs.stat(project_folder, function(err, stats) {
    if (err) {
        fs.mkdirSync(project_folder)
    }
  })
  fs.stat(path.build.css, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.build.css)
    }
  })
  fs.stat(path.build.js, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.build.js)
    }
  })
  fs.stat(path.build.img, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.build.img)
    }
  })
  fs.stat(path.build.fonts, function(err, stats) {
    if (err) {
        fs.mkdirSync(path.build.fonts)
    }
  })
  cb()
}

function browserssync(cb) {
  browserSync.init({ 
    server: {
        baseDir: project_folder + "/",
    },
    ui: {
      port: 80,
    },
    notify: false,
  });
  cb();
}
function scss(cb) {
  var scss = src(path.watch.scss)
      .pipe(sass({outputStyle: "expanded"}))

  if (config.uncss) {
    scss = scss
    .pipe(postcss([uncss(config.uncss)]))
  }

  return scss      
      .pipe(postcss([flexbugs({ bug6: false })]))
      .pipe(autoprefixer())
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({stream: true}))
}


function javascript() {
  var script = src(path.watch.js);
  
  if (config.jscpd) {
  script.pipe(jscpd(config.jscpd));
  }

  if (config.babel) {
    script = script
    .pipe(babel(config.babel));
  }
  var polyfills = script
      .pipe(autopolyfiller('polyfills.js'));
  
  
  return mergeStream(polyfills, script)
      .pipe(order([
          'polyfills.js',
          path.watch.js,
      ]))
      .pipe(concat('script.js')) 
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({stream: true}))
}

function html() {
  var html = src(path.watch.html)
  .pipe(pagebuilder('src'));

  if (config.walidator) {
    html
    .pipe(htmlValidator())
  }

  return html
  .pipe(dest(path.build.html))
  .pipe(browserSync.reload({stream: true}))
}

function image() {
  var image = src(path.watch.img);
  if (config.minimg) {
    image = image
    .pipe(minImage(config.minimg))
  }
  return image
  .pipe(dest(path.build.img))
  .pipe(browserSync.reload({stream: true}))
}

function clean(pathName) {
  return function clean(cb) {
    del(pathName);
    cb();
  } 
}

function watchFile(cb) {
  watch(path.watch.html, parallel(html)),
  watch(path.watch.img, parallel(image)),
  watch(path.watch.scss, parallel(scss)),
  watch(path.watch.js, parallel(javascript)),
  cb()
};

exports.browserssync = browserssync;
exports.scss = scss;
exports.image = image;
exports.html = html;
exports.javascript = javascript;
exports.init = initProject;
exports.watchFile = watchFile;
exports.default = series(initProject, browserssync, watchFile)


// function caniuse(cb) {
//   if (config.caniuse) {
//     return src(path.build.css + "**/*.css")
//         .pipe(postcss([doiuse({
//           browsers: ["> 0.1%", "last 2 versions", "not ie 5.5-10"],
//           ignore: ['rem', 'em', 'vw', 'vh', 'calc', 'flexbox'],
//           onFeatureUsage: function(usageInfo) { },
//         })]))
//   } else {
//     cb()
//   }
// }
// exports.caniuse = caniuse



// const gulp = require('gulp'),
//     sass = require('gulp-sass'),
//     browserSync = require('browser-sync'),
//     uglify = require('gulp-uglify'),
//     concat = require('gulp-concat'),
//     rename = require('gulp-rename'),
//     del = require('del'),
//     autoprefixer = require('gulp-autoprefixer'),
//     postcss = require('gulp-postcss'),
//     uncss = require('postcss-uncss'),
//     doiuse = require('doiuse'),
//     flexbugs = require('postcss-flexbugs-fixes');




// gulp.task('scss', function(){
//     return gulp.src([path.watch.scss])
//     .pipe(sass({outputStyle: "expanded"}))
//     .pipe(postcss([flexbugs({ bug6: false })]))
//     .pipe(autoprefixer())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('app/css'))
//     .pipe(browserSync.reload({stream: true}))
// });


// gulp.task('css', async function(){
//   return gulp.src([
//     'node_modules/normalize.css/normalize.css',
//   ])
//     .pipe(concat('_libs.scss'))
//     .pipe(gulp.dest('app/scss'))
//     .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('uncss', async function(){
//   return gulp.src([
//     // 'app/scss/lib/fontello.css',
//     // 'app/scss/lib/owl.carousel.min.css',
//     // 'app/scss/lib/owl.theme.default.css',
//   ])
//     .pipe(concat('lib.scss'))
//     .pipe(gulp.dest('app/scss'))
//     .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('doiuse', function(){
//   return gulp.src('app/scss/style.scss')
//   .pipe(postcss([doiuse({browsers: ["> 0.3%", "last 12 versions", "not ie 5.5-9", "not dead", "not op_mini all"], ignore: ['rem', 'css-sel2', 'flexbox'], onFeatureUsage(info) {
//     const selector = info.usage.parent.selector;
//     const property = `${info.usage.prop}: ${info.usage.value}`;

//     let status = info.featureData.caniuseData.status.toUpperCase();

//     if (info.featureData.missing) {
//         status = 'NOT SUPPORTED'.red;
//     } else if (info.featureData.partial) {
//         status = 'PARTIAL SUPPORT'.yellow;
//     }

//     console.log(`\n${status}:\n\n    ${selector} {\n        ${property};\n    }\n`);
//   }})]))
// });

// gulp.task('scss', function(){
//   return gulp.src('app/scss/**/*.scss')
//     .pipe(sass({outputStyle: "expanded"}))
//     .pipe(postcss([flexbugs({ bug6: false })]))
//     .pipe(autoprefixer())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('app/css'))
//     .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('html', function(){
//   return gulp.src('app/*.html')
//   .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('script', function(){
//   return gulp.src('app/js/*.js')
//   .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('js', function(){
//   return gulp.src('')
//     .pipe(concat('libs.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('app/js'))
//     .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('browser-sync', function() {
//   browserSync.init({
//       server: {
//           baseDir: "app/",
//       },
//       ui: {
//         port: 80,
//       },
//       notify: false,
//   });
// });

// gulp.task('export', function(){
//   let buildHtml = gulp.src('app/**/*.html')
//     .pipe(gulp.dest('dist'));

//   let BuildCss = gulp.src('app/css/**/*.css')
//     .pipe(gulp.dest('dist/css'));
  
//   let BuildUncss =  gulp.src([
//     'app/css/grid.min.css',
//     'app/css/lib.min.css',
//   ])
//     .pipe(postcss([uncss(
//       {
//         html: ['app/**/*.html'],
//       }
//     )]))
//     .pipe(gulp.dest('dist/css'));
  
//   let BuildJs = gulp.src('app/js/**/*.js')
//     .pipe(gulp.dest('dist/js'));
    
//   let BuildFonts = gulp.src('app/font/**/*.*')
//     .pipe(gulp.dest('dist/font'));

//   let BuildImg = gulp.src('app/img/**/*.*')
//    .pipe(image()) 
//    .pipe(gulp.dest('dist/img'));   
// });

// gulp.task('watch', function(){
//   gulp.watch('app/scss/**/*.scss', gulp.parallel('scss', 'doiuse'));
//   gulp.watch('app/*.html', gulp.parallel('html'))
//   gulp.watch('app/js/*.js', gulp.parallel('script'))
// });

// gulp.task('build', gulp.series('clean', 'export'));

// gulp.task('default', gulp.parallel('css', 'doiuse', 'scss', 'browser-sync', 'watch')); //? Добавивить uncss, когда нужно