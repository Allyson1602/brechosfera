import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: "src/lib/graphql/{queries,mutations}/**/*.ts",

  generates: {
    "src/lib/graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        scalars: {
          DateTime: "string",
        },
        skipTypename: false,
      },
    },
  },
};

export default config;

