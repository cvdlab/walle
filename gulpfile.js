var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('serve', function () {
  browserSync.init({
    server: {
      port: 3000,
      baseDir: "./src"
    }
  });

  gulp.watch("./src/**/*.html").on("change", browserSync.reload);
  gulp.watch("./src/**/*.js").on("change", browserSync.reload);
  gulp.watch("./src/**/*.css").on("change", browserSync.reload);
});
