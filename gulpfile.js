var gulp = require('gulp'),
    git = require('gulp-git'),
    merge = require('merge-stream'),
    codePath = 'd:\\gitCodeM\\qyd\\deploy\\p2p\\src\\main\\webapp\\',// 【\】需要转译
    outFolder = 'e:\\build',
    outputPath = [],
    files = [];

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
        files = stdout.match(/modified:(.)*/g).concat(stdout.match(/new file:(.)*/g));
        files = files.map(function (item) {
            return codePath + item.replace("modified:", '').replace("new file:", '').replace(/\//g, "\\").trim();
        });
        cb(err);
    });
});

// copy
gulp.task("copy", ["status"], function () {
    outputPath = [
        outFolder,
        new Date().toLocaleDateString(),
        "ROOT"
    ];
    var tasks = files.map(function (file) {
        var output = outputPath.join('\\');
        output += '\\' + file.replace(codePath, '').split("\\").slice(0, file.replace(codePath, '').split("\\").length - 1).join("\\");
        return gulp
            .src(file)
            .pipe(gulp.dest(output));
    });
    return merge(tasks);
});

// default
gulp.task("default", ["init", "status", "copy"]);