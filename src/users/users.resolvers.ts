import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalPosts: ({ id }, _, { client }) =>
      client.photo.count({ where: { userId: id } }),
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
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
    photos: async ({ id }, { page }, { client }) => {
      const results = await client.user
        .findUnique({ where: { id } })
        .photos({ take: 5, skip: (page - 1) * 5 });
      const totalMyPhotos = await client.photo.count({ where: { userId: id } });
      return {
        ok: true,
        results,
        totalPages: Math.ceil(totalMyPhotos / 5),
      };
    },
  },
};

export default resolvers;
