import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    createdAt: String!
    updatedAt: String!
  }

  type PhotosResults {
    results: [Photo]
    totalPages: Int!
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): PhotosResults!
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
