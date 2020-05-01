import { gql } from 'apollo-server-express';

const userTypeDef = gql`
  enum UserType {
    ADMIN
    DEALER
    USER
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserInput {
    name: String!
    password: String!
    type: UserType!
    phone: String!
    email: String!
    address: String
  }

  type UserAuth {
    token: String!
    name: String!
    type: String!
  }

  type User {
    _id: ID!
    name: String!
    password: String!
    type: UserType!
    phone: String!
    email: String!
    address: String
    createdAt: String!
    updatedAt: String!
  }

  type UserList {
    users: [User!]!
    totalCount: Int!
  }

  extend type Query {
    loginUser(loginInput: LoginInput): UserAuth!
    getUser(id: ID): User!
    getUsersByRole(role: UserType!, page: Int): UserList!
  }

  extend type Mutation {
    createUser(userInput: UserInput): User!
    editUser(id: ID!, userInput: UserInput): User!
    deleteUser(id: ID!): Message!
  }
`;

export default userTypeDef;
