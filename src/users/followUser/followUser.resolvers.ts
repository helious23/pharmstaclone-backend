import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        try {
          const toFollowUser = await client.user.findUnique({
            where: { username },
            select: { id: true },
          });
          if (!toFollowUser) {
            return {
              ok: false,
              error: "사용자를 찾을 수 없습니다.",
            };
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                connect: {
                  username,
                },
              },
            },
          });
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            error: "팔로우를 할 수 없습니다",
          };
        }
      }
    ),
  },
};

export default resolvers;
