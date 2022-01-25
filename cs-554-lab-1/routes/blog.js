const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  patchBlog,
} = require("../data/blog");

router.get("/", async (req, res) => {
  const { skip, take } = req.query;
  try {
    let blogs = null;
    try {
      blogs = await getAllBlogs({ skip, take });
      return res.status(200).json(blogs);
    } catch (e) {
      return res.status(404).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let blog = null;
    try {
      blog = await getBlog({ id });
      return res.status(200).json(blog);
    } catch (e) {
      return res.status(404).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { title, body } = req.body;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to hit this route." });
    }

    let blog = null;
    try {
      blog = await createBlog({
        title,
        body,
        username: req.session.user.username,
      });
      return res.status(200).json(blog);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to hit this route." });
    }

    let oldBlog = null;
    try {
      oldBlog = await getBlog({ id });
      if (!oldBlog) {
        return res.status(404).json({ error: "No blog found" });
      }
    } catch (e) {
      return res.status(404).json({ error: "No blog found" });
    }

    if (req.session.user.username !== oldBlog.userThatPosted.username) {
      res
        .status(401)
        .json({ error: "You are not authorized to edit this blog" });
    }

    let blog = null;
    try {
      blog = await updateBlog({
        id,
        title,
        body,
      });
      return res.status(200).json(blog);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id", async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to hit this route." });
    }

    let oldBlog = null;
    try {
      oldBlog = await getBlog({ id });
      if (!oldBlog) {
        return res.status(404).json({ error: "No blog found" });
      }
    } catch (e) {
      return res.status(404).json({ error: "No blog found" });
    }

    if (req.session.user.username !== oldBlog.userThatPosted.username) {
      res
        .status(401)
        .json({ error: "You are not authorized to edit this blog" });
    }

    let blog = null;
    try {
      blog = await patchBlog({
        id,
        title,
        body,
      });
      return res.status(200).json(blog);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
