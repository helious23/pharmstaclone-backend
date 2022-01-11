import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        try {
          const tounfollowUser = await client.user.findUnique({
            where: {
              username,
            },
          });
          if (!tounfollowUser) {
            return {
              ok: false,
              error: "사용자를 찾을 수 없습니다",
            };
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                disconnect: {
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
            error: "언팔로우를 할 수 없습니다",
          };
        }
      }
    ),
  },
};

export default resolvers;
