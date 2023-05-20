'use strict'

const config = require('../../webpack.config')

module.exports = config({
  app: 'counter',
  title: 'Counter',
  exposes: {
    './components/index': './src/index',
  },
})
