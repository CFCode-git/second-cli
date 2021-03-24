const { cacheLoader, threadLoader } = require("../loaders");
const { resolve } = require("./../utils");
const MiniCssExtractPlugin = require("mini-css-extract-plugin").loader;

module.exports = [
  {
    test: /\.scss$/,
    use: [
      MiniCssExtractPlugin,
      "css-modules-typescript-loader",
      cacheLoader,
      threadLoader(2),
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[local]__[hash:base64:10]",
          },
        },
      },
      {
        loader: "sass-loader",
        options: {
          includePaths: [resolve("src/styles")],
        },
      },
    ],
  },
  {
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin,
      "css-loader",
      {
        loader: "less-loader",
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    ],
  },
];
