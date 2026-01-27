const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
  session({
    secret: "wallet-secret",
    resave: false,
    saveUninitialized: true
  })
);

// بيانات الأدمن
const ADMIN_EMAIL = "admin@wallet.com";
const ADMIN_PASSWORD = "Waleed12345#";

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
    const DATA_FILE = "./data.json";

// تحميل البيانات
let balance = 0;
let transactions = [];

if (fs.existsSync(DATA_FILE)) {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  balance = data.balance;
  transactions = data.transactions;
}
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

  // حفظ في الملف
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({ balance, transactions }, null, 2)
  );

  res.redirect("/admin");
});
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
