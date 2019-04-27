const jwt = require("jsonwebtoken");
import pick from 'lodash/pick';
import User from '../db/models/User';


const noPassword = ({ password, __v, _id, ...rest }) => rest;

const createTokens = async (user, secret) => {
  const createToken = jwt.sign(
    {
      user: pick(user, "_id")
    },
    secret,
    {
      expiresIn: "1y"
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: pick(user, "_id")
    },
    secret,
    {
      expiresIn: "1min"
    }
  );

  return Promise.all([createToken, createRefreshToken]);
}

const refreshTokens = async (refreshToken, SECRET) => {
  let userId = -1;
  try {
    const {
      user: { _id }
    } = jwt.verify(refreshToken.replace("Bearer ", ""), SECRET);
    userId = _id;
  } catch (err) {
    return {};
  }

  const user = await User.findOne({ _id: userId }).exec()

  const [newToken, newRefreshToken] = await createTokens(user, SECRET);
  return await {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  }
};

const getUser = async (refreshToken) => {
  if (refreshToken) {
    const { user } = await refreshTokens(refreshToken, process.env.JWT_SECRET);
    if(user){
      return await noPassword(user.toJSON() )
    }
    throw new AuthExpiredError();
  }
  throw new AuthError();
}

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

class AuthExpiredError extends Error {
  constructor() {
    super("Token expired");
  }
}

module.exports = {
  createTokens,
  getUser
};
