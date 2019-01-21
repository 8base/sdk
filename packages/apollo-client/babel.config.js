module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: [
          'node 6',
          'ie 9',
          'ios 9',
          'last 2 chrome versions',
          'last 2 edge versions',
          'last 2 firefox versions',
        ],
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
  env: {
    cjs: {
      presets: [
        ['@babel/preset-env', { modules: 'commonjs' }],
      ],
    },
    mjs: {
      presets: [
        ['@babel/preset-env', { modules: false }],
      ],
    },
  },
};
