const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:8080",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.post("/api/login", (req, res) => {
  res.cookie("userID", "testUser", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
  });
  res.status(200).json({ message: "Logged in" });
});

app.get("/api/profile", (req, res) => {
  console.log("Raw cookies:", req.headers.cookie);
  console.log("Parsed cookies:", req.cookies);
  if (!req.cookies.userID) return res.status(400).json({ error: "No userID" });
  res.json({ userID: req.cookies.userID });
});

app.listen(5000, () => console.log("Server running on 5000"));
