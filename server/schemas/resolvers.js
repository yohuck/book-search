const { Book, User } = require("../models");
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        // book: async () => {
        //     return Book.find({})
        // },
        // getSingleUser: async (parent, { _id}) => {
        //     const params = _id ? { _id } : {};
        //     return User.find(params)
        // },
        getCurrent: async (parent, args, context) => {
            if (context.user){
                const userInfo = await User.findOne( { _id: context.user_id}).select(
                    "-_v -password"
                );
                return userInfo
            }
            throw new AuthenticationError("Trying loggin in first there buddy");
        },
    },

    Mutation: {
        createUser : async(parent, args) => {
            const user = await User.create(args);
            return {token, user}
        },
        login: async( parent, { email, password }) => {
            const user = await User.findOne( { email });

            if (!user){
                throw new AuthenticationError("No account yet")
            }

            const checkPw = await user.isCorrectPassword(password)

            if (!checkPw) {
                throw new AuthenticationError("Something's not right here.")
            }

            const token = signToken(user)

            return { token, user}
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user){
                const removedBookUser = await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                )
                return removedBookUser;
            }
            throw new AuthenticationError("Sorry gotta be logged in to do that")
        },
        addBook: async (parent, { bookToAdd }, context) => {
            if (context.user){
                const userToUpdate = await User.findByIdAndUpdate(
                    { _id: context.user_id},
                    { $push: { savedBooks: bookToAdd }},
                    { new: true }
                )
                return userToUpdate;
            }
            throw new AuthenticationError("Sorry gotte be loggin in to do that")
        }
    }
}

module.exports = resolvers