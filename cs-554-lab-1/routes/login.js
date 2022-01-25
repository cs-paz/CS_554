const express = require("express");
const router = express.Router();
const { checkUser, getUserByUsername } = require("../data/user");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const authenticated = await checkUser({ username, password });
    const userDetails = await getUserByUsername({
      username: username.toLowerCase(),
    });

    delete userDetails.password;
    req.session.user = userDetails;

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
