document.addEventListener("DOMContentLoaded", () => {

  // ===== ПРОДУКТ =====
  const product = {
    id: "club-box",
    name: document.querySelector("h1").textContent,
    price: Number(document.querySelector(".price").textContent.replace(/\D/g, "")),
    image: document.querySelector(".product-img").getAttribute("src"),
    size: null,
    unwanted: ""
  };

  const qtyContainer = document.getElementById("quantity-control");
  const addBtn = document.getElementById("add-to-cart");

  // ===== ВЫБОР РАЗМЕРА =====
  document.querySelectorAll(".size").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      product.size = btn.textContent;
    });
  });

  // ===== ДОБАВИТЬ В КОРЗИНУ =====
  addBtn.addEventListener("click", () => {
    if (!product.size) {
      alert("Выберите размер");
      return;
    }

    product.unwanted = document.getElementById("unwanted-clubs")?.value || "";

    saveToCart(1);
    renderQty(1);
  });

  // ===== РЕНДЕР КОЛИЧЕСТВА =====
  function renderQty(qty) {
    qtyContainer.innerHTML = `
      <div class="qty-box">
        <button class="qty-btn" id="minus">−</button>
        <span class="qty-value">${qty}</span>
        <button class="qty-btn" id="plus">+</button>
      </div>
    `;

    document.getElementById("plus").onclick = () => updateQty(qty + 1);
    document.getElementById("minus").onclick = () => updateQty(qty - 1);
  }

  // ===== ОБНОВЛЕНИЕ КОЛИЧЕСТВА =====
  function updateQty(newQty) {
    if (newQty <= 0) {
      removeFromCart();
      qtyContainer.innerHTML = `
        <button class="add-to-cart" id="add-to-cart">
          Добавить в корзину
        </button>
      `;
      document.getElementById("add-to-cart").onclick = () => addBtn.click();
      return;
    }

    saveToCart(newQty);
    renderQty(newQty);
  }

  // ===== СОХРАНЕНИЕ В КОРЗИНУ =====
  function saveToCart(qty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(item =>
      item.id === product.id && item.size === product.size
    );

    if (index >= 0) {
      cart[index].quantity = qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ===== УДАЛЕНИЕ ИЗ КОРЗИНЫ =====
  function removeFromCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== product.id);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

});
