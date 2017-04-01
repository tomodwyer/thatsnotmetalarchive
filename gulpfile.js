const browserSync = require('browser-sync').create();
const del = require('del');
const exec = require('child_process').execSync;
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');

const paths = {
  dist: path.join(process.cwd(), '_site'),
  src: process.cwd(),
}

function buildJekyll(incremental) {
  gutil.log(`Source: ${paths.src} || Output: ${paths.dist}`);

  let cmd = `bundle exec jekyll build --source ${paths.src} --destination ${paths.dist}`;

  if (incremental === true) {
    cmd += ' --incremental'
  }

  const output = exec(cmd, {encoding: 'utf-8'});
  return gutil.log(`Jekyll: ${output}`);
}

gulp.task('clean', () => {
  del.sync(paths.dist);
  return gutil.log(`Deleted: ${paths.dist}`);
});

gulp.task('jekyll', () => {
  buildJekyll();
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: paths.dist
    },
    open: false
  })
});

gulp.task('watchJekyll', () => {
  watch([
    '**/*.md',
    '**/*.html',
    '**/*.yml',
    '!_site/**/*'
  ], () => {
    buildJekyll(true);
    browserSync.reload();
  });
});

gulp.task('default', () => {
  runSequence(
    'clean',
    'jekyll',
    'browserSync',
    [
      'watchJekyll',
    ]
  )
});
