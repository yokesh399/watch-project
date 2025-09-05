// Firebase Config
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
const db = firebase.database();

// Fetch and display all orders
function loadOrders() {
  db.ref("orders").once("value", snapshot => {
    const orders = snapshot.val();
    const container = document.getElementById("orders-table");
    container.innerHTML = "";

    if (!orders) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    let html = "<table><tr><th>Name</th><th>Phone</th><th>Payment</th><th>Total</th><th>Location</th><th>Items</th><th>Actions</th></tr>";

    Object.entries(orders).forEach(([orderId, order]) => {
      let itemsHtml = "";
      if (order.items) {
        Object.entries(order.items).forEach(([itemId, item]) => {
          itemsHtml += `
            <div>
              <strong>${item.name || "N/A"}</strong> (${item.id || "No ID"}) - ${item.price || "N/A"}<br>
              <button onclick="removeItem('${orderId}', '${itemId}')">Remove Item</button>
            </div>`;
        });
      }

      html += `
        <tr>
          <td>${order.customer || "N/A"}</td>
          <td>${order.phone || "N/A"}</td>
          <td>${order.payment || "N/A"}</td>
          <td>${order.total || "N/A"}</td>
          <td>${order.location ? `<a href="${order.location}" target="_blank">${order.location}</a>` : "N/A"}</td>
          <td>${itemsHtml}</td>
          <td><button onclick="cancelOrder('${orderId}')">Delete Order</button></td>
        </tr>`;
    });

    html += "</table>";
    container.innerHTML = html;
  });
}

// Remove individual item
function removeItem(orderId, itemId) {
  if (confirm("Delete this item?")) {
    const orderRef = db.ref(`orders/${orderId}`);

    orderRef.child(`items/${itemId}`).remove()
      .then(() => orderRef.child("items").once("value"))
      .then(snapshot => {
        const items = snapshot.val();
        let newTotal = 0;

        if (items) {
          Object.values(items).forEach(item => {
            const priceNum = parseInt(item.price.replace(/[₹,]/g, ""));
            if (!isNaN(priceNum)) {
              newTotal += priceNum;
            }
          });
        }

        return orderRef.update({ total: `₹${newTotal}` });
      })
      .then(() => {
        alert("Item removed and total updated.");
        loadOrders();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to remove item or update total.");
      });
  }
}

// Delete entire order
function cancelOrder(orderId) {
  if (confirm("Delete the entire order?")) {
    db.ref(`orders/${orderId}`).remove()
      .then(() => {
        alert("Order deleted.");
        loadOrders();
      })
      .catch(() => alert("Failed to delete order."));
  }
}

// Load on start
window.onload = loadOrders;
