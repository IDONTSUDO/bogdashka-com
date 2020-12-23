const path = require('path');

module.exports = {
  watch: true,
  entry: [
    './src/main.js',
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
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
  ]
};
