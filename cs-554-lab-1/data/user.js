const { blog, user } = require("../config/mongoCollections");
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
    throw new Error("Both username and password must be supplied.");
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

const createUser = async (username, name, password) => {
  validation(username, name, password);

  const lowerCasedUsername = username.toLowerCase();

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      throw new Error("Error creating hash.");
    }

    const newUser = {
      username: lowerCasedUsername,
      password: hash,
    };

    const userCollection = await user();
    const insertInfo = await userCollection.insertOne(newUser);

    if (insertInfo.insertedCount === 0) {
      throw new Error("Unable to add new user.");
    }
  });

  return { user: getUser(lowerCasedUsername) };
};

const checkUser = async (username, password) => {
  if (!username || !password) {
    throw new Error("Both username and password must be supplied.");
  }
  if (typeof username !== "string" || typeof password !== "string") {
    throw new Error("Username and password must be strings.");
  }

  const lowerCasedUsername = username.toLowerCase();

  const userCollection = await user();
  const user = await userCollection.findOne({ username: lowerCasedUsername });

  hash = user.password;

  const passwordMatches = await bcrypt.compare(password, hash);

  if (!passwordMatches) {
    throw new Error("Either the username or password is invalid");
  }

  return { authenticated: true };
};

const getUser = async (username) => {
  const userCollection = await user();
  const user = await userCollection.findOne({ username: username });
  return user;
};

module.exports = {
  createUser,
  checkUser,
};
