const express = require("express");
const router = express.Router();
const { addComment, deleteComment } = require("../data/comments");
const { getBlog } = require("../data/blog");

router.post("/:id/comments", async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ error: "You must be logged in to hit this route." });
    }

    const userId = req.session.user._id.toString();

    let oldBlog = null;
    try {
      oldBlog = await getBlog({ id });
      if (!oldBlog) {
        return res.status(404).json({ error: "No blog found" });
      }
    } catch (e) {
      return res.status(404).json({ error: "No blog found" });
    }

    let commentObj = null;
    try {
      commentObj = await addComment({
        comment,
        blogId: id,
        userId,
      });
      return res.status(200).json(commentObj);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:blogId/comments/:commentId", async (req, res) => {
  const { blogId, commentId } = req.params;
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ error: "You must be logged in to hit this route." });
    }

    let oldBlog = null;
    try {
      oldBlog = await getBlog({ id: blogId });
      if (!oldBlog) {
        return res.status(404).json({ error: "No blog found" });
      }
    } catch (e) {
      return res.status(404).json({ error: "No blog found" });
    }

    const comment = oldBlog.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (req.session.user.username !== comment.username) {
      return res
        .status(401)
        .json({ error: "You are not authorized to edit this comment" });
    }

    let commentObj = null;
    try {
      commentObj = await deleteComment({
        blogId,
        commentId,
      });
      return res.status(200).json(commentObj);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
