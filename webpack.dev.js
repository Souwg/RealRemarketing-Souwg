const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const port = 3000;
let publicUrl = `ws://localhost:${port}/ws`;

// Gitpod
if (process.env.GITPOD_WORKSPACE_URL) {
  const [schema, host] = process.env.GITPOD_WORKSPACE_URL.split("://");
  publicUrl = `wss://${port}-${host}/ws`;
}

// Codespaces
if (process.env.CODESPACE_NAME) {
  publicUrl = `wss://${process.env.CODESPACE_NAME}-${port}.app.github.dev/ws`;
}

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    host: "0.0.0.0",
    port,
    hot: true,
    allowedHosts: "all",
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    client: {
      webSocketURL: {
        hostname: "localhost",
        port: port,
        protocol: "ws",
      },
    },
  },
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
