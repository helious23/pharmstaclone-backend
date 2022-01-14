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
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
        client,
      };
    } else if (ctx.connection) {
      const {
        connection: {
          context: { loggedInUser },
        },
      } = ctx;
      return {
        client,
        loggedInUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }: { token: string }) => {
      if (!token) {
        throw new Error("로그인이 필요한 서비스 입니다");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
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
