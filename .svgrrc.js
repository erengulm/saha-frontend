module.exports = {
  svgo: true,
  svgoConfig: {
    plugins: [
      { removeXMLNS: false }
    ]
  },
  jsxRuntime: 'automatic',
  throwIfNamespace: false
}