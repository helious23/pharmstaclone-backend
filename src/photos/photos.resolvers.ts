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
    commentNumber: ({ id }, _, { client }) =>
      client.comment.count({ where: { photoId: id } }),
    comments: async ({ id }, _, { client }) =>
      client.comment.findMany({
        where: { photoId: id },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser, client }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
    likedBy: async ({ id }, _, { loggedInUser, client }) =>
      client.user.findFirst({
        where: {
          likes: {
            some: {
              photoId: id,
            },
          },
          followers: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
        select: {
          username: true,
          avatar: true,
        },
      }),
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
