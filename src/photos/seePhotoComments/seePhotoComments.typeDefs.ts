import { gql } from "apollo-server";

export default gql`
  type Query {
    seePhotoComments(lastId: Int, id: Int!): [Comment]
  }
`;
