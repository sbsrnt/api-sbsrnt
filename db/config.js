require("dotenv").config();

const {
  MONGODB_USER: user,
  MONGODB_PASSWORD: password,
  MONGODB_URL_PREFIX: url_prefix,
  MONGODB_URL_SUFFIX: url_suffix,
} = process.env;

export const url = `${url_prefix}${user}:${password}${url_suffix}`;
