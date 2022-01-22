import { gql } from "apollo-server";

export default gql`
  type MyPhotosResults {
    ok: Boolean!
    error: String
    results: [Photo]
    totalPages: Int
  }

  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    bio: String
    avatar: String
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    totalPosts: Int!
    isFollowing: Boolean!
    isMe: Boolean!
    photos(page: Int!): MyPhotosResults!
  }
`;
