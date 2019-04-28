const { override, useEslintRc, fixBabelImports } = require('customize-cra');

module.exports = override(
  useEslintRc('../.eslintrc'),
  fixBabelImports('lodash', {
    libraryName: 'react-use',
    libraryDirectory: 'lib',
    camel2DashComponentName: false
  })
);
