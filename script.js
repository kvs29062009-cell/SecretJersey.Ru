document.addEventListener("DOMContentLoaded", () => {

  const sizeButtons = document.querySelectorAll(".size");
  const addBtn = document.getElementById("add-to-cart");

  let selectedSize = null;

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.textContent;
    });
  });

  addBtn.addEventListener("click", () => {
    if (!selectedSize) {
      alert("Выберите размер");
      return;
    }

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
    
    const product = {
      name: document.querySelector("h1").textContent,
      price: Number(document.querySelector(".price").textContent.replace(/\D/g, "")),
      image: document.querySelector(".product-img").getAttribute("src"),
      size: selectedSize,
      quantity: 1,
      unwanted: document.getElementById("unwanted-clubs")?.value || ""
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Товар добавлен в корзину");
  });

});



