/**
 * Created by Rodey on 2017/4/12.
 */

const
    gulp         = require('gulp'),
    gulpDisplace = require('../index');


gulp.task('default', function(){

    gulp.src('assets/a.txt')
        .pipe(gulpDisplace({ search: /(and)/gi, result: function(m, $1){
            console.log(m, $1);
            return '+';
        } }))
        .pipe(gulp.dest('dist'));
});