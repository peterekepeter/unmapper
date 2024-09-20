import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import spellcheck from "eslint-plugin-spellcheck";
import unusedImports from "eslint-plugin-unused-imports";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.config.js"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
), {
    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        "simple-import-sort": simpleImportSort,
        spellcheck,
        "unused-imports": unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["warn"],
        "@/indent": ["warn"],
        "@/object-curly-spacing": ["warn", "always"],

        "object-property-newline": ["warn", {
            allowAllPropertiesOnSameLine: true,
        }],

        "object-curly-newline": ["warn", {
            multiline: true,
        }],

        "prefer-exponentiation-operator": "warn",
        "@/comma-dangle": ["warn", "always-multiline"],
        "@/comma-spacing": ["error"],
        "array-element-newline": ["warn", "consistent"],

        "array-bracket-newline": ["warn", {
            multiline: true,
        }],

        "eol-last": ["warn", "always"],
        "no-var": "warn",
        "no-alert": "error",

        "no-multiple-empty-lines": ["warn", {
            max: 2,
            maxEOF: 0,
            maxBOF: 0,
        }],

        "function-paren-newline": ["warn", "multiline-arguments"],
        "function-call-argument-newline": ["warn", "consistent"],
        "block-spacing": "warn",
        semi: ["warn", "never"],
        "object-shorthand": "warn",
        "prefer-const": "warn",
        "no-useless-rename": "warn",
        "react/prop-types": "off",
        "no-console": "warn",
        "key-spacing": ["warn"],
        "switch-colon-spacing": "warn",
        "no-inner-declarations": "off",
        "unicode-bom": ["error", "never"],
        "unused-imports/no-unused-imports": "error",

        "unused-imports/no-unused-vars": ["warn", {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
        }],

        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",

        "spellcheck/spell-checker": ["warn", {
            skipWords: [
                "stateful",
                "tokenization",
                "tokenize",
                "uv",
                "uvs",
                "Wavefront",
                "whitespace",
                "coord",
                "coords",
                "csg",
                "normals",
            ],
        }],
    },
}];