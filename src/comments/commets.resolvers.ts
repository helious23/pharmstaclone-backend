import { Resolvers } from "../types";
const resolvers: Resolvers = {
  Comment: {
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({
        where: { id: userId },
        select: { username: true },
      }),
  },
};

export default resolvers;
