import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import tsc from 'rollup-plugin-typescript2';

export default {
    input: './src/index.ts',
    output: [
        {
            file: 'es/index.js',
            sourcemap: true,
            format: 'esm',
        },
    ],
    external: ['axios'],
    plugins: [
        resolve({ extensions: ['js', 'ts'] }),
        commonjs(),
        tsc({
            tsconfig: './tsconfig.json',
        }),
        babel({
            extensions: ['.js', '.ts'],
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
        }),
    ],
};
