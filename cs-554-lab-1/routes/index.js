const path = require("path");
const loginRoute = require("./login");
const signupRoute = require("./signup");
const logoutRoute = require("./logout");
const blogRoute = require("./blog");
const commentsRoute = require("./comments");

const constructorMethod = (app) => {
  app.use("/blog/logout", logoutRoute);
  app.use("/blog", commentsRoute);
  app.use("/blog", blogRoute);
  app.use("/blog/login", loginRoute);
  app.use("/blog/signup", signupRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
