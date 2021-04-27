const swc = require('@swc/core')
const path = require('path')
const {isProd} = require('./snowpack.utils.js')

const root = path.resolve(__dirname, '..')

const ignores = ['packages/spec/src', 'packages/db/src', 'node_modules']

module.exports = function (/* snowpackConfig, pluginOptions */) {
  return {
    name: 'helios-snowpack-swc-plugin',
    transform({contents, fileExt, id}) {
      if (fileExt !== '.js' && fileExt !== '.jsx') return
      if (ignores.reduce((acc, test) => acc || id.includes(test), false))
        return contents
      return swc.transformSync(contents, {
        cwd: root,
        root,
        filename: id,
        sourceMaps: false,
      }).code
    },
    optimize(/* {buildDirectory, log} */) {
      if (!isProd()) return
    },
  }
}
