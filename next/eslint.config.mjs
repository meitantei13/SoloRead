import nextConfig from "eslint-config-next";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

const eslintConfig = [
  ...nextConfig,
  {
    plugins: { import: importPlugin },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "**/*.css",
              group: "type",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
