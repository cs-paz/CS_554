const peopleRoute = require("./login");

const constructorMethod = (app) => {
  app.use("/api/people", peopleRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
