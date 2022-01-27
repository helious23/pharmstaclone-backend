import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        const existingUsername = await client.user.findUnique({
          where: {
            username,
          },
        });
        if (existingUsername) {
          return {
            ok: false,
            error: "이미 존재하는 사용자 이름 입니다",
          };
        }
        const existingEmail = await client.user.findUnique({
          where: {
            email,
          },
        });
        if (existingEmail) {
          return {
            ok: false,
            error: "이미 가입된 이메일 입니다",
          };
        }
        const hashedPaswrod = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: hashedPaswrod,
          },
        });
        return {
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          error: "회원가입을 할 수 없습니다",
        };
      }
    },
  },
};

export default resolvers;
