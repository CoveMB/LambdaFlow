module.exports = {
  out: './docs',

  includes: './',
  exclude: [
      '**/__tests__/**/*',
      '**/index.*',
      '**/node_modules/**/*'
  ],
  mode: 'modules',
  excludeNotDocumented: true,
  includeDeclarations: true,

  // theme: "./node_modules/typedoc-neo-theme/bin/default"
};