import babel from 'rollup-plugin-babel'

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'objectId',
  dest: 'dist/object_id.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
