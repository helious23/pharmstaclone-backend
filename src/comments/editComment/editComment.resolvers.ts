import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser, client }) => {
        const comment = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!comment) {
          return {
            ok: false,
            error: "댓글을 찾을 수 없습니다",
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "자신이 작성한 댓글만 수정할 수 있습니다",
          };
        }
        await client.comment.update({
          where: { id },
          data: { payload },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
