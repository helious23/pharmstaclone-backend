import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editPhoto(caption: String, id: Int!): CoreResponse!
  }
`;
