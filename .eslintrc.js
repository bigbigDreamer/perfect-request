module.exports = {
    extends: ['./base/eslint.js', 'plugin:prettier/recommended'], //定义文件继承的子规范
    rules: {
        'prettier/prettier': 1, //  eslint-plugin-prettier 使用prettier作为eslint规则
        '@typescript-eslint/explicit-module-boundary-types': 0,
    },
    parserOptions: {
        requireConfigFile: false,
    },
    ignorePatterns: [
        '**/es/**',
        '**/base/**',
        '.fatherrc.ts',
        'rollup.config.js',
        '.umirc.ts',
        'commitlint.config.js',
        'babel.config.js',
        'gulpfile.js',
    ],
};
