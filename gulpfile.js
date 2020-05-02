const { series } = require('gulp');

const { clean } = require('./build/clean');
const { code } = require('./build/code');

const DESTINATION = 'dist';

module.exports.default = series(clean(DESTINATION), code(DESTINATION));
