import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    checkUsername: async (_, { username }, { client }) => {
      const exist = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      return !Boolean(exist);
    },
  },
};

export default resolvers;
