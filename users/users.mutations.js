import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("이미 존재하는 이메일 또는 사용자명 입니다");
        }
        const hashedPaswrod = await bcrypt.hash(password, 10);
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: hashedPaswrod,
          },
        });
      } catch (error) {
        return error;
      }
    },
    login: async (_, { username, password }) => {
      const user = await client.user.findFirst({
        where: {
          username,
        },
      });
      if (!user) {
        return { ok: false, error: "사용자를 찾을 수 없습니다" };
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "비밀번호가 맞지 않습니다",
        };
      }

      // issue a token and send it to the user
    },
  },
};
