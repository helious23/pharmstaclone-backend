import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }, _, { client }) =>
      //   client.photo.findUnique({ where: { id } }).hashtags(),
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    likes: ({ id }, _, { client }) =>
      client.like.count({ where: { photoId: id } }),
    comments: ({ id }, _, { client }) =>
      client.comment.count({ where: { photoId: id } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
  },
  Hashtag: {
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),

    photos: async ({ id }, { page }, { client }) => {
      const results = await client.hashtag
        .findUnique({ where: { id } })
        .photos({ take: 5, skip: (page - 1) * 5 });
      const totalPhotos = await client.photo.count({
        where: { hashtags: { some: { id } } },
      });
      return {
        results,
        totalPages: Math.ceil(totalPhotos / 5),
      };
    },
  },
};
export default resolvers;
