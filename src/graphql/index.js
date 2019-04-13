import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "src/graphql/types";
import resolvers from "src/graphql/resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
