const express = require("express");
const router = express.Router();
const { getById } = require("../data/people");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const addPersonToRedisDB = async ({ person, db, name }) => {
  const _db = JSON.parse(db);
  // add person to array
  _db.push(person);
  await client.setAsync(name, JSON.stringify(_db));
};

router.get("/:id", async (req, res) => {
  let person = null;
  try {
    const cache = await client.getAsync("peopleCache");
    const history = await client.getAsync("peopleHistory");
    if (cache) {
      const id = parseInt(req.params.id);
      person = JSON.parse(cache).find((person) => id === person.id);
      if (person) {
        await addPersonToRedisDB({
          person,
          db: history,
          name: "peopleHistory",
        });
        return res.status(200).json(person);
      }
    }

    person = await getById(req.params.id);
    if (!cache) {
      await client.setAsync("peopleCache", JSON.stringify([person]));
      await client.setAsync("peopleHistory", JSON.stringify([person]));
    } else {
      await addPersonToRedisDB({ person, db: history, name: "peopleHistory" });
      await addPersonToRedisDB({ person, db: cache, name: "peopleCache" });
    }

    return res.status(200).json(person);
  } catch (e) {
    res.status(404).json({ error: e.toString() });
    return;
  }
});

module.exports = router;
