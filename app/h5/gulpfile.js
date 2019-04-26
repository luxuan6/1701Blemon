const gulp = require('gulp');
const server = require('gulp-webserver');

gulp.task('server', function() {
    gulp.src('./src/')
        .pipe(server({
            open: true,
            port: 8787,
            livereload: true,
            proxies: [{
                source: '/api/findbill',
                target: 'http://localhost:3000/api/findbill'
            }, {
                source: '/api/getBill',
                target: 'http://localhost:3000/api/getBill'
            }, {
                source: '/api/remove',
                target: 'http://localhost:3000/api/remove'
            }, {
                source: '/api/classify',
                target: 'http://localhost:3000/api/classify'
            }]
        }))

})