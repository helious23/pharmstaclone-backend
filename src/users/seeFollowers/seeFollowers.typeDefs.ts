import { gql } from "apollo-server";

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalpages: Int
  }
  type Query {
    seeFollowers(username: String!, page: Int!): SeeFollowersResult!
  }
`;
