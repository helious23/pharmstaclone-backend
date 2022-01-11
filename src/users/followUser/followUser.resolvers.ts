import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        const toFollowUser = await client.user.findUnique({
          where: { username },
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
      }
    ),
  },
};

export default resolvers;
