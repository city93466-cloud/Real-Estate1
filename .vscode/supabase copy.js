// ==========================// ==========================
// CONNECT SUPABASE
// ==========================
const client = window.supabase.createClient(
  "https://fbzyeemhuohhgpwihzru.supabase.co",
  "sb_publishable_uP_w9YzVfED9WkZUI5xrVg_xnAPIoAJ"
);

// ==========================
// REGISTER (FIXED ❗)
// ==========================
async function register() {
  const name = document.getElementById("name")?.value.trim();
  const lastname = document.getElementById("lastname")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const wilaya = document.getElementById("wilaya")?.value.trim();

  if (!name || !lastname || !email || !password) {
    alert("❌ عبي جميع الخانات");
    return;
  }

  const { data, error } = await client.auth.signUp({ email, password });

  if (error) return alert("❌ " + error.message);

  const user = data.user ?? data.session?.user;

  if (user) {
    const { error: insertError } = await client.from("users").insert([
      {
        id: user.id,
        name: name + " " + lastname,
        email,
        wilaya
      }
    ]);

    if (insertError) return alert("❌ " + insertError.message);
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

  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) return alert("❌ " + error.message);

  localStorage.setItem("user", JSON.stringify(data.user ?? data.session?.user));

  alert("مرحبا بك 🔥");
  window.location.href = "exo3.html";
}

// ==========================
// ADD PROPERTY (FIXED 🔥)
// ==========================
async function addProperty(e) {
  e.preventDefault();

  const description = document.getElementById("description")?.value.trim();
  const city = document.getElementById("city")?.value.trim();
  const type = document.getElementById("type")?.value.trim();
  const price = document.getElementById("price")?.value.trim();
  const image = document.getElementById("image")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const surface = document.getElementById("surface")?.value.trim();
  const operation = document.getElementById("operation")?.value.trim();

  console.log({ description, city, type, price, surface });

  if (!description || !city || !type || !price || !surface) {
    alert("❌ عبي جميع الخانات");
    return;
  }

  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    alert("❌ لازم تسجل الدخول");
    return;
  }

  const { error } = await client.from("properties").insert([
    {
      description,
      city,
      type,
      price: Number(price),
      image,
      phone,
      surface: Number(surface),
      operation,
      user_id: user.id
    }
  ]);

  if (error) {
    alert("❌ " + error.message);
  } else {
    alert("تم إضافة العقار ✅");
    document.getElementById("propertyForm").reset();
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
// DISPLAY PROPERTIES
// ==========================
async function displayProperties(properties) {
  const container = document.getElementById("properties-container");
  if (!container) return;

  const {
    data: { user }
  } = await client.auth.getUser();

  container.innerHTML = "";

  properties.forEach(p => {
    const isOwner = user && user.id === p.user_id;

    container.innerHTML += `
      <div class="property-card"
           data-city="${p.city}"
           data-type="${p.type}"
           data-price="${p.price}">

        ${isOwner ? `
        <div class="menu">
          <button onclick="toggleMenu(this)">⋮</button>
          <div class="dropdown hidden">
            <button onclick="deleteProperty('${p.id}')">Delete</button>
          </div>
        </div>
        ` : ""}

        <div class="property-info">
          <span class="badge price">${p.price} DZD</span>
          <span class="badge desc">${p.description}</span>

          <span class="type">${p.type}</span>
          <span class="city">${p.city}</span>
          <span class="operation">${p.operation || ""}</span>
           <span class="badge surface">📐 ${p.surface} m²</span>
<span class="badge phone">📞 ${p.phone || ""}</span>
          
        </div>

        <div class="property-image">
          <img src="${p.image}" alt="house">
        </div>
      </div>
    `;
  });
}

// ==========================
// DELETE PROPERTY
// ==========================
async function deleteProperty(id) {
  if (!confirm("هل تريد حذف العقار؟")) return;

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

  console.log("JS WORKING ✅");

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

// ==========================
// WELCOME USER
// ==========================
window.onload = async () => {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (user && document.getElementById("welcome")) {
    document.getElementById("welcome").innerText =
      "Welcome " + user.email.split("@")[0];
  }
};