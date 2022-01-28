const peopleRoute = require("./people");
const historyRoute = require("./history");

const constructorMethod = (app) => {
  app.use("/api/people/history", historyRoute);
  app.use("/api/people", peopleRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
