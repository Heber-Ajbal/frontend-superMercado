import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import vueEslintParser from 'vue-eslint-parser';

export default [
    {
        files: ['**/*.js', '**/*.vue', '**/*.ts'],
        ignores: ['node_modules/**', '.nuxt/**'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                requireConfigFile: false,
                // Use vue-eslint-parser for .vue files
                parser: {
                    ts: '@typescript-eslint/parser',
                    js: '@babel/eslint-parser',
                    vue: vueEslintParser,
                },
            },
        },
        plugins: {
            prettier: prettierPlugin,
            vue: vuePlugin,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    semi: false,
                    singleQuote: true,
                    tabWidth: 2,
                },
            ],
        },
    },
];
