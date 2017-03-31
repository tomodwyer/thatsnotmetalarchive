const del = require('del');
const exec = require('child_process').execSync;
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const runSequence = require('run-sequence');

const paths = {
  dist: path.join(process.cwd(), '_site'),
  src: process.cwd(),
}

function buildJekyll() {
  gutil.log(`Source: ${paths.src} || Output: ${paths.dist}`);

  const cmd = `bundle exec jekyll build --source ${paths.src} --destination ${paths.dist}`;
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

gulp.task('default', () => {
  runSequence(
    'clean',
    'jekyll'
  )
});
