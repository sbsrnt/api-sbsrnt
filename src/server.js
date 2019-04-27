require("dotenv").config();
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import schema from "./graphql";
import { models } from "./db/models";
import { url } from "./db/config";
import { getUser } from './graphql/utils';

const options = {
  port: process.env.PORT || "4000",
  endpoint: "/graphql",
  playground: "/playground"
};

const context = {
  models,
};

mongoose
  .connect(
    url,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  schema,
  context: async ({req: { headers, body: { operationName }}}) => {
    if(headers && headers.authorization){
      const token = await headers.authorization || '';

      const user = await operationName === 'signIn'
        ? {}
        : await getUser(token);

      return await {
        ...context,
        user
      }
    }

    return await {
      ...context
    }

  }
});

server.listen(options).then(({ url }) => {
  console.log(`🚀 Server is running on ${url}`);
});
