let gulp = require("gulp"),
    sass = require("gulp-sass"),
    htmlmin = require("gulp-htmlmin"), //сжатие хтмл
    browserSync = require("browser-sync"), // синхронизации с браузером
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    del = require("del"),
    image = require("gulp-image"), //сжатие изображений
    autoprefixer = require("gulp-autoprefixer"); //для кроссбраузерности 

gulp.task("clean", async function() {
  del.sync("dist");
});

gulp.task("scss", function() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 8 versions"]
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("css", function() {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      "node_modules/animate.css/animate.css"
    ])
    .pipe(concat("_libs.scss"))
    .pipe(gulp.dest("app/scss"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("html", function() {
  return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task('minify', () => {
  return gulp.src('app/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});
  

gulp.task("script", function() {
  return gulp.src("app/js/**/*.js").pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", function() {
  return gulp
    .src(['node_modules/wow.js/dist/wow.js'
  ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("app/js"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('image', function () {
  gulp.src('app/images/*')
    .pipe(image())
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('image', () => {
  gulp.src('app/images/*')
    .pipe(image({
      optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
      pngquant: ['--speed=1', '--force', 256],
      zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
      jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
      mozjpeg: ['-optimize', '-progressive'],
      guetzli: ['--quality', 85],
      gifsicle: ['--optimize'],
      svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors']
    }))
    .pipe(gulp.dest('./dist/images'));
});

gulp.task("export", function() {
 let buildHtml = gulp.src("app/**/*.html").pipe(gulp.dest("dist"));

  let BuildCss = gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));

  let BuildJs = gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js"));

  let BuildFonts = gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));

  let BuildImg = gulp.src("app/images/**/*.*").pipe(gulp.dest("dist/images"));
});



gulp.task("watch", function() {
  gulp.watch("app/scss/**/*.scss", gulp.parallel("scss"));
  gulp.watch("app/*.html", gulp.parallel("html"));
  gulp.watch("app/js/*.js", gulp.parallel("script"));
});

gulp.task("build", gulp.series("clean", "export"));

gulp.task(
  "default",
  gulp.parallel("css", "scss", "js", "html" ,"browser-sync", "watch")
);

