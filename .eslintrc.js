module.exports = {
    env: {
        node: true,
        commonjs: true,
        mocha: true,
        es6: true,
    },
    plugins: ["mocha", "prettier"],
    extends: ["eslint:recommended", "plugin:mocha/recommended", "plugin:prettier/recommended"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        expect: "readonly",
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
};
