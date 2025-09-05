// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZxhX_WjofN9anAS2hrp9eU3YgFQfyFyc",
  authDomain: "timeaura-watches.firebaseapp.com",
  databaseURL: "https://timeaura-watches-default-rtdb.firebaseio.com",
  projectId: "timeaura-watches",
  storageBucket: "timeaura-watches.appspot.com",
  messagingSenderId: "1051941165219",
  appId: "1:1051941165219:web:a76b6d8bcf8148592f0716"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();



// Slider Function
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
  slides.forEach(slide => (slide.style.display = "none"));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].style.display = "block";
  setTimeout(showSlides, 5000);
}
showSlides();

// All Watches Data
const allWatches = [
  { id: "M101", img: "watch.jpg", name: "Titan Edge", price: "₹2,999", category: "men" },
  { id: "M102", img: "watch1.jpg", name: "Fastrack Bold", price: "₹4,999", category: "men" },
  { id: "W201", img: "watch5.jpg", name: "Titan Raga", price: "₹3,299", category: "women" },
  { id: "W202", img: "watch6.jpg", name: "Sonata Chic", price: "₹2,199", category: "women" },
  { id: "C301", img: "watch7.jpg", name: "Couple Classic Set", price: "₹5,999", category: "couple" },
  { id: "C302", img: "watch4.jpg", name: "Elegant Gold Pair", price: "₹6,499", category: "couple" },
  { id: "M101", img: "watch.jpg", name: "Titan Edge", price: "₹2,999", category: "men" },
  { id: "M102", img: "watch1.jpg", name: "Fastrack Bold", price: "₹4,999", category: "men" },
  { id: "W201", img: "watch5.jpg", name: "Titan Raga", price: "₹3,299", category: "women" },
  { id: "W202", img: "watch6.jpg", name: "Sonata Chic", price: "₹2,199", category: "women" },
  { id: "C301", img: "watch7.jpg", name: "Couple Classic Set", price: "₹5,999", category: "couple" },
  { id: "C302", img: "watch4.jpg", name: "Elegant Gold Pair", price: "₹6,499", category: "couple" },
  { id: "M101", img: "watch.jpg", name: "Titan Edge", price: "₹2,999", category: "men" },
  { id: "M102", img: "watch1.jpg", name: "Fastrack Bold", price: "₹4,999", category: "men" },
  { id: "W201", img: "watch5.jpg", name: "Titan Raga", price: "₹3,299", category: "women" },
  { id: "W202", img: "watch6.jpg", name: "Sonata Chic", price: "₹2,199", category: "women" },
  { id: "C301", img: "watch7.jpg", name: "Couple Classic Set", price: "₹5,999", category: "couple" },
  { id: "C302", img: "watch4.jpg", name: "Elegant Gold Pair", price: "₹6,499", category: "couple" }
];

// Filter Watches
function filterWatches(category) {
  const container = document.getElementById("popular-container");
  const filtered = category === "all" ? allWatches : allWatches.filter(w => w.category === category);

  container.innerHTML = filtered.map(watch => `
    <div class="watch-card">
      <img src="${watch.img}" alt="${watch.name}">
      <h4>${watch.name}</h4>
      <p>${watch.price}</p>
      <p><strong>Model ID:</strong> ${watch.id}</p>
      <button class="buy-btn" onclick="addToCart('${watch.id}', '${watch.name}', '${watch.price}', '${watch.img}')">Add to Cart</button>
    </div>
  `).join('');
}

window.onload = () => filterWatches("all");

// Cart Functions
let cart = [];

function addToCart(id, name, price, img) {
  cart.push({ id, name, price, img });
  showToast(`${name} added to cart!`);
}

function openCart() {
  const cartContainer = document.getElementById("cart-container");
  const cartOverlay = document.getElementById("cart-overlay");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>No items in cart.</p>";
  } else {
    cart.forEach((item, index) => {
      cartContainer.innerHTML += `
        <div class="watch-card">
          <img src="${item.img}" width="100">
          <h4>${item.name}</h4>
          <p>${item.price}</p>
          <button class="buy-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      `;
    });
  }

  cartOverlay.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-overlay").style.display = "none";
  document.body.style.overflow = "auto";
}

function removeItem(index) {
  cart.splice(index, 1);
  openCart();
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("order-form-popup").style.display = "flex";

  // Initialize map picker after a short delay to ensure container is visible
  setTimeout(initMapPicker, 100);
}

// submit orderr
// ✅ Updated Submit Order
function submitOrder() {
  console.log("🚀 Confirm Order button clicked!");  // Debug line

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const paymentMethod = document.getElementById("payment-method").value;
  const location = document.getElementById("customer-location").value.trim();

  if (!name || phone.length < 10 || !paymentMethod || paymentMethod === "Select" || !location) {
    alert("⚠️ Please fill all fields correctly!");
    return;
  }

  console.log("✅ Passed validation. Saving to Firebase...");

  let totalAmount = cart.reduce((sum, item) => {
    return sum + parseInt(item.price.replace(/[₹,]/g, ""));
  }, 0);

  const orderRef = database.ref("orders").child(name + "_" + phone);

  orderRef.set({
    customer: name,
    phone: phone,
    payment: paymentMethod,
    location: location,
    total: `₹${totalAmount}`
  }).then(() => {
    console.log("✅ Order saved to Firebase!");

    const itemsRef = orderRef.child("items");
    cart.forEach(item => {
      itemsRef.push(item);
    });

    alert("✅ Your order has been placed successfully!");
    cart = [];

    document.getElementById("customer-name").value = "";
    document.getElementById("customer-phone").value = "";
    document.getElementById("payment-method").value = "Select";
    document.getElementById("customer-location").value = "";

    closeCart();
    document.getElementById("order-form-popup").style.display = "none";
  }).catch(err => {
    console.error("❌ Firebase Error:", err);
    alert("❌ Failed to place order. Check console for details.");
  });
}


function closeOrderForm() {
  document.getElementById("order-form-popup").style.display = "none";
}


function viewOrders() {
  const phone = prompt("Enter your phone number to view your order:");
  if (!phone || phone.trim().length < 10) {
    alert("Please enter a valid phone number.");
    return;
  }

  const ordersRef = database.ref("orders");
  ordersRef.once("value", snapshot => {
    const orders = snapshot.val();
    let found = false;

    for (let name in orders) {
      if (orders[name].phone === phone) {
        found = true;
        const order = orders[name];
        let html = `
          <p><strong>Name:</strong> ${order.customer}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Payment:</strong> ${order.payment}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <h4>Ordered Items:</h4>
          <div id="order-items-container">
        `;

        if (order.items) {
          for (let key in order.items) {
            const item = order.items[key];
            html += `
              <div class="ordered-item">
                <img src="${item.img}" width="100"><br>
                <strong>${item.name}</strong><br>
                Price: ${item.price}<br>
                <button onclick="removeItemFromOrder('${name}', '${key}')" class="remove-btn">Remove Item</button>
              </div>
            `;
          }
        }

        html += `</div>
          <button onclick="cancelOrder('${name}')" style="background:black; color:white; padding:10px 20px; border:none; border-radius:5px; margin-top:10px;">
            Cancel Order
          </button>
        `;

        document.getElementById("order-container").innerHTML = html;
        document.getElementById("order-popup").style.display = "block";
        break;
      }
    }

    if (!found) {
      alert("❌ No order found with this phone number.");
    }
  });
}

function removeItemFromOrder(customerName, itemId) {
  if (confirm("Are you sure you want to remove this item from your order?")) {
    const itemRef = database.ref(`orders/${customerName}/items/${itemId}`);
    itemRef.remove()
      .then(() => {
        alert("✅ Item removed successfully.");
        viewOrders();
      })
      .catch(() => {
        alert("❌ Failed to remove the item. Please try again.");
      });
  }
}

function cancelOrder(name) {
  if (confirm("Are you sure you want to cancel this order?")) {
    database.ref("orders").child(name).remove()
      .then(() => {
        alert("✅ Your order has been cancelled.");
        closeOrderPopup();
      })
      .catch(() => {
        alert("❌ Failed to cancel the order. Try again.");
      });
  }
}

function closeOrderPopup() {
  document.getElementById("order-popup").style.display = "none";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.animation = "fadeInOut 3s ease-in-out";

  setTimeout(() => {
    toast.style.display = "none";
    toast.style.animation = "";
  }, 3000);
}
document.querySelector(".menu-toggle").addEventListener("click", function () {
  document.querySelector("nav ul").classList.toggle("show");
});

// map location 
let map, marker, autocomplete;

function initMapPicker() {
  const defaultLocation = { lat: 13.0301, lng: 80.2212 }; // Velachery approx

  // Initialize the map
  map = new google.maps.Map(document.getElementById("map-picker"), {
    center: defaultLocation,
    zoom: 15
  });

  // Initialize the marker
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    position: defaultLocation
  });

  // Update input when marker is dragged
  marker.addListener("dragend", function () {
    const pos = marker.getPosition();
    document.getElementById("customer-location").value = `https://www.google.com/maps?q=${pos.lat().toFixed(5)},${pos.lng().toFixed(5)}`;
  });

  // Initialize autocomplete
  const input = document.getElementById("customer-location");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    // Move map & marker to the selected place
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);

    // Update input with Google Maps link
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    input.value = `https://www.google.com/maps?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
  });
}

// Call map picker when order form opens
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("order-form-popup").style.display = "flex";

  // Delay to ensure map container is visible
  setTimeout(initMapPicker, 100);
}


// Firebase Auth + Database
// Firebase Auth + Database
const auth = firebase.auth();
const db = firebase.database();

// Show / Close Popup
function showLoginPopup() {
  document.getElementById("login-popup").style.display = "flex";
}

function closeLoginPopup() {
  document.getElementById("login-popup").style.display = "none";
}

// Sign Up
function signUp() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("✅ Account created successfully!");
      saveCart(userCredential.user.uid); // Save empty cart initially
      closeLoginPopup();
    })
    .catch(error => {
      console.error("Sign Up Error:", error);
      alert("❌ Sign Up Error: " + error.message);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("✅ Logged in successfully!");
      loadCart(userCredential.user.uid); // Load cart from DB
      closeLoginPopup();
    })
    .catch(error => {
      console.error("Login Error:", error);
      alert("❌ Login Error: " + error.message);
    });
}
// Guest Login (does NOT appear in Auth users)
function guestLogin() {
  const guestUID = "guest_" + Date.now();
  alert("Guest login successful! UID: " + guestUID);
  closeLoginPopup();
  loadCart(guestUID); // Load or create temporary cart
}



// SAVE CART TO DB
function saveCart(uid) {
  db.ref("users/" + uid + "/cart").set(cart)
    .then(() => console.log("Cart saved for UID:", uid))
    .catch(err => console.log("Error saving cart:", err));
}


// LOAD CART FROM DB
function loadCart(uid) {
  db.ref("users/" + uid + "/cart").once("value", snapshot => {
    if (snapshot.exists()) {
      cart = snapshot.val(); // load cart
      renderCart();
    } else {
      cart = [];
      renderCart();
    }
  });
}


// AUTH STATE CHANGE
// Show login popup automatically if no user is logged in
document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // No user logged in, show login popup
      showLoginPopup();
    } else {
      // User is logged in, load their cart
      loadCart(user.uid);
    }
  });
});


// EMAIL VALIDATION FUNCTION
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showLoginPopup() {
  const popup = document.getElementById("login-popup");
  if (popup) {
    popup.style.display = "flex";
  } else {
    console.error("Login popup element not found!");
  }
}

function closeLoginPopup() {
  document.getElementById("login-popup").style.display = "none";
}


document.getElementById("showPassword").addEventListener("change", function () {
  const passwordInput = document.getElementById("loginPassword");
  if (this.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});
