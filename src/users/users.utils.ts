import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }
    const verifiedToken: any = jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const protectedResolver =
  (resolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "로그인이 필요합니다",
        };
      }
    }
    return resolver(root, args, context, info);
  };
