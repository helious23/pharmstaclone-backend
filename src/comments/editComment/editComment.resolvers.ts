import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../../photos/photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser, client }) => {
        const comment = await client.comment.findUnique({
          where: { id },
          select: { userId: true, hashtags: { select: { hashtag: true } } },
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
        const newComment = await client.comment.update({
          where: { id },
          data: {
            payload,
            hashtags: {
              disconnect: comment.hashtags,
              connectOrCreate: processHashtags(payload),
            },
          },
        });
        return {
          ok: true,
          createdAt: newComment.createdAt,
        };
      }
    ),
  },
};
export default resolvers;
