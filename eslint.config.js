// eslint.config.js
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import jsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'

export default [
  // React 配置 (必须放在最前)
  {
    ...jsxRuntime, // 新增 JSX Runtime 配置
    files: ['**/*.{jsx,tsx}'],
  },
  {
    ...reactRecommended,
    files: ['**/*.{jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // 明确关闭旧规则
      'react/jsx-uses-react': 'off', // 关闭旧规则检查
    },
  },

  // TypeScript 配置
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // 全局忽略配置
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
]
