import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser, client }) => {
        try {
          let hashtagObjs = [];
          if (caption) {
            hashtagObjs = processHashtags(caption);
          }
          const fileUrl = await uploadToS3(
            file,
            loggedInUser.username,
            "photos"
          );
          const photo = await client.photo.create({
            data: {
              file: fileUrl,
              caption,
              ...(hashtagObjs.length > 0 && {
                hashtags: { connectOrCreate: hashtagObjs },
              }),
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
            },
          });
          return {
            ok: true,
            photo,
          };
        } catch (error) {
          return {
            ok: false,
            error: "사진을 업로드 할 수 없습니다",
          };
        }
      }
    ),
  },
};

export default resolvers;
