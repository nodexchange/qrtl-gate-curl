var gulp = require('gulp');  
var browserSync = require('browser-sync');

gulp.task('js', function () {  
    gulp.src('src/*.js')
        .pipe(minify())
        .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'
});

gulp.task('sass', function () {  
    gulp.src('scss/styles.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {  
    browserSync.init("src/*.js", {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['browser-sync'], function () {  
    gulp.watch("js/*.js", ['js']);
});