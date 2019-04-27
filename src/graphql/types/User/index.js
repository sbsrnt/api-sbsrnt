export default `
  type AuthPayload {
    token: String
    refreshToken: String!
    user: User!
  }
  
  type User {
    _id: String!
    name: String!
    email: String!
    password: String!
  }
  
  type Query {
    user(_id: ID!): User!
    users: [User!]!
    me: User!
  }
  
  type Mutation {
    createUser(user: CreateUserInput): User!
    updateUser(_id: String!, user: UpdateUserInput!): User!
    deleteUser(_id: String!): User!
    signIn(email: String!, password: String!): AuthPayload!
    signUp(email: String!, password: String!): User!
    signOut(_id: ID!): AuthPayload!
    refreshTokens(token: String!, refreshToken: String!): AuthPayload
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
  
  input UpdateUserInput {
    name: String
    email: String
    age: Int
  } 
`;
