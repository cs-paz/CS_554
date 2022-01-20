const express = require("express");
const router = express.Router();
const { createUser } = require("../data/blog");

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  try {
    const { user } = await createUser(username, name, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(500).json({ error: "Could not create user" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
