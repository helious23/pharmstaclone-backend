import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => {
      return id === loggedInUser?.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser, client }) => {
      if (!loggedInUser) {
        return false;
      }
      const exist = await client.user.count({
        where: { username: loggedInUser.username, following: { some: { id } } },
      });
      return Boolean(exist);
    },
  },
};

export default resolvers;
