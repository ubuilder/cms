
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import nodeResolve from '@rollup/plugin-node-resolve';
import * as multiInput from 'rollup-plugin-multi-input';
console.log(multiInput)

export default {
    // use glob in the input
    input: ['app.js' ,'routes/**/*.js'],
    output: {
      format: 'esm',
      dir: 'dist'
    },
    plugins: [ multiInput.default.default(), nodeResolve(), json(), commonjs() ],
};