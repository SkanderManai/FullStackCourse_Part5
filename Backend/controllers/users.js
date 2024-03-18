const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passwordValidator = require("../utils/passwordValidator");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    author: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!passwordValidator(password)) {
    return res.status(400).json({ error: "password too short" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
