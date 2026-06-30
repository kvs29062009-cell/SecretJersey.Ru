document.addEventListener("DOMContentLoaded", () => {

  const cartItemsContainer = document.getElementById("cart-items");
  const productsPriceEl = document.getElementById("products-price");
  const deliveryPriceEl = document.getElementById("delivery-price");
  const totalPriceEl = document.getElementById("total-price");

  const DELIVERY_PRICE = 600;
  const PROMO_CODE = "UV28U30";
  const PROMO_DISCOUNT = 0.20;

  let promoApplied = localStorage.getItem("promo") === PROMO_CODE;

  // ---- БАННЕР ПОДАРКА ----
  const giftBanner = document.getElementById("gift-banner");
  const giftStatus = document.getElementById("gift-status");
  const giftSizeBtns = document.querySelectorAll(".gift-size-btn");

  let selectedGiftSize = localStorage.getItem("giftSize") || null;

  function updateGiftBanner(cart) {
    if (!giftBanner) return;
    const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const isEligible = itemCount >= 2;

    // Обновляем текст статуса
    if (giftStatus) {
      if (isEligible) {
        giftStatus.textContent = "🎉 Подарок активирован! Выберите размер ниже.";
        giftStatus.className = "gift-status active";
      } else {
        if (itemCount === 1) {
          giftStatus.textContent = "Добавьте ещё 1 товар для бесплатных Nike Mind 001";
        } else {
          const needed = 2 - itemCount;
          giftStatus.textContent = `Добавьте ещё ${needed} товара(ов) для подарка`;
        }
        giftStatus.className = "gift-status";
      }
    }

    // Управление кнопками выбора размера
    giftSizeBtns.forEach(btn => {
      if (isEligible) {
        btn.disabled = false;
        btn.classList.remove("disabled");
        // Подсвечиваем сохранённый размер (если есть)
        btn.classList.toggle("active", btn.dataset.size === selectedGiftSize);
      } else {
        btn.disabled = true;
        btn.classList.add("disabled");
        btn.classList.remove("active");
      }
    });
  }

  // Обработчики выбора размера (только если кнопка активна)
  giftSizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return; // дополнительная защита
      const size = btn.dataset.size;
      selectedGiftSize = size;
      localStorage.setItem("giftSize", size);
      giftSizeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

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
      if (giftBanner) giftBanner.style.display = "none";
      return;
    } else {
      if (giftBanner) giftBanner.style.display = "block";
    }

    cart.forEach((item, index) => {
      const qty = item.quantity ? item.quantity : 1;
      productsTotal += item.price * qty;

      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>Размер: ${item.size}</p>
          <p>Количество: ${qty}</p>
          <p>Цена: ${item.price} ₽</p>
          ${item.unwanted ? `<p class="unwanted">Нежелательные клубы: ${item.unwanted}</p>` : ""}
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

    // Обновляем баннер после рендера
    updateGiftBanner(cart);
  }

  // ===== УДАЛЕНИЕ =====
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
        localStorage.setItem("promo", PROMO_CODE);
        promoMessage.textContent = "Промокод применён 🎉 Скидка 20%";
        promoMessage.style.color = "green";
        renderCart();
      } else {
        promoMessage.textContent = "Неверный промокод";
        promoMessage.style.color = "red";
      }
    });
  }

  renderCart();

  // ===== ПЕРЕХОД К ОПЛАТЕ =====
  const goPaymentBtn = document.getElementById("go-payment");

  if (goPaymentBtn) {
    goPaymentBtn.addEventListener("click", () => {

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();

      if (!name || !phone || !address) {
        alert("Заполните все данные доставки");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      if (itemCount >= 2 && !selectedGiftSize) {
        alert("Выберите размер кроссовок для подарка!");
        return;
      }

      localStorage.setItem("customer", JSON.stringify({
        name,
        phone,
        address,
        giftSize: selectedGiftSize || null
      }));

      window.location.href = "payment.html";
    });
  }

});
