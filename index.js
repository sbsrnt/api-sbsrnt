
require("dotenv").config();
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import schema from "./graphql";
import { models } from "./db/models";
import { url } from "./db/config";

const options = {
  port: process.env.PORT || "4000",
  endpoint: "/graphql",
  playground: "/playground"
};

const context = {
  models,
};

// Connect to MongoDB with Mongoose.
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
  context
});

server.listen(options).then(({ url }) => {
  console.log(`🚀 Server is running on ${url}`);
});
