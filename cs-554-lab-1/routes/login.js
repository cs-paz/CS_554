const express = require("express");
const router = express.Router();
const { checkUser } = require("../data/user");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const authenticated = await checkUser({ username, password });
    req.session.user = { username: username.toLowerCase() };
    if (authenticated) {
      res.status(200).json(authenticated);
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
