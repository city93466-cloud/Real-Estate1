let allProperties = [];

// ================= REGISTER =================
async function register() {
  const name = document.getElementById("name")?.value;
  const lastname = document.getElementById("lastname")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const wilaya = document.getElementById("wilaya")?.value;

  const res = await fetch("https://backend-app-f58v.onrender.com/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({ name, lastname, email, password, wilaya })
  });

  const data = await res.json();
  alert(data.message);

  if (data.message.includes("Registered")) {
    window.location.href = "exo3.html";
  }
}

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("login_email")?.value;
  const password = document.getElementById("login_password")?.value;

  const res = await fetch("https://backend-app-f58v.onrender.com/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);

  if (data.message.includes("successful")) {
    window.location.href = "exo3.html";
  }
}

// ================= LOAD =================
async function loadProperties() {
  try {
    const res = await fetch("https://backend-app-f58v.onrender.com/properties");
    const data = await res.json();

    console.log("PROPERTIES:", data);

    allProperties = data;
    displayProperties(allProperties);

  } catch (err) {
    console.error(err);
  }
}

window.onload = loadProperties;

// ================= DISPLAY =================
function displayProperties(properties) {
  const container = document.getElementById("properties-container");

  container.innerHTML = properties.map(property => `
    <div class="property-card"
         data-city="${property.city}"
         data-type="${property.type}"
         data-price="${property.price}">

      <div class="property-image">
        <img src="${property.image}" />
      </div>

      <div class="property-info">
        <span>🏠 ${property.type}</span>
        <span>📍 ${property.city}</span>
        <span>📌 ${property.operation}</span>
        <span>💰 ${property.price}</span>
        <span>📐 ${property.surface}</span>
        <span>📞 ${property.phone}</span>
        <span class="desc">📝 ${property.description}</span>

        <button onclick="deleteProperty('${property.id}')" class="delete-btn">
          Delete
        </button>
      </div>

    </div>
  `).join("");
}

// ================= ADD =================
async function addProperty(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const city = document.getElementById("city").value;
  const type = document.getElementById("type").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const surface = document.getElementById("surface").value;
  const phone = document.getElementById("phone").value;
  const operation = document.getElementById("operation").value;

  const res = await fetch("https://backend-app-f58v.onrender.com/add-property", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({
      description, city, type, price,
      image, surface, phone, operation
    })
  });

  const data = await res.json();
  alert(data.message);

  document.getElementById("propertyForm").reset();
  loadProperties();
}

// ================= DELETE =================
window.deleteProperty = async function(id) {
  if (!confirm("هل أنت متأكد؟")) return;

  try {
    const res = await fetch(`https://backend-app-f58v.onrender.com/properties/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("تم الحذف ✅");
    loadProperties();

  } catch (err) {
    alert("خطأ ❌");
  }
}

// ================= SEARCH =================
function search() {
  const city = document.getElementById("city1")?.value.toLowerCase() || "";
  const type = document.getElementById("type1")?.value.toLowerCase() || "";
  const price = document.getElementById("price1")?.value;

  let min = 0;
  let max = Infinity;

  if (price) {
    const parts = price.split("-");
    min = Number(parts[0]);
    max = Number(parts[1]);
  }

  const cards = document.querySelectorAll(".property-card");

  cards.forEach(card => {
    const cCity = card.dataset.city.toLowerCase();
    const cType = card.dataset.type.toLowerCase();
    const cPrice = Number(card.dataset.price);

    const match =
      (!city || cCity.includes(city)) &&
      (!type || cType.includes(type)) &&
      (!price || (cPrice >= min && cPrice <= max));

    card.style.display = match ? "flex" : "none";
  });
}