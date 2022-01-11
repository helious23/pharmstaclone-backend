import { Resolvers } from "../../types";
import { protectedResolver } from "../user.utils";

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectedResolver(async (_, { username }, { client }) => {
      try {
        const user = await client.user.findUnique({
          where: {
            username,
          },
          include: {
            following: true,
            followers: true,
          },
        });
        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          error: "프로필을 불러올 수 없습니다",
        };
      }
    }),
  },
};

export default resolvers;
