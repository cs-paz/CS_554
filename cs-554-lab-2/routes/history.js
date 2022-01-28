const express = require("express");
const router = express.Router();
const { getById } = require("../data/people");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async (req, res) => {
  const people = await client.getAsync("people");
  if (!people) {
    res.status(404).json({ error: "No people found in the cache." });
    return;
  }
  res.status(200).json(JSON.parse(people));
});

module.exports = router;
