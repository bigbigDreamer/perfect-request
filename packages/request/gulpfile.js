const { series } = require('gulp');
const del = require('del');

const delBuildDir = async () => {
    await del('es/');
};

module.exports.clean = delBuildDir;
