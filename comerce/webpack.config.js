const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  watch: true,
  entry: [
    './src/main.js',
  ],
  devServer: {
    contentBase: './dist',
   hot: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist/js/'),
    filename: './bundle.js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'dist/index.html'),
      title: 'Hot Module Replacement',
    }),
  ]
};
