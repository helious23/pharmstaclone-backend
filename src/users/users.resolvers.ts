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
  },
};

export default resolvers;
