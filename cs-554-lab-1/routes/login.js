const express = require("express");
const router = express.Router();
const { checkUser } = require("../data/user");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    await checkUser(username, password);
    req.session.user = { username: username.toLowerCase() };
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
