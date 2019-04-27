import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../../../db/models/User";
import { createTokens } from '../../utils';

export default {
  Query: {
    user: async (parent, { _id }, context, info) => {
      return await User.findOne({ _id }).exec();
    },
    me: async (_, __, { user }) => {
      if(!user){
        throw new Error("Not Authorized")
      }
      return await user
    },

    users: async (parent, _, context, info) => {
      return await User.find({}).exec();
    }
  },
  Mutation: {
    createUser: async (parent, { user: { email, name, password } }, { user }, info) => {
      if (user) {
        throw new Error("You are already signed in!")
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await new User({
        name,
        email,
        password: hashedPassword
      });

      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updateUser: async (parent, { _id, user }, context, info) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(_id, { $set: { ...user } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deleteUser: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },



    signIn: async (_, { email, password }) => {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        throw new Error("No such user found");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const [token, refreshToken] = await createTokens(
        user,
        process.env.JWT_SECRET
      );

      return await {
        token,
        refreshToken,
        user
      };
    },

    signOut: async (_, __, { user }) => {
      // console.log(user);
      if (!user) {
        throw new Error("No such user found");
      }

      const token = null;

      return await {
        token,
        user
      }
    }
  }
}
