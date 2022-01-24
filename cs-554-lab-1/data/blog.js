const { blog, user } = require("../config/mongoCollections");
const { getUserByUsername } = require("../data/user");
const connection = require("../config/mongoConnection");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const closeDB = async () => {
  const db = await connection();
  await db.serverConfig.close();
};

const validation = (title, body) => {
  if (!title || !body) {
    throw new Error("Title and body must be supplied.");
  }
  if (typeof title !== "string" || typeof body !== "string") {
    throw new Error("Title and body must be strings.");
  }
};

// GET
const getAllBlogs = async ({ skip }) => {
  const blogCollection = await blog();
  const allBlogs = await blogCollection.find({}).toArray();
  if (skip > 0) {
    return allBlogs.slice(skip);
  }
  return allBlogs;
};

// GET
const getBlog = async ({ id }) => {
  const blogCollection = await blog();
  const _blog = await blogCollection.findOne({
    _id: new ObjectID(id),
  });
  if (!_blog) {
    throw new Error("No blog found");
  }
  return _blog;
};

// POST
const createBlog = async ({ title, body, username }) => {
  validation(title, body);

  const _user = await getUserByUsername(username);

  const blogCollection = await blog();
  const newBlog = {
    title,
    body,
    userThatPosted: { _id: new ObjectID(), username: _user.username },
    comments: [],
  };

  const insertInfo = await blogCollection.insertOne(newBlog);

  if (insertInfo.insertedCount === 0) {
    throw new Error("Unable to add new blog.");
  }

  const _blog = await blogCollection.findOne({ title: title, body: body });

  return _blog;
};

// PUT
const updateBlog = async ({ id, title, body }) => {
  validation(title, body);

  const blogCollection = await blog();
  const updatedBlog = {
    title,
    body,
  };

  const updatedInfo = await blogCollection.updateOne(
    { _id: new ObjectID(id) },
    { $set: updatedBlog }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw new Error("Unable to update blog.");
  }

  const _blog = await blogCollection.findOne({ _id: new ObjectID(id) });

  return _blog;
};

// PATCH
const patchBlog = async ({ id, title, body }) => {
  if (title & body) {
    return await updateBlog({ id, title, body });
  }
  if (
    (!title && typeof body !== "string") ||
    (!body && typeof title !== "string")
  ) {
    throw new Error("Invalid type.");
  }

  const blogCollection = await blog();
  const _oldBlog = await blogCollection.findOne({ _id: new ObjectID(id) });

  const updatedBlog = {
    title: title ? title : _oldBlog.title,
    body: body ? body : _oldBlog.body,
  };

  const updatedInfo = await blogCollection.updateOne(
    { _id: new ObjectID(id) },
    { $set: updatedBlog }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw new Error("Unable to update blog.");
  }

  const _blog = await blogCollection.findOne({ _id: new ObjectID(id) });

  return _blog;
};

const main = async () => {
  // console.log(
  //   await createBlog({
  //     title: "test1",
  //     body: "test1",
  //     username: "cszablewskipaz",
  //   })
  // );
  // console.log(await getAllBlogs({ skip: 1 }));
  // console.log(await getBlog({ id: "61e9f5add0f8681d3461f0ab" }));
  // console.log(
  //   await updateBlog({
  //     id: "61e9f5add0f8681d3461f0ab",
  //     title: "new test2",
  //     body: "new body",
  //   })
  // );
  // console.log(
  //   await patchBlog({
  //     id: "61e9f5add0f8681d3461f0ab",
  //     body: "hello",
  //   })
  // );
};

main();

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  patchBlog,
};
