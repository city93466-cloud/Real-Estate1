const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ==========================
// Middlewares
// ==========================
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ==========================
// Data (temporary storage)
// ==========================
const data = {
  properties: [],
  subscribers: [],
  users: []
};

// ==========================
// 🏠 Add Property
// ==========================
app.post("/add-property", (req, res) => {
  const { title, city } = req.body;

  if (!title  !city) {
    return res.status(400).json({ message: "Missing data ❌" });
  }

  data.properties.push(req.body);

  res.json({ message: "Property added ✅" });
});

// ==========================
// 📄 Get Properties
// ==========================
app.get("/properties", (req, res) => {
  res.json(data.properties);
});

// ==========================
// 📧 Subscribe
// ==========================
app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required ❌" });
  }

  data.subscribers.push({ email });

  res.json({ message: "Subscribed successfully ✅" });
});

// ==========================
// 👤 Register
// ==========================
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username  !password) {
    return res.status(400).json({ message: "Missing data ❌" });
  }

  data.users.push({ username, password });

  res.json({ message: "User registered ✅" });
});

// ==========================
// 🔐 Login
// ==========================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = data.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials ❌" });
  }

  res.json({ message: "Login successful ✅" });
});

// ==========================
// 📊 Get Subscribers
// ==========================
app.get("/subscribers", (req, res) => {
  res.json(data.subscribers);
});

// ==========================
// 📦 Get All Data
// ==========================
app.get("/all-data", (req, res) => {
  res.json(data);
});

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});


app.get("/", (req, res) => {
  res.send("<h1>Server is working </h1>");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/realEsTatewbsite.html");
});