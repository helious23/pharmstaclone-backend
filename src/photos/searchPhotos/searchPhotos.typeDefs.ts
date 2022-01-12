import { gql } from "apollo-server";

export default gql`
  type SearchPhotosResults {
    results: [Photo]
    totalPages: Int!
  }
  type Query {
    searchPhotos(keyword: String, page: Int!): SearchPhotosResults!
  }
`;
