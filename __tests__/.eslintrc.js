module.exports = {
  "parserOptions": {
    "ecmaVersion": 10,
    "parser": "@typescript-eslint/parser",
    "project": "./tsconfig.json"
  },
  "extends": [
    "airbnb-typescript/base",
    "hardcore/ts-for-js",
    "hardcore", 
    "hardcore/fp"
  ],
  "plugins": [
    "@typescript-eslint",
    "unicorn",
    "functional",
    "jest"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".ts",
          ".d.ts"
        ],
        "moduleDirectory": [
          "node_modules",
          "./src"
        ]
      }
    }
  },
  "rules": {
    // Import
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "ts": "never",
      }
    ],
    "import/order": "off",
    "import/no-cycle": "off",
    "import/unambiguous": "off",
    "import/no-namespace": "off",
    "import/group-exports": "off",
    "import/exports-last": "off",
    "import/prefer-default-export": "off",
    "import/no-unused-modules": "off",
    "no-param-reassign": "off",
    // Eslint General
    "max-len": [
      "warn",
      {
        "code": 100,
        "ignoreStrings": true,
        "ignoreUrls": true,
        "ignoreComments": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }
    ],
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions"}],
    "no-underscore-dangle": "off",
    "no-console": "off",
    "no-magic-numbers": "off",
    "no-unused-vars": "off",
    "consistent-return": "off",
    "require-atomic-updates": "off",
    "lines-around-comment": "off",
    // Typescript
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-magic-numbers": "off",
    "@typescript-eslint/no-floating-promises": ["error", { "ignoreIIFE": true }],
    "@typescript-eslint/no-duplicate-imports": "error",
    "@typescript-eslint/no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions"}],
    // Function 
    "func-style": "off",
    // FP
    "fp/no-throw": "off",
    "fp/no-let": "off",
    "fp/no-mutation": "off",
  },
  "env": {
    "node": true,
    "browser": true,
    "jest": true
  },
};
