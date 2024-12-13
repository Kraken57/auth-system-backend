const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const { requiredBody } = require("./validation");
const bcrypt = require("bcrypt");
const app = express();

mongoose.connect("YOUR_MONGODB_CONNECTION_STRING");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedDataWithSuccess = requiredBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    return res.json({
      message: "Incorrect format",
      error: parsedDataWithSuccess.error.errors,
    });
  }

  const { email, password, name } = req.body;

  try {
    const userexist = await UserModel.findOne({ email });
    if (userexist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPass = await bcrypt.hash(password, 5);

    await UserModel.create({
      email: email,
      password: hashedPass,
      name: name,
    });

    res.status(201).json({
      message: "You signed up",
    });
  } catch (error) {
    console.error(e); // Log the error for debugging
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
  });
  if (!user) {
    res.json({
      message: "User doesn't exist in the database",
    });
  }

  const passMatch = bcrypt.compare(password, user.password);

  if (passMatch) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET
    );

    res.json({
      message: "Signin Successful",
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
    });
  }
});

app.post("/todo", auth, async (req, res) => {
  const { title, done } = req.body;
  const userId = req.userId;
  await TodoModel.create({
    title,
    done,
    userId,
  });
  res.json({
    umessage: "Todo created",
  });
});

app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;
  const todos = await TodoModel.find({
    userId,
  });
  res.json({
    todos,
  });
});

app.listen(3000, () => {
  console.log("Server running at 3000");
});
