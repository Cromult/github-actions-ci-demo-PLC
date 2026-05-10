import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    } 
  },
  { 
    files: ["**/*.mjs"], 
    languageOptions: { 
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    } 
  },
  { 
    files: ["**/*.cjs"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    } 
  }
];