const express = require("express");
const router = express.Router();
const { addComment, deleteComment } = require("../data/comments");
const { getBlog } = require("../data/blog");

router.post("/:id/comments", async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const userId = req.session.user._id.toString();

    const oldBlog = await getBlog({ id });
    if (!oldBlog) {
      res.status(404).json({ error: "No blog found" });
    }

    const commentObj = await addComment({
      blogId: id,
      userId,
      comment,
    });

    if (commentObj) {
      res.status(200).json(commentObj);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.delete("/:blogId/comments/:commentId", async (req, res) => {
  const { blogId, commentId } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const oldBlog = await getBlog({ id: blogId });
    if (!oldBlog) {
      res.status(404).json({ error: "No blog found" });
    }

    const comment = oldBlog.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (req.session.user.username !== comment.username) {
      res
        .status(401)
        .json({ error: "You are not authorized to edit this comment" });
    }

    const commentObj = await deleteComment({
      blogId,
      commentId,
    });

    if (commentObj) {
      res.status(200).json(commentObj);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
