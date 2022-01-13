import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({ where: { id } });
        if (!photo) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다",
          };
        }
        const like = await client.like.findUnique({
          where: {
            photoId_userId: {
              userId: loggedInUser.id,
              photoId: id,
            },
          },
        });
        if (like) {
          await client.like.delete({
            where: {
              photoId_userId: {
                userId: loggedInUser.id,
                photoId: id,
              },
            },
          });
        } else {
          await client.like.create({
            data: {
              user: {
                connect: { id: loggedInUser.id },
              },
              photo: {
                connect: { id: photo.id },
              },
            },
          });
        }
        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
