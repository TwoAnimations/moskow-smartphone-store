const productsData = [
  { id: 1, name: "iPhone 16", brand: "Apple", price: 124990, description: "128 GB, eSIM, midnight" },
  { id: 2, name: "iPhone 16 Pro", brand: "Apple", price: 159990, description: "256 GB, titanium black" },
  { id: 3, name: "Galaxy S25", brand: "Samsung", price: 99990, description: "256 GB, graphite" },
  { id: 4, name: "Galaxy Z Flip6", brand: "Samsung", price: 119990, description: "512 GB, lavender" },
  { id: 5, name: "Xiaomi 15", brand: "Xiaomi", price: 69990, description: "256 GB, silver" },
  { id: 6, name: "Redmi Note 15 Pro", brand: "Xiaomi", price: 42990, description: "256 GB, blue" },
  { id: 7, name: "Pixel 10", brand: "Google", price: 94990, description: "128 GB, obsidian" },
  { id: 8, name: "Pixel 10 Pro", brand: "Google", price: 119990, description: "256 GB, porcelain" }
];

const STORAGE_KEY = "demo-smartphone-cart";

function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function cartItemCount(cart) {
  return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
}

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function updateHeaderCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (!cartCountEl) return;
  const cart = getCart();
  cartCountEl.textContent = String(cartItemCount(cart));
}

function setupCatalogPage() {
  const productsEl = document.getElementById("products");
  const brandFilterEl = document.getElementById("brandFilter");
  const priceFilterEl = document.getElementById("priceFilter");
  const priceValueEl = document.getElementById("priceValue");
  if (!productsEl || !brandFilterEl || !priceFilterEl || !priceValueEl) return;

  function renderProducts(items) {
    productsEl.innerHTML = "";

    if (!items.length) {
      productsEl.innerHTML = "<p>Ничего не найдено по выбранным фильтрам.</p>";
      return;
    }

    for (const item of items) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.brand}</p>
        <p>${item.description}</p>
        <div class="price">${formatPrice(item.price)}</div>
        <button class="buy-btn" data-id="${item.id}">Добавить в корзину</button>
      `;
      productsEl.appendChild(card);
    }
  }

  function applyFilters() {
    const brand = brandFilterEl.value;
    const maxPrice = Number(priceFilterEl.value);

    priceValueEl.textContent = formatPrice(maxPrice);

    const filtered = productsData.filter((item) => {
      const byBrand = brand === "all" || item.brand === brand;
      const byPrice = item.price <= maxPrice;
      return byBrand && byPrice;
    });

    renderProducts(filtered);
  }

  productsEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("buy-btn")) return;

    const productId = Number(target.dataset.id);
    const cart = getCart();
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart(cart);
    updateHeaderCount();
  });

  brandFilterEl.addEventListener("change", applyFilters);
  priceFilterEl.addEventListener("input", applyFilters);
  applyFilters();
}

function setupCartPage() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartItemsCountEl = document.getElementById("cartItemsCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const orderBtnEl = document.getElementById("orderBtn");
  if (!cartItemsEl || !cartItemsCountEl || !cartTotalEl || !orderBtnEl) return;

  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    const entries = Object.entries(cart);
    if (entries.length === 0) {
      cartItemsEl.innerHTML = "<p>Корзина пока пуста.</p>";
    }

    for (const [id, qty] of entries) {
      const productId = Number(id);
      const item = productsData.find((p) => p.id === productId);
      if (!item) continue;

      totalItems += qty;
      totalPrice += item.price * qty;

      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <p><strong>${item.name}</strong><br>${formatPrice(item.price)} × ${qty}</p>
        <button class="qty-btn" data-action="plus" data-id="${productId}">+1</button>
        <button class="qty-btn" data-action="minus" data-id="${productId}">-1</button>
        <button class="remove-btn" data-action="remove" data-id="${productId}">Удалить</button>
      `;
      cartItemsEl.appendChild(row);
    }

    cartItemsCountEl.textContent = String(totalItems);
    cartTotalEl.textContent = formatPrice(totalPrice);
    updateHeaderCount();
  }

  cartItemsEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const productId = Number(target.dataset.id);
    if (!action || !productId) return;

    const cart = getCart();
    const currentQty = cart[productId] || 0;

    if (action === "plus") cart[productId] = currentQty + 1;
    if (action === "minus") {
      if (currentQty <= 1) {
        delete cart[productId];
      } else {
        cart[productId] = currentQty - 1;
      }
    }
    if (action === "remove") delete cart[productId];

    saveCart(cart);
    renderCart();
  });

  orderBtnEl.addEventListener("click", () => {
    const cart = getCart();
    if (Object.keys(cart).length === 0) {
      alert("Сначала добавьте товар в корзину.");
      return;
    }

    alert("уже под вашей подушкой");
    saveCart({});
    renderCart();
  });

  renderCart();
}

function setupCommonActions() {
  updateHeaderCount();
  const cartBtnEl = document.getElementById("cartBtn");
  if (cartBtnEl) {
    cartBtnEl.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
}

setupCommonActions();
setupCatalogPage();
setupCartPage();
