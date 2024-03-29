const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

// Application constants to share across all builds.
const APPS = process.env.APPS
  ? JSON.parse(process.env.APPS)
  : {
      homepage: 'http://localhost:3001',
      item: 'http://localhost:3002',
      cart: 'http://localhost:3003',
      checkout: 'http://localhost:3004',
    }

const htmlPluginConfig = {
  template: path.resolve(__dirname, 'public/index.html'),
  chunks: ['main'],
  templateParameters: (compilation, assets, assetTags, options) => ({
    compilation,
    webpackConfig: compilation.options,
    htmlWebpackPlugin: { tags: assetTags, files: assets, options },
    // Inject remotes in <script> tags before main JS. E.g.
    // `<script src="http://localhost:3001/homepage-remote.js"></script>`
    remotes: Object.entries(APPS).map(([name, base]) => `${base}/${name}-remote.js`),
  }),
}

module.exports = ({ app, title, exposes = {} }) => ({
  entry: './src/index.tsx',
  cache: false,
  output: {
    path: path.resolve('dist'),
    pathInfo: true,
    publicPath: `${APPS[app]}/`,
    filename: '[name].js',
  },
  devtool: false,
  optimization: {
    minimize: false,
  },
  plugins: [
    new DefinePlugin({
      'process.env.APPS': JSON.stringify(APPS),
    }),
    // - **Naming**: The `name` property will become a `var` so needs to be JS-compliant.
    new ModuleFederationPlugin({
      name: `app_${app}`,
      library: { type: 'var', name: `app_${app}` },
      filename: `${app}-remote.js`,
      // Form: `{ app_homepage: "app_homepage" }`
      remotes: Object.fromEntries(Object.keys(APPS).map((name) => [`app_${name}`, `app_${name}`])),
      exposes,
      shared: ['react', 'react-dom'],
    }),
    new HtmlWebpackPlugin({
      ...htmlPluginConfig,
      title,
    }),
    new HtmlWebpackPlugin({
      ...htmlPluginConfig,
      title,
      // Add 200 for Surge routing
      // https://surge.sh/help/adding-a-200-page-for-client-side-routing
      filename: '200.html',
    }),
  ],
})
