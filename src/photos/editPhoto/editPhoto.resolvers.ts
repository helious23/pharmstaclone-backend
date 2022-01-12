import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser, client }) => {
        const ok = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
        });
        if (!ok) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다",
          };
        }
        await client.photo.update({
          where: { id },
          data: { caption },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
