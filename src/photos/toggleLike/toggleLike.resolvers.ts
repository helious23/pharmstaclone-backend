import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    likePhoto: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const ok = await client.photo.findUnique({ where: { id } });
        if (!ok) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다",
          };
        }
      }
    ),
  },
};
export default resolvers;
