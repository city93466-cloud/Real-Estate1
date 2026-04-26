const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());

// ✅ مهم: نخلي CORS مفتوح
app.use(cors({
 origin: "https://city93466-cloud.github.io",
  credentials: true
}));

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,        
    sameSite: "none"     
  }
}));
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
    if (!req.session.user) {
      return res.status(401).json({ message: "Login required ❌" });
    }

    const { id } = req.params;

    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !property) {
      return res.status(404).json({ message: "Property not found ❌" });
    }

    if (property.user_id !== req.session.user.id) {
      return res.status(403).json({ message: "Not allowed ❌" });
    }

    const { error: deleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(500).json({ message: "Delete failed ❌" });
    }

    res.json({ message: "Deleted ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ================== PORT ==================


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});