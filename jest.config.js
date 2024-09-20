// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

/*** @type {import('esbuild').BuildOptions} */ 
var esbuildOptions = {
    target: 'node20',
    banner: '\"use strict\";'
}

module.exports = {
    testEnvironment: "node",
    "transform": {
    "^.+\\.(ts|tsx)$": [
            "jest-esbuild",
            esbuildOptions,
        ]
    },
};
