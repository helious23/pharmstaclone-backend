import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
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
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      return {
        ok: true,
        token,
      };
    },
  },
};
export default resolvers;
