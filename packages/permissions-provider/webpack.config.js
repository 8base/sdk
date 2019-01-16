const { configBuilder } = require('@8base/webpack-configuration');

const LIBRARY_NAME = 'permissions-provider';

module.exports = configBuilder(__dirname, LIBRARY_NAME);
