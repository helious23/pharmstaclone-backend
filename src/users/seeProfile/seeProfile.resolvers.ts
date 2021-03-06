import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Query: {
    seeProfile: async (_, { username }, { client }) => {
      return client.user.findUnique({
        where: {
          username,
        },
      });
    },
  },
};

export default resolvers;
