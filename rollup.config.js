// rollup.config.js
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'

const backgroundConfig = {
  input: 'src/service_worker.js',
  output: {
    file: 'dist/src/service_worker.js',
    format: 'iife',
  },
  plugins: [
    terser({
      compress: true,
      mangle: true,
      output: {
        comments: false,
      },
    }),
  ],
}

const contentConfig = {
  input: 'src/main.js',
  output: {
    file: 'dist/src/main.js',
    format: 'iife',
  },
  plugins: [
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: '16-16.png', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
      ],
    }),
    terser({
      compress: true,
      mangle: true,
      output: {
        comments: false,
      },
    }),
  ],
}

const sourceConfig = {
  input: 'src/xhs/rewriteXhr.js',
  output: {
    file: 'dist/src/xhs/rewriteXhr.js',
    format: 'iife',
  },
  plugins: [
    terser({
      compress: true,
      mangle: true,
      output: {
        comments: false,
      },
    }),
  ],
}

export default [backgroundConfig, contentConfig, sourceConfig] // 导出配置数组
