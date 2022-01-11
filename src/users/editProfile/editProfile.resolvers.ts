import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../user.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser }
      ) => {
        console.log(avatar);
        let hashedPassword = null;
        if (newPassword) {
          const passwordSame = await bcrypt.compare(
            newPassword,
            loggedInUser.password
          );
          if (passwordSame) {
            return {
              ok: false,
              error: "동일한 비밀번호로 변경할 수 없습니다",
            };
          }
          hashedPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(hashedPassword && { password: hashedPassword }),
          },
        });
        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "프로필 수정을 할 수 없습니다",
          };
        }
      }
    ),
  },
};
export default resolvers;
