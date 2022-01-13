import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(
      async (_, { lastId }, { loggedInUser, client }) =>
        client.photo.findMany({
          where: {
            OR: [
              {
                user: {
                  followers: {
                    some: {
                      id: loggedInUser.id,
                    },
                  },
                },
              },
              {
                userId: loggedInUser.id,
              },
            ],
          },
          orderBy: { createdAt: "desc" },
          skip: lastId ? 1 : 0,
          take: 3,
          ...(lastId && { cursor: { id: lastId } }),
        })
    ),
  },
};
export default resolvers;
