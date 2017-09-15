let gulp = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");
let nodemon = require('gulp-nodemon');
let process = require("process");
let clean = require('gulp-rimraf');
let started = !1;
let paths = {
    js: [
        'dist/*.js',
        '!node_modules',

    ]
};
gulp.task("build", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest("dist").on('end', () => {
            console.log('Build Success')
            process.exit(0);
        }));
});

gulp.watch('./src/**/*.ts', ['compile'])
gulp.task("compile", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest("dist"));
});

gulp.task('dev', ['clean', 'compile'], (e) => {
    nodemon({
        script: 'dist/app.js',
        ext: 'js',
        watch: paths.js,
        env: require('./env/dev.json'),
        ignore: ['./node_modules/**'],
        delay: 3,
        verbose: true
    }).on('start', () => {
        started || (started = !0, e());
    });
});


gulp.task('stage', ['clean', 'compile'], (e) => {
    nodemon({
        script: 'dist/app.js',
        ext: 'js',
        watch: paths.js,
        env: require('./env/stage.json'),
        ignore: ['./node_modules/**']
    }).on('start', () => {
        started || (started = !0, e());
    });
});



gulp.task('prod', ['clean', 'compile'], (e) => {
    nodemon({
        script: 'dist/app.js',
        ext: 'js',
        watch: paths.js,
        env: require('./env/prod.json'),
        ignore: ['./node_modules/**'],
    }).on('start', () => {
        started || (started = !0, e());
    });
});

gulp.task('clean', [], function() {
    console.log("Clean all files in build folder");
    return gulp.src("dist/").pipe(clean());
});