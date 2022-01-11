import { gql } from "apollo-server";

export default gql`
  type SeeProfileResult {
    ok: Boolean!
    error: String
    user: User
  }
  type Query {
    seeProfile(username: String!): SeeProfileResult!
  }
`;
