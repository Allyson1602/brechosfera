import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: "src/lib/graphql/queries/**/*.ts",

  generates: {
    "src/lib/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        skipTypename: false,
        reactApolloVersion: 4,
      },
    },
  },
};

export default config;
