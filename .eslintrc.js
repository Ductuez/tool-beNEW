module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-alert': 'error',
    'my-custom-rule': 'warn',
    'no-unused-vars': 'error',
    'no-console': 'error', // Thêm quy tắc để không sử dụng console.log()
    'no-restricted-globals': ['error', 'alert'], // Thêm quy tắc để không sử dụng alert()
  },
}
