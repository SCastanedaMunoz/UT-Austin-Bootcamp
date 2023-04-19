const WebPackPWAManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: "./public/js/index.js",
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "bundle.js",
  },
  mode: "production",
  plugins: [
    new WebPackPWAManifest({
      publicPath: "/dist/",
      filename: "manifest.webmanifest",
      inject: false,
      fingerprints: false,
      name: "Budget Tracker - Progressive Budget Tracker",
      short_name: "Budget Tracker - PWA",
      theme_color: "#FFFFFF",
      background_color: "#FFFFFF",
      start_url: "/",
      display: "standalone",
      icons: [
        {
          src: path.resolve(__dirname, "public/icons/icon-512x512.png"),
          size: [72, 96, 128, 144, 152, 192, 384, 512],
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};

module.exports = config;