const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const del = require('del');
const exec = require('child_process').execSync;
const gulp = require('gulp');
const gutil = require('gulp-util');
const include = require('gulp-include');
const path = require('path');
const postcss = require('gulp-postcss');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const paths = {
  jekyll: {
    dist: path.join(process.cwd(), 'public'),
    src: path.join(process.cwd(), 'jekyll'),
  },
};

function buildJekyll(incremental) {
  gutil.log(`Source: ${paths.jekyll.src} || Output: ${paths.jekyll.dist}`);

  let cmd = `bundle exec jekyll build --source ${paths.jekyll.src} --destination ${paths.jekyll.dist}`;

  if (incremental === true) {
    cmd += ' --incremental';
  }

  const output = exec(cmd, {
    encoding: 'utf-8',
  });
  return gutil.log(`Jekyll: ${output}`);
}

gulp.task('clean', () => {
  del.sync(paths.jekyll.dist);
  return gutil.log(`Deleted: ${paths.jekyll.dist}`);
});

gulp.task('jekyll', () => {
  buildJekyll();
});

gulp.task('javascripts', () => {
  const scriptsSrc = path.join('assets', 'javascripts', 'application.js');
  const scriptsDist = path.join('jekyll', 'assets', 'javascripts');

  return gulp.src(scriptsSrc)
    .pipe(include({
      includePaths: [
        path.join('assets', 'javascripts'),
        `${__dirname}/node_modules`,
      ],
    }))
      .on('error', console.log)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(scriptsDist));
});

gulp.task('stylesheets', () => {
  const styleSrc = path.join('assets', 'stylesheets', '*.scss');
  const styleDist = path.join('jekyll', 'assets', 'stylesheets');

  return gulp.src(styleSrc)
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: [
          '> 1% in gb',
          'ie >= 8',
          'last 2 versions',
        ],
      }),
    ]))
    .pipe(gulp.dest(styleDist));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: paths.jekyll.dist,
    },
    open: false,
  });
});

gulp.task('watchJekyll', () => {
  watch([
    '**/*.md',
    '**/*.html',
    '**/*.yml',
    '!public/**/*',
  ], () => {
    buildJekyll(true);
    browserSync.reload();
  });
});

gulp.task('build', () => {
  runSequence(
    'clean',
    'javascripts',
    'stylesheets',
    'jekyll'
  );
});

gulp.task('default', () => {
  runSequence(
    'clean',
    'javascripts',
    'stylesheets',
    'jekyll',
    'browserSync',
    [
      'watchJekyll',
    ]
  )
});
