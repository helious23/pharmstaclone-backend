import { SubResolvers } from "../../types";
import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
import { withFilter } from "apollo-server-express";

const resolvers: SubResolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await context.client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        if (!room) {
          throw new Error("채팅방이 존재하지 않습니다");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates: { roomId } }, { id }, { loggedInUser }) => {
            if (roomId === id) {
              const room = await context.client.room.findFirst({
                where: {
                  id,
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });
              if (!room) {
                return false;
              }
              return true;
            }
          }
        )(root, args, context, info);
      },
    },
  },
};
export default resolvers;
