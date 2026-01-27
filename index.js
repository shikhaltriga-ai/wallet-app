const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "wallet-secret",
    resave: false,
    saveUninitialized: true
  })
);

// بيانات الأدمن
const ADMIN_EMAIL = "admin@wallet.com";
const ADMIN_PASSWORD = "123456";

let balance = 0;
let transactions = [];

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.redirect("/admin");
  } else {
    res.send("❌ بيانات غير صحيحة");
  }
});

app.get("/admin", (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/login");
  }
  res.render("admin", { balance, transactions });
});

app.post("/add", (req, res) => {
  if (!req.session.admin) return res.redirect("/login");

  const { type, amount } = req.body;
  const value = Number(amount);

  if (type === "in") balance += value;
  if (type === "out") balance -= value;

  transactions.push({ type, amount: value });
  res.redirect("/admin");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
