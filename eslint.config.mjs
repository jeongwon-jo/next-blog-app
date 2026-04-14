import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next", "next/typescript", "prettier", "plugin:tailwindcss/recommended"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "^_" }],
      "tailwindcss/classnames-order": [
        "warn",
        {
          callees: ["cva", "cn"],
        },
      ],
      "tailwindcss/enforces-negative-arbitrary-values": [
        "warn",
        {
          callees: ["cva", "cn"],
        },
      ],
      "tailwindcss/enforces-shorthand": [
        "warn",
        {
          callees: ["cva", "cn"],
        },
      ],
      "tailwindcss/no-contradicting-classname": [
        "warn",
        {
          callees: ["cva", "cn"],
        },
      ],
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          callees: ["cva", "cn"],
        },
      ],
    },
  },
];

export default eslintConfig;
