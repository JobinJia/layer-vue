// const { defineConfig } = require('eslint-define-config')

module.exports = {
  extends: ['custom'],
  // root: true,
  // rules: {
  // },
  // overrides: [
  //   {
  //     files: ['./packages/**/*.{js,ts,vue,tsx}'],
  //     rules: {
  //     }
  //   },
  // ],
  ignorePatterns: ['**/*.json', 'dist', 'node_modules', '.turbo', '.nuxt', 'public', '.output']
}
