import { gql } from "apollo-server";

export default gql`
  type CoreResponse {
    ok: Boolean!
    error: String
    id: Int
  }
`;
