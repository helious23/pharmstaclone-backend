import { SubResolvers } from "../../types";
import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
import { withFilter } from "apollo-server-express";

const resolvers: SubResolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await context.client.room.findUnique({
          where: { id: args.id },
          select: { id: true },
        });
        if (!room) {
          throw new Error("채팅방이 존재하지 않습니다");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdates: { roomId } }, { id }) => roomId === id
        )(root, args, context, info);
      },
    },
  },
};
export default resolvers;
