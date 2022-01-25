const path = require("path");
const loginRoute = require("./login");
const signupRoute = require("./signup");
const logoutRoute = require("./logout");
const blogRoute = require("./blog");
const commentsRoute = require("./comments");

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    if (!req.session.user) {
      res
        .status(401)
        .json({ error: "You must be logged in to view this page." });
    }
  });
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
