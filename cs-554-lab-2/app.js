const express = require("express");
const app = express();
const configRoutes = require("./routes");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const logger = (req, res, next) => {
//   console.log(
//     `[${new Date().toUTCString()}] ${req.method} ${req.originalUrl} ${
//       req.session.user ? "(Authenticated User)" : "(Non-Authenticated User)"
//     }`
//   );
//   next();
// };

// app.use(logger);
app.get("/api/people/history", async (req, res, next) => {
  next();
});

app.get("/api/people/:id", async (req, res, next) => {
  const { id } = req.params;
  const people = await client.getAsync("people");
  if (!people) {
    next();
  }
  const person = JSON.parse(people).find((person) => id === person.id);
  if (person) {
    res.status(200).json(person);
  } else {
    next();
  }
});

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
