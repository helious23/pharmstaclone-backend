import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../../photos/photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        const hashtagObjs = processHashtags(payload);
        if (!photo) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다",
          };
        }
        const newComment = await client.comment.create({
          data: {
            payload,
            photo: {
              connect: { id: photo.id },
            },
            user: {
              connect: { id: loggedInUser.id },
            },
            ...(hashtagObjs.length > 0 && {
              hashtags: { connectOrCreate: hashtagObjs },
            }),
          },
        });
        return {
          ok: true,
          id: newComment.id,
        };
      }
    ),
  },
};
export default resolvers;
