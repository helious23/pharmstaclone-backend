import { gql } from "apollo-server";

export default gql`
  type Comment {
    id: Int!
    user: User!
    photo: Photo!
    hashtags: [Hashtag]
    payload: String!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
