const { blog, user } = require("../config/mongoCollections");
const connection = require("../config/mongoConnection");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const closeDB = async () => {
  const db = await connection();
  await db.serverConfig.close();
};

const createBlog = async (title, userObj) => {};

const main = async () => {
  // await createUser("cszablewskipaz", "password")
  // console.log(await checkUser("cszablewskipaz", "password"))
};

// main()

module.exports = {};
