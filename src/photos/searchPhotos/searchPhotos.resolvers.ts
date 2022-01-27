import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhotos: async (_, { keyword, lastId }, { client }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              caption: {
                startsWith: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
            {
              caption: {
                contains: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        skip: lastId ? 1 : 0,
        take: 36,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};

export default resolvers;
