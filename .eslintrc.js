module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
  ],
  plugins: [
  ],
  ignorePatterns: [
    'functions/lib/**',
  ],
  rules: {
    indent: ['error', 2],
    'no-tabs': 'off',
    'require-jsdoc': 'off',
    'max-len': ['error', { code: 120 }],
    'no-undef': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'always'],
  },
};
