document.addEventListener("DOMContentLoaded", () => {

  const cartItemsContainer = document.getElementById("cart-items");
  const productsPriceEl = document.getElementById("products-price");
  const deliveryPriceEl = document.getElementById("delivery-price");
  const totalPriceEl = document.getElementById("total-price");

  const DELIVERY_PRICE = 450;
  const PROMO_CODE = "SECRET10";
  const PROMO_DISCOUNT = 0.10; // 10%

  let promoApplied = localStorage.getItem("promo") === PROMO_CODE;

  // ===== РЕНДЕР КОРЗИНЫ =====
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";

    let productsTotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Корзина пуста</p>";
      productsPriceEl.textContent = "0";
      deliveryPriceEl.textContent = DELIVERY_PRICE;
      totalPriceEl.textContent = DELIVERY_PRICE;
      return;
    }

    cart.forEach((item, index) => {
      productsTotal += item.price * item.quantity;

      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>Размер: ${item.size}</p>
          <p>Количество: ${item.quantity}</p>
          <p>Цена: ${item.price} ₽</p>
          ${item.unwanted ? `<p class="unwanted">Нежелательные клубы/пожелания: ${item.unwanted}</p>` : ""}
          <button class="remove-btn" data-index="${index}">Удалить</button>
        </div>
      `;

      cartItemsContainer.appendChild(div);
    });

    let discount = promoApplied ? productsTotal * PROMO_DISCOUNT : 0;

    productsPriceEl.textContent = productsTotal;
    deliveryPriceEl.textContent = DELIVERY_PRICE;
    totalPriceEl.textContent = productsTotal - discount + DELIVERY_PRICE;

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        removeItem(btn.dataset.index);
      });
    });
  }

  // ===== УДАЛЕНИЕ ТОВАРА =====
  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // ===== ПРОМОКОД =====
  const promoInput = document.getElementById("promo");
  const promoBtn = document.getElementById("apply-promo");
  const promoMessage = document.getElementById("promo-message");

  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      if (promoInput.value.trim().toUpperCase() === PROMO_CODE) {
        promoApplied = true;
        localStorage.se




