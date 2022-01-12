import { Resolvers } from "../../types";
const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { keyword, page }, { client }) => {
      const users = await client.user.findMany({
        where: {
          OR: [
            {
              username: {
                startsWith: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
          ],
        },
        take: 5,
        skip: (page - 1) * 5,
      });

      const totalUsers = await client.user.count({
        where: {
          OR: [
            {
              username: {
                startsWith: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: keyword.toLowerCase(),
                mode: "insensitive",
              },
            },
          ],
        },
      });
      return {
        users,
        totalPages: Math.ceil(totalUsers / 5),
      };
    },
  },
};

export default resolvers;
