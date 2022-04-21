const express = require("express");
const app = express();
var cors = require("cors");
const configRoutes = require("./routes");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const port = 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
