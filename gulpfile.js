const gulp = require('gulp');
const exec = require('child_process').execSync;
const gutil = require('gulp-util');
const path = require('path');
const del = require('del');

const paths = {
  dist: path.join(process.cwd(), '_site'),
  src: process.cwd(),
}

function buildJekyll() {
  gutil.log(`Source: ${paths.src} || Output: ${paths.dist}`);

  const cmd = `bundle exec jekyll build --source ${paths.src} --destination ${paths.dist}`;
  const output = exec(cmd, {encoding: 'utf-8'});
  gutil.log(`Jekyll: ${output}`);
}

gulp.task('clear', () => {
  del.sync(paths.dist);
  gutil.log(`Deleted: ${paths.dist}`);
});

gulp.task('jekyll', () => {
  buildJekyll();
});
