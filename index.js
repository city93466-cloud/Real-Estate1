const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
                         
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname)));

// ================== HOME ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "exo3.html"));
});

// ================== SUPABASE ==================
const supabase = createClient(
  "https://fbzyeemhuohhgpwihzru.supabase.co",
  "sb_publishable_uP_w9YzVfED9WkZUI5xrVg_xnAPIoAJ"
);

// ================== REGISTER ==================
app.post("/register", async (req, res) => {
  const { email, password, name, lastname, wilaya } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.json({ message: error.message });

  await supabase.from("users").insert([{
    id: data.user.id,
    name: name + " " + lastname,
    email,
    wilaya
  }]);

  res.json({ message: "Registered ✅" });
});

// ================== LOGIN ==================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.json({ message: error.message });

  req.session.user = data.user;

  res.json({ message: "Login successful ✅" });
});

// ================== GET PROPERTIES ==================
app.get("/properties", async (req, res) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return res.json({ error: error.message });
  }

  res.json(data);
});

// ================== ADD PROPERTY ==================
app.post("/add-property", async (req, res) => {
  if (!req.session.user) {
    return res.json({ message: "Login required ❌" });
  }

  const {
    description, city, type, price,
    image, surface, phone, operation
  } = req.body;

  await supabase.from("properties").insert([{
    description,
    city,
    type,
    price,
    image,
    surface,
    phone,
    operation,
    user_id: req.session.user.id
  }]);

  res.json({ message: "Added ✅" });
});

// ================== DELETE ==================

  app.delete("/properties/:id", async (req, res) => {
  try {
    // 🔐 تحقق login
    if (!req.session.user) {
      return res.status(401).json({ message: "Login required ❌" });
    }

    const { id } = req.params;

    // 🔍 نجيب العقار (نستعمل single)
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !property) {
      return res.status(404).json({ message: "Property not found ❌" });
    }

    // 🔐 تحقق المالك
    if (property.user_id !== req.session.user.id) {
      return res.status(403).json({ message: "لا يمكنك حذف هذا العقار ❌" });
    }

    // 🗑️ حذف
    const { error: deleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(500).json({ message: "فشل الحذف ❌" });
    }

    res.status(200).json({ message: "تم الحذف بنجاح ✅" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});