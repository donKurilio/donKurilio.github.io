var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    scco = require('gulp-csso'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    ngAnnotate = require('gulp-ng-annotate'),
    rimraf = require('rimraf');
gulp.task('build', ['clean','fonts:build'], function () {
    return gulp.src(['*.html',
            'persons.json',
            'positionsOfEmployees.json'])
        .pipe(useref())
        .pipe(gulpif('*.js', rev()))
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', scco()))
        .pipe(gulpif('*.css', rev()))
        .pipe(revReplace())
        .pipe(gulp.dest('build'));
});
gulp.task('fonts:build',function(){
    return gulp.src('bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('build/fonts'));
});
gulp.task('clean', function (cb) {
    rimraf('build', cb);
});