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
  properties: [
    {
      id: 1,
      title: "Villa moderne",
      city: "Alger",
      type: "Villa",
      price: 200000,
      image: "https://via.placeholder.com/300"
    },
    {
      id: 2,
      title: "Appartement simple",
      city: "Oran",
      type: "Appartement",
      price: 150000,
      image: "https://via.placeholder.com/300"
    },
    {
      id: 3,
      title: "Maison familiale",
      city: "Tiaret",
      type: "Villa",
      price: 300000,
      image: "https://via.placeholder.com/300"
    }
  ],
  subscribers: [],
  users: []
};

// ==========================
// 🏠 Add Property
// ==========================
app.post("/add-property", (req, res) => {
  const { title, city, type, price, image } = req.body;

  if (!title || !city || !type || !price) {
    return res.status(400).json({ message: "Missing data ❌" });
  }

  data.properties.push({
    id: Date.now(),
    title,
    city,
    type,
    price: Number(price),
    image
  });

  res.json({ message: "Property added ✅" });
});

// ==========================
// 🔍 Search Properties (FIXED)
// ==========================
app.get("/search", (req, res) => {
  const { city, type, minPrice, maxPrice } = req.query;

  let result = data.properties.filter(p => {

    const cityMatch = city
      ? p.city.toLowerCase().includes(city.toLowerCase())
      : false;

    const typeMatch = type
      ? p.type.toLowerCase().includes(type.toLowerCase())
      : false;

    // 🔥 تصحيح شرط السعر (لازم يكون AND مش OR)
    const priceMatch =
      (minPrice && maxPrice)
        ? (p.price >= Number(minPrice) && p.price <= Number(maxPrice))
        : false;

    // 🔥 إذا ما اختارش حتى حاجة → رجع كلش
    if (!city && !type && !minPrice && !maxPrice) {
      return true;
    }

    return cityMatch || typeMatch || priceMatch;
  });

  res.json(result);
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

  if (!username || !password) {
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
// 🏠 Home Page
// ==========================
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});








































// ==========================
// CONNECT SUPABASE
// ==========================
const client = window.supabase.createClient(
  "https://fbzyeemhuohhgpwihzru.supabase.co",
  "sb_publishable_uP_w9YzVfED9WkZUI5xrVg_xnAPIoAJ"
);

// ==========================
// REGISTER
// ==========================
async function register() {
  const name = document.getElementById("name").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const wilaya = document.getElementById("wilaya").value;

  if (!name || !lastname || !email || !password) {
    alert("عمر جميع الخانات ❗");
    return;
  }

  const { data, error } = await client.auth.signUp({ email, password });

  if (error) return alert("❌ " + error.message);

  const user = data.user ?? data.session?.user;

  if (user) {
    await client.from("users").insert([{
      id: user.id,
      name: name + " " + lastname,
      email,
      wilaya
    }]);
  }

  alert("تم إنشاء الحساب ✅");
  window.location.href = "exo3.html";
}

// ==========================
// LOGIN
// ==========================
async function login() {
  const email = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  const { data, error } = await client.auth.signInWithPassword({
    email, password
  });

  if (error) return alert("❌ " + error.message);

  localStorage.setItem("user", JSON.stringify(data.user));

  alert("مرحبا بك 🔥");
  window.location.href = "exo3.html";
}

// ==========================
// ADD PROPERTY
// ==========================
async function addProperty(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const city = document.getElementById("city").value;
  const type = document.getElementById("type").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const phone = document.getElementById("phone").value;
  const surface = document.getElementById("surface").value;
  const operation = document.getElementById("operation").value;

  const { data: { user } } = await client.auth.getUser();

  if (!user) return alert("دير login أولاً ❌");

  const { error } = await client.from("properties").insert([{
    description,
    city,
    type,
    price,
    image,
    phone,
    surface,
    operation,
    user_id: user.id
  }]);

  if (error) {
    alert("❌ " + error.message);
  } else {
    alert("تم إضافة العقار 🏠");
    document.getElementById("propertyForm").reset();
    loadProperties();
  }
}

// ==========================
// DELETE PROPERTY 🔥
// ==========================
async function deleteProperty(id) {
  if (!confirm("هل تريد حذف هذا العقار؟")) return;

  const { error } = await client
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    alert("❌ " + error.message);
  } else {
    alert("تم الحذف ✅");
    loadProperties();
  }
}

// ==========================
// LOAD PROPERTIES
// ==========================
async function loadProperties() {
  const { data, error } = await client
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  if (error) return console.log(error);

  displayProperties(data);
}

// ==========================
// DISPLAY PROPERTIES 🔥
// ==========================
async function displayProperties(properties) {
  const container = document.getElementById("properties-container");
  if (!container) return;

  container.innerHTML = "";

  const { data: { user } } = await client.auth.getUser();

  properties.forEach(p => {

    const isOwner = user && user.id === p.user_id;

    container.innerHTML += `
      <div class="property-card">

        ${isOwner ? `
        <div class="menu">
          <button onclick="toggleMenu(this)">⋮</button>
          <div class="dropdown hidden">
            <button onclick="deleteProperty(${p.id})">Delete</button>
          </div>
        </div>
        ` : ""}

        <div class="property-info">
          <span class="badge price">${p.price} DZD</span>
          <span class="badge desc">${p.description}</span>

          <span class="type">${p.type}</span>
          <span class="city">${p.city}</span>
          <span class="operation">${p.operation}</span>

          <p class="extra">📐 ${p.surface} m²</p>
          <p class="extra phone">📞 ${p.phone}</p>
        </div>

        <div class="property-image">
          <img src="${p.image}" alt="house">
        </div>

      </div>
    `;
  });
}

// ==========================
// MENU
// ==========================
function toggleMenu(btn) {
  const dropdown = btn.nextElementSibling;
  dropdown.classList.toggle("hidden");
}

// ==========================
// EVENTS
// ==========================
window.addEventListener("DOMContentLoaded", () => {

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      register();
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      login();
    });
  }

  const propertyForm = document.getElementById("propertyForm");
  if (propertyForm) {
    propertyForm.addEventListener("submit", addProperty);
  }

  loadProperties();
});







<div class="property-info">
          ${p.title ? `<h2>${p.title}</h2>` : ""}
          
          <span class="badge price">${p.price} DZD</span>
          <span class="badge desc">${p.description}</span>

          <span class="type">${p.type}</span>
          <span class="city">${p.city}</span>
          <span class="operation">${p.operation}</span>

          <p class="extra">📐 ${p.surface} m²</p>
          <p class="extra phone">📞 ${p.phone}</p>
        </div>