const parser = require('@typescript-eslint/parser');
const plugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
    {
        ignores: ['node_modules/**', '.vscode-test/**', 'out/**', 'dist/**']
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser,
            ecmaVersion: 2015,
            sourceType: 'module'
        },
        plugins: {
            '@typescript-eslint': plugin
        },
        rules: {
            '@typescript-eslint/naming-convention': 'warn',
            curly: 'warn',
            eqeqeq: 'warn',
            'no-throw-literal': 'warn',
            semi: 'warn'
        }
    }
];