import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id }, _, { client }) =>
      client.user.findMany({ where: { rooms: { some: { id } } } }),
    messages: ({ id }, { lastId }, { client }) =>
      client.message.findMany({
        where: { roomId: id },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: lastId }),
      }),
    unreadTotal: ({ id }, _, { loggedInUser, client }) => {
      if (!loggedInUser) {
        return 0;
      } else {
        return client.message.count({
          where: {
            roomId: id,
            read: false,
            user: { id: { not: loggedInUser.id } },
          },
        });
      }
    },
  },
  Message: {
    user: ({ id }, _, { client }) =>
      client.user.findFirst({ where: { messages: { some: { id } } } }),
  },
};
export default resolvers;
