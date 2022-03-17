const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  try {
    const userExists = await UserModel.exists({
      email: req.body.email,
    });
    console.log("Email already exists", userExists);
    if (userExists) {
      res.render("signup", { error: "Email is already taken!" });
      return;
    }
    const { email, password, fullName } = req.body;
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(password, salt);
    const newUser = {
      email,
      password: hash,
      fullName: fullName,
    };
    const response = await UserModel.create(newUser);
    req.session.userInfo = response;
    req.app.locals.isUSerLoggedIn = true;
    console.log(newUser);
    res.render("profile", { newUser });
    // res.redirect("/login");
  } catch (err) {
    res.render("signup", { error: "An error occured." });
  }
});

// const requireLogin = (req, res, next) => {
//   if (!req.session.currentUser) {
//     res.redirect("/login");
//     return;
//   } else {
//     next();
//   }
// };

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await UserModel.findOne({ email: req.body.email });
    console.log("This is the User:", user);
    const hashFromDb = user.password;
    const passwordCorrect = await bcryptjs.compare(
      req.body.password,
      hashFromDb
    );
    console.log(passwordCorrect ? "Yes" : "No");
    if (!passwordCorrect) {
      throw Error("Password incorrect");
    }
    req.session.currentUser = user;
    console.log("this is the session", req.session);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res.render("login", { error: "Wrong email or password" });
  }
});

router.get("/profile", (req, res) => {
  const loggedInUser = req.session.currentUser;
  res.render("profile", { loggedInUser });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
