module.exports = {
  "extends": [
    "../.eslintrc.js",
  ],
  
  "rules": {
    "import/no-extraneous-dependencies": "off",
    "no-param-reassign": "off",
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
