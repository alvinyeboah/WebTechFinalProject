module.exports = {
    // Your existing webpack config
    module: {
      rules: [
        // Your existing rules
        {
          test: /\.html$/,
          use: 'html-loader',
        },
      ],
    },
  };