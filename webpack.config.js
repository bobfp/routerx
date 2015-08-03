module.exports = {
  entry: './example/app.js',
  output: {
    path: './example/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  devServer: {
    contentBase: './example',
    progress: true,
    colors: true,
    inline: true,
    historyApiFallback: true
  }
};
