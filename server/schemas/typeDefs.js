const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
    _id: ID!
    bookId: String
    title: String!
    authors: [String]
    description: String
    image: String
    link: String
}

input bookToAdd{
    description: String
    title: String
    bookId: String
    image: String
    link: String
    authors: [String]
  }

type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
}

type Query{
    books: [Book]
    users(_id: String): [User]
    getCurrent: User
    getUsingleUser: User
}

type Mutation{
    login(emal: String!, password: String!): Auth
    createUser(_id: String!, username: String!, email: String!, password: String!): Auth
    deleteBook(bookId: ID!): User
    addBook(input: bookToAdd!): User
}

type Auth{
    token: ID!
    user: User
}
`

module.exports = typeDefs