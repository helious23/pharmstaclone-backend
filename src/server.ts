require("dotenv").config();
import * as http from "http";
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (info) => {
    if (info.req) {
      return {
        loggedInUser: await getUser(info.req.headers.token),
        client,
      };
    } else if (info.connection) {
      return {
        client,
      };
    }
  },
});

const PORT = process.env.PORT;

const app = express();
app.use(logger("dev"));

apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT} ✅`)
);
