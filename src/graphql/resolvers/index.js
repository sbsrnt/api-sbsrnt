import { mergeResolvers } from "merge-graphql-schemas";

import User from "src/graphql/resolvers/User";

const resolvers = [User];

export default mergeResolvers(resolvers);
