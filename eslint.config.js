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
      '@typescript-eslint/no-unused-vars': 'off', // 允许未使用的变量
      '@typescript-eslint/no-explicit-any': 'off', // 允许 any 类型
      '@typescript-eslint/no-unused-expressions': 'off', // 允许未使用的表达式
      '@typescript-eslint/no-use-before-define': 'off', // 允许变量提前定义
      '@typescript-eslint/no-empty-function': 'off', // 允许空函数
      '@typescript-eslint/no-empty-interface': 'off', // 允许空接口
    },
  },

  // 全局忽略配置
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
]
