import { Resolvers } from "../../types";
const resolvers: Resolvers = {
  Query: {
    searchPhotos: async (_, { keyword, page }, { client }) => {
      const results = await client.photo.findMany({
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
        take: 5,
        skip: (page - 1) * 5,
      });
      const totalPhotos = await client.photo.count({
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
      });
      return {
        results,
        totalPages: Math.ceil(totalPhotos / 5),
      };
    },
  },
};

export default resolvers;
