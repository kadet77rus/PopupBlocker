const gulp = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const preprocess = require('gulp-preprocess');
const gap = require('gulp-append-prepend');
const insert = require('gulp-insert');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge2');


const options = global.options = {
    src: '',
    scriptName: 'popupblocker',
    downloadUPDATE_URLRelease: 'https://cdn.adguard.com/public/Userscripts/PopupBlocker/2.0/',
    downloadUPDATE_URLBeta: 'https://cdn.adguard.com/public/Userscripts/Beta/PopupBlocker/2.0/',
    downloadUPDATE_URLDev: 'https://AdguardTeam.github.io/PopupBlocker/',
    outputPath: 'build'
};

const cc_options = {
    compilation_level: 'ADVANCED',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT5',
    js_output_file: 'user.min.js',
    assume_function_wrapper: true,
    warning_level: 'VERBOSE',
    strict_mode_input: false,
    externs: ['externs.js'],
    use_types_for_optimization: true
};

const makeTask = (preprocessContext, minify, metaConfig) => {
    return () => {
        let content = gulp.src('index.js')
            .pipe(preprocess({
                context: preprocessContext
            }));
        if (minify) {
            content = content.pipe(closureCompiler(cc_options));
        }
        let meta = gulp.src('meta.js')
            .pipe(insert.transform((text) => {
                text = text.replace(/^(\/\/\s@.*)\[([A-Za-g_]*?)\]/gm, (_, c1, c2) => {
                    return c1 + metaConfig[c2];
                });
                return text;
            }))
            .pipe(rename('popupblocker.meta.js'))
            .pipe(gulp.dest('build'));
        return merge(meta, content)
            .pipe(concat('popupblocker.user.js'))
            .pipe(gulp.dest('build'));
    };
};

const makeMetaConfig = (url) => {
    return {
        'DOWNLOAD_URL': url + options.scriptName + '.user.js',
        'UPDATE_URL': url + options.scriptName + '.meta.js'
    };
}

gulp.task('dev', makeTask({ DEBUG: true }, false, makeMetaConfig(options.downloadUPDATE_URLDev)));

gulp.task('beta', makeTask({}, true, makeMetaConfig(options.downloadUPDATE_URLBeta)));

gulp.task('release', makeTask({}, true, makeMetaConfig(options.downloadUPDATE_URLRelease)));

gulp.task('watch', function(){
  gulp.watch('*.js', ['dev']).on('change', (event) => {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});
