import bcrypt from "bcrypt";
import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
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
  },
};

export default resolvers;
