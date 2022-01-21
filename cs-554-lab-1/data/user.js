const { user } = require("../config/mongoCollections");
const connection = require("../config/mongoConnection");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const closeDB = async () => {
  const db = await connection();
  await db.serverConfig.close();
};

const validation = (username, name, password) => {
  if (!username || !password || !name) {
    throw new Error("Username, name, and password must be supplied.");
  }

  if (
    typeof username !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Username , name, and password must be strings.");
  }

  const alphaNumericRegex = /^[a-z0-9]+$/i;
  const noWhiteSpacesRegex = /^\S*$/;

  if (!alphaNumericRegex.test(username)) {
    throw new Error(
      "Username must consist of no spaces and only alphanumeric characters."
    );
  }

  if (!noWhiteSpacesRegex.test(password)) {
    throw new Error("Password must not contain any white spaces.");
  }
};

const createUser = async ({ username, name, password }) => {
  validation(username, name, password);

  const userCollection = await user();
  const lowerCasedUsername = username.toLowerCase();

  const hash = await bcrypt.hash(password, saltRounds);

  const newUser = {
    username: lowerCasedUsername,
    name,
    password: hash,
  };

  const insertInfo = await userCollection.insertOne(newUser);

  if (insertInfo.insertedCount === 0) {
    throw new Error("Unable to add new user.");
  }

  const _user = await userCollection.findOne({ username: lowerCasedUsername });

  return { user: _user };
};

const checkUser = async ({ username, password }) => {
  if (!username || !password) {
    throw new Error("Both username and password must be supplied.");
  }
  if (typeof username !== "string" || typeof password !== "string") {
    throw new Error("Username and password must be strings.");
  }

  const lowerCasedUsername = username.toLowerCase();

  const userCollection = await user();
  const _user = await userCollection.findOne({ username: lowerCasedUsername });

  const hash = _user.password;

  const passwordMatches = await bcrypt.compare(password, hash);

  if (!passwordMatches) {
    throw new Error("Either the username or password is invalid");
  }

  return { authenticated: true };
};

const getUserByUsername = async (username) => {
  const userCollection = await user();
  const _user = await userCollection.findOne({ username: username });
  return _user;
};

const getUser = async ({ id }) => {
  const userCollection = await user();
  const _user = await userCollection.findOne({ _id: new ObjectID(id) });
  return _user;
};

const main = async () => {
  // console.log(await createUser("cszablewskipaz", "Christian Paz", "password"));
  // // console.log(await createUser("scruncherz", "Mateo Paz", "pwd123"));
  // // console.log(await createUser("robloxguy", "Steven Paz", "omgroblox123"));
  // console.log(await checkUser("cszablewskipaz", "password"));
};

main();

module.exports = {
  createUser,
  checkUser,
  getUserByUsername,
  getUser,
};
