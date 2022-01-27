const express = require("express");
const router = express.Router();
const { getById } = require("../data/people");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/:id", async (req, res) => {
  let person = null;
  try {
    person = await getById(req.params.id);
    const oldCache = await client.getAsync("people");
    if (!oldCache) {
      await client.setAsync("people", JSON.stringify([person]));
    } else {
      const newCache = JSON.parse(oldCache);
      newCache.push(person);
      await client.setAsync("people", JSON.stringify(newCache));
    }

    res.status(200).json(person);
  } catch (e) {
    res.status(404).json({ error: e.toString() });
    return;
  }
});

router.get("/history", async (req, res) => {});

module.exports = router;
