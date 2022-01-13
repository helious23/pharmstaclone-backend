import { gql } from "apollo-server";

export default gql`
  type UploadPhotoResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    uploadPhoto(file: String!, caption: String): UploadPhotoResult!
  }
`;
