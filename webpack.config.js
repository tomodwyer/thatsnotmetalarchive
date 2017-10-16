const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const path = require("path");
const webpack = require("webpack");

const extractSass = new ExtractTextPlugin({
  filename: "[name]/[chunkhash].[name]",
  disable: process.env.NODE_ENV === "development"
});

module.exports = env => {
  const isDev = env === "dev";
  const isProd = env === "prod";

  return {
    devtool: isDev ? "inline-source-map" : false,
    entry: { js: "./assets/js/main.js", css: "./assets/scss/main.scss" },
    output: {
      filename: "[name]/[chunkhash].[name]",
      path: path.resolve(__dirname, "static")
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["env"]
            }
          }
        },
        {
          test: /\.scss$/,
          use: extractSass.extract({
            use: [
              {
                loader: "css-loader",
                options: { sourceMap: isDev }
              },
              {
                loader: "postcss-loader",
                options: { sourceMap: isDev }
              },
              {
                loader: "sass-loader",
                options: { sourceMap: isDev }
              }
            ],
            fallback: "style-loader"
          })
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin([
        path.resolve(__dirname, "static", "js"),
        path.resolve(__dirname, "static", "css")
      ]),
      new ManifestPlugin({ fileName: "../data/assets.json" }),
      extractSass,
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new WebpackShellPlugin({
        onBuildEnd: isProd ? "npm run build:hugo" : "npm run start:hugo"
      })
    ]
  };
};
