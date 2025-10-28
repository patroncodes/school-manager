import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  // documents: ["./lib/urql/operations/*.graphql", "./app/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./lib/generated/graphql/client.ts": {
      documents: ["./lib/urql/operations/*.graphql"],
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: {
        withHooks: true,
      },
    },
    "./lib/generated/graphql/server.ts": {
      documents: ["./app/**/*.tsx", "./components/**/*.tsx"],
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
