import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser, client }) => {
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!user) {
            return {
              ok: false,
              error: "사용자가 존재하지 않습니다",
            };
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: user.id,
                  },
                  {
                    id: loggedInUser.id,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });
          if (!room) {
            return {
              ok: false,
              error: "채팅방을 찾을 수 없습니다",
            };
          }
        }
        const message = await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: room.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
