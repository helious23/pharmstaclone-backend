import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { id }, { client }) => {
      // const likes = await client.like.findMany({
      //   where: {
      //     photoId: id,
      //   },
      //   select: {
      //     user: {
      //       select: {
      //         username: true,
      //       },
      //     },
      //   },
      // });
      // return likes.map((like) => like.user);
      return client.user.findMany({
        where: {
          likes: {
            some: {
              photoId: id,
            },
          },
        },
      });
    },
  },
};

export default resolvers;
