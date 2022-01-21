const { blog } = require("../config/mongoCollections");
const { getUser } = require("../data/user");
const { getBlog } = require("../data/blog");
const connection = require("../config/mongoConnection");
const ObjectID = require("mongodb").ObjectID;

// POST
const addComment = async ({ blogId, userId, comment }) => {
  if (!blogId || !userId || !comment) {
    throw new Error("BlogId, userId, and comment must be supplied.");
  }
  if (
    typeof blogId !== "string" ||
    typeof userId !== "string" ||
    typeof comment !== "string"
  ) {
    throw new Error("BlogId, userId, and comment must be strings.");
  }
  const blogCollection = await blog();
  const _user = await getUser({ id: userId });
  const _blog = await getBlog({ id: blogId });

  const _oldComments = _blog.comments;
  const newComments = [
    ..._oldComments,
    { _id: new ObjectID(), comment, username: _user.username },
  ];

  const updateInfo = await blogCollection.updateOne(
    { _id: new ObjectID(blogId) },
    { $set: { comments: newComments } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error("Could not add comment");
  }

  return { commentCreated: true };
};

// DELETE
const deleteComment = async ({ blogId, commentId }) => {
  if (!blogId || !commentId) {
    throw new Error("BlogId and commentId must be supplied.");
  }
  if (typeof blogId !== "string" || typeof commentId !== "string") {
    throw new Error("BlogId and commentId must be strings.");
  }
  const blogCollection = await blog();
  const _blog = await getBlog({ id: blogId });
  const _oldComments = _blog.comments;
  const newComments = _oldComments.filter(
    (comment) => comment._id.toString() !== commentId
  );

  const updateInfo = await blogCollection.updateOne(
    { _id: new ObjectID(blogId) },
    { $set: { comments: newComments } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error("Could not delete comment");
  }

  return { commentDeleted: true };
};

const main = async () => {
  //     console.log(
  //       await addComment({
  //         blogId: "61e9f5b8671f10eada699c7e",
  //         userId: "61e9f2dab334e625851b9dba",
  //         comment: "This is a comment",
  //       })
  //     );
  //   console.log(
  //     await deleteComment({
  //       blogId: "61e9f5b8671f10eada699c7e",
  //       commentId: "61ea0b08248621921c61d009",
  //     })
  //   );
};

main();
