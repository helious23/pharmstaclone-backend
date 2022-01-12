import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { loggedInUser, client }) => {
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      return {
        ok: true,
        followers,
      };
    },
  },
};

export default resolvers;
