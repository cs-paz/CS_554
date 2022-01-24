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
  const skip = req.query.skip;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const blogs = await getAllBlogs({ skip });
    if (blogs) {
      res.status(200).json(blogs);
    } else {
      res.status(404).json({ error: "No blogs found" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const blog = await getBlog({ id });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ error: "No blog found" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  const { title, body } = req.body;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const blog = await createBlog({
      title,
      body,
      username: req.session.user.username,
    });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const oldBlog = await getBlog({ id });
    if (!oldBlog) {
      res.status(404).json({ error: "No blog found" });
    }

    if (req.session.user.username !== oldBlog.userThatPosted.username) {
      res
        .status(401)
        .json({ error: "You are not authorized to edit this blog" });
    }

    const blog = await updateBlog({
      title,
      body,
      id,
    });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }

    const oldBlog = await getBlog({ id });
    if (!oldBlog) {
      res.status(404).json({ error: "No blog found" });
    }

    if (req.session.user.username !== oldBlog.userThatPosted.username) {
      res
        .status(401)
        .json({ error: "You are not authorized to edit this blog" });
    }

    const blog = await patchBlog({
      title,
      body,
      id,
    });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
