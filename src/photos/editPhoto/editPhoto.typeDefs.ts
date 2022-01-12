import { gql } from "apollo-server";

export default gql`
  type EditPhotoResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editPhoto(caption: String, id: Int!): EditPhotoResult!
  }
`;
