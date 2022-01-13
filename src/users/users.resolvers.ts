import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
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
    myPhotos: async ({ id }, { page }, { loggedInUser, client }) => {
      if (id !== loggedInUser.id) {
        return {
          ok: false,
          error: "본인의 사진만 확인할 수 있습니다",
        };
      }
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
