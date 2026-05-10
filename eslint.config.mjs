import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    } 
  }
];