// ===== Product Data (images from Wikimedia Commons) =====
const products = [
  {
    id: 1,
    name: "Running Sneakers",
    price: 59.99,
    stock: 8,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/High_Beam_Led_Running_Shoes_01.jpg/400px-High_Beam_Led_Running_Shoes_01.jpg"
  },
  {
    id: 2,
    name: "Leather Backpack",
    price: 44.50,
    stock: 5,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Leather_backpack.jpg/400px-Leather_backpack.jpg"
  },
  {
    id: 3,
    name: "Wrist Watch",
    price: 89.00,
    stock: 0,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Watch_dial.jpg/400px-Watch_dial.jpg"
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 34.99,
    stock: 12,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Headphones_%2825054212170%29.jpg/400px-Headphones_%2825054212170%29.jpg"
  },
  {
    id: 5,
    name: "Coffee Mug",
    price: 9.99,
    stock: 20,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Coffee_mug.jpg/400px-Coffee_mug.jpg"
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 19.99,
    stock: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sunglasses_%283%29.jpg/400px-Sunglasses_%283%29.jpg"
  }
];

let cart = [];
let orders = [];
let orderIdCounter = 1;

// ===== Theme Toggle =====
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
});

// Default to light mode on load
applyTheme("light");

// ===== Page Navigation =====
const shopBtn = document.getElementById("shop-btn");
const cartBtn = document.getElementById("cart-btn");
const ordersBtn = document.getElementById("orders-btn");

const shopPage = document.getElementById("shop-page");
const cartPage = document.getElementById("cart-page");
const ordersPage = document.getElementById("orders-page");

function showPage(page) {
  [shopPage, cartPage, ordersPage].forEach(p => p.classList.remove("active"));
  [shopBtn, cartBtn, ordersBtn].forEach(b => b.classList.remove("active"));

  if (page === "shop") {
    shopPage.classList.add("active");
    shopBtn.classList.add("active");
  } else if (page === "cart") {
    cartPage.classList.add("active");
    cartBtn.classList.add("active");
    renderCart();
  } else if (page === "orders") {
    ordersPage.classList.add("active");
    ordersBtn.classList.add("active");
    renderOrders();
  }
}

shopBtn.addEventListener("click", () => showPage("shop"));
cartBtn.addEventListener("click", () => showPage("cart"));
ordersBtn.addEventListener("click", () => showPage("orders"));

// ===== Render Products =====
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    // if-else logic: check stock before allowing purchase
    let stockText = "";
    let buttonDisabled = "";

    if (product.stock === 0) {
      stockText = "Out of stock";
      buttonDisabled = "disabled";
    } else if (product.stock <= 3) {
      stockText = `Only ${product.stock} left`;
    } else {
      stockText = `${product.stock} in stock`;
    }

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p class="product-stock">${stockText}</p>
        <button class="add-btn" ${buttonDisabled} onclick="addToCart(${product.id})">
          ${product.stock === 0 ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== Cart Logic =====
function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  // if-else: check if product is in stock before adding
  if (!product || product.stock === 0) {
    alert("This item is out of stock.");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.qty < product.stock) {
      existingItem.qty++;
    } else {
      alert("No more stock available for this item.");
      return;
    }
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  }

  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = totalItems;
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartItemsDiv.innerHTML = "";

  // if-else: empty cart vs has items
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p class="empty-msg">Your cart is empty. Go add something from the shop.</p>`;
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} each</p>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItemsDiv.appendChild(row);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalSpan.textContent = `$${total.toFixed(2)}`;
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  const product = products.find(p => p.id === productId);

  if (!item) return;

  // if-else: enforce stock limit and minimum quantity
  if (delta > 0 && item.qty >= product.stock) {
    alert("No more stock available.");
    return;
  } else if (delta < 0 && item.qty <= 1) {
    removeFromCart(productId);
    return;
  } else {
    item.qty += delta;
  }

  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCart();
}

// ===== Checkout / Buying Logic =====
document.getElementById("checkout-btn").addEventListener("click", () => {
  // if-else: prevent checkout on empty cart
  if (cart.length === 0) {
    alert("Add items to your cart before checking out.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const newOrder = {
    id: orderIdCounter++,
    items: [...cart],
    total: total,
    status: "delivered",
    date: new Date().toLocaleDateString()
  };

  orders.push(newOrder);

  // reduce stock after purchase
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      product.stock -= item.qty;
    }
  });

  cart = [];
  updateCartCount();
  renderProducts();
  alert("Order placed successfully!");
  showPage("orders");
});

// ===== Orders / Return Logic =====
function renderOrders() {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = "";

  // if-else: no orders yet vs has orders
  if (orders.length === 0) {
    ordersList.innerHTML = `<p class="empty-msg">No orders yet. Your purchases will show up here.</p>`;
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    let statusClass = "";
    let statusText = "";
    let returnButton = "";

    if (order.status === "delivered") {
      statusClass = "status-delivered";
      statusText = "Delivered";
      returnButton = `<button class="return-btn" onclick="returnOrder(${order.id})">Return Order</button>`;
    } else if (order.status === "returned") {
      statusClass = "status-returned";
      statusText = "Returned";
      returnButton = "";
    }

    const itemsList = order.items.map(i => `${i.name} x${i.qty}`).join(", ");

    card.innerHTML = `
      <div class="order-top">
        <strong>Order #${order.id}</strong>
        <span class="order-status ${statusClass}">${statusText}</span>
      </div>
      <p>${itemsList}</p>
      <p>Total: $${order.total.toFixed(2)} &middot; ${order.date}</p>
      ${returnButton}
    `;
    ordersList.appendChild(card);
  });
}

function returnOrder(orderId) {
  const order = orders.find(o => o.id === orderId);

  // if-else: only allow return if order is still in delivered state
  if (!order) {
    return;
  } else if (order.status === "returned") {
    alert("This order has already been returned.");
    return;
  } else {
    order.status = "returned";

    // restock items back into product list
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        product.stock += item.qty;
      }
    });

    renderOrders();
    renderProducts();
    alert(`Order #${order.id} has been returned.`);
  }
}

// ===== Initial Render =====
renderProducts();
