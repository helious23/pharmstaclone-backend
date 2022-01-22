import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { lastId, id }, { client }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        include: {
          user: true,
          photo: true,
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: {
          updatedAt: "desc",
        },
      }),
  },
};
export default resolvers;
