import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRooms: protectedResolver(
      async (_, { lastId }, { loggedInUser, client }) =>
        client.room.findMany({
          where: { users: { some: { id: loggedInUser.id } } },
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: lastId }),
        })
    ),
  },
};

export default resolvers;
