import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { delPhotoS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({
          where: { id },
          select: { userId: true, file: true },
        });
        if (!photo) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다",
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "자신이 등록한 사진만 삭제할 수 있습니다",
          };
        }

        await delPhotoS3(photo.file, loggedInUser.username);
        await client.photo.delete({ where: { id } });
        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
