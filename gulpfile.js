var gulp = require('gulp'),
    git = require('gulp-git'),
    merge = require('merge-stream'),
    zip = require('gulp-zip');

var codePath = 'd:\\gitStatic\\static\\',// 【\】需要转译
    outFolder = 'e:\\build',
    files = [],
    outputPath = [
        outFolder,
        new Date().toLocaleDateString(),
        "ROOT"
    ];

// Run git init
// src is the root folder for git to initialize
gulp.task('init', function () {
    git.init(function (err) {
        if (err) throw err;
    });
});

// Working tree status
gulp.task('status', function (cb) {
    return git.status({ cwd: codePath }, function (err, stdout) {
        if (err) throw err;
        files = stdout.match(/modified:(.)*|new file:(.)*/g);
        files = files.map(function (item) {
            return codePath + item.replace(/modified:|new file:/, '').replace(/\//g, "\\").trim();
        });
        cb(err);
    });
});

// copy
gulp.task("copy", ["status"], function () {
    var tasks = files.map(function (file) {
        var output = outputPath.join('\\');
        output += '\\' + file.replace(codePath, '').split("\\").slice(0, file.replace(codePath, '').split("\\").length - 1).join("\\");
        return gulp
            .src(file)
            .pipe(gulp.dest(output));
    });
    return merge(tasks);
});

// zip
gulp.task("zip", ["copy"], function () {
    console.log(outputPath.join('\\'));
    return gulp.src(outputPath.join('\\') + '\\**')
        .pipe(zip('ROOT.zip'))
        .pipe(gulp.dest(outputPath.slice(0,2).join('\\')));
});

// default
gulp.task("default", ["init", "status", "copy", "zip"]);