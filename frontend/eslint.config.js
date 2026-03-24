import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // react-hooks/set-state-in-effect is disabled because initialising component
      // state in response to fetched data (e.g. selecting the first question when
      // questions load) is a valid and intentional useEffect pattern in this codebase.
      // The rule was added in eslint-plugin-react-hooks v7 and is widely considered
      // too strict for data-initialisation use cases. Re-evaluate if cascading render
      // performance issues are ever observed.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
