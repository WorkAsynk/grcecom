module.exports = {
    env: {
      es6: true,
      node: true,
    },
    parserOptions: {
      "ecmaVersion": 2018,
    },
    extends: [
      "eslint:recommended",
      "google",
    ],
    rules: {
      "no-restricted-globals": ["error", "name", "length"],
      "prefer-arrow-callback": "error",
      "indent": ["error", 4], // allow 4 spaces for indentation
      "no-trailing-spaces": "off", // disable rule about trailing spaces
      "quotes": ["error", "double"], // allow double quotes
      "max-len": ["error", { "code": 120 }], // set maximum line length to 120
      "object-curly-spacing": ["error", "always"], // enforce spacing inside curly braces
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }], // enforce spacing around object keys
      "comma-dangle": ["error", "never"], // disallow trailing commas
      "brace-style": ["error", "stroustrup"]
    },
    overrides: [
      {
        files: ["**/*.spec.*"],
        env: {
          mocha: true,
        },
        rules: {},
      },
    ],
    globals: {},
  };
  