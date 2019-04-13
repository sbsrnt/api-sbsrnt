import { mergeTypes } from "merge-graphql-schemas";

import User from "src/graphql/types/User";

const typeDefs = [User];

export default mergeTypes(typeDefs, { all: true });
