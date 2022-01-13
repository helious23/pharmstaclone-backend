import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        if (!photo) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다",
          };
        }
        await client.comment.create({
          data: {
            payload,
            photo: {
              connect: { id: photo.id },
            },
            user: {
              connect: { id: loggedInUser.id },
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
