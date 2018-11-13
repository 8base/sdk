const { configBuilder } = require('@8base/webpack-configuration');

const LIBRARY_NAME = 'auth';

module.exports = configBuilder(__dirname, LIBRARY_NAME);
