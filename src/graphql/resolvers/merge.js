import User from "../../db/models/User";

export const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
    };
  } catch (error) {
    throw error;
  }
}

const transformPost = event => {
  return {
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator)
  }
}

exports.transformPost = transformPost;
