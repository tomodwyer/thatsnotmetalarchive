module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ["> 1% in gb", "ie >= 9", "last 2 versions"]
    },
    cssnano: {
      discardComments: {
        removeAll: true
      }
    }
  }
};
