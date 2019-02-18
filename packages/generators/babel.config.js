module.exports = {
  extends: '../../babel.config.js',

  plugins: [
    ['babel-plugin-inline-import', {
      extensions: [
        '.ejs',
      ],
    }],
  ],
};

