document.addEventListener("DOMContentLoaded", () => {

  const sizeButtons = document.querySelectorAll(".size");
  const controls = document.getElementById("cart-controls");

  let selectedSize = null;
  let quantity = 0;

  const productBase = {
    id: "club-box",
    name: document.querySelector("h1").textContent,
    price: Number(document.querySelector(".new-price").textContent.replace(/\D/g, "")),
    image: document.querySelector(".product-img").getAttribute("src")
  };

  // ===== ВЫБОР РАЗМЕРА =====
  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.textContent;
      checkExisting();
    });
  });

  // ===== ПРОВЕРКА: ЕСТЬ ЛИ ТОВАР В КОРЗИНЕ =====
  function checkExisting() {
    if (!selectedSize) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find(
      item => item.id === productBase.id && item.size === selectedSize
    );

    if (found) {
      quantity = found.quantity;
      renderQty();
    } else {
      quantity = 0;
      renderAdd();
    }
  }

  // ===== КНОПКА "ДОБАВИТЬ В КОРЗИНУ" =====
  function renderAdd() {
    controls.innerHTML = `
      <button id="add-to-cart" class="buy">Добавить в корзину</button>
    `;

    document.getElementById("add-to-cart").onclick = () => {
      if (!selectedSize) {
        alert("Выберите размер");
        return;
      }
      quantity = 1;
      save();
      renderQty();
    };
  }

  // ===== КНОПКИ - 1 + и "В КОРЗИНУ" =====
  function renderQty() {
    controls.innerHTML = `
      <div class="qty-wrapper">
        <button class="qty-btn" id="minus">−</button>
        <span class="qty-value">${quantity}</span>
        <button class="qty-btn" id="plus">+</button>
      </div>
      <button class="to-cart">В корзину</button>
    `;

    document.getElementById("plus").onclick = () => {
      quantity++;
      save();
      renderQty();
    };

    document.getElementById("minus").onclick = () => {
      quantity--;
      if (quantity <= 0) {
        remove();
        renderAdd();
      } else {
        save();
        renderQty();
      }
    };

    document.querySelector(".to-cart").onclick = () => {
      window.location.href = "cart.html";
    };
  }

  // ===== СОХРАНЕНИЕ =====
  function save() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(
      item => item.id === productBase.id && item.size === selectedSize
    );

    const unwanted = document.getElementById("unwanted-clubs")?.value || "";

    if (index >= 0) {
      cart[index].quantity = quantity;
      cart[index].unwanted = unwanted;
    } else {
      cart.push({
        ...productBase,
        size: selectedSize,
        quantity,
        unwanted
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ===== УДАЛЕНИЕ =====
  function remove() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(
      item => !(item.id === productBase.id && item.size === selectedSize)
    );
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // стартовое состояние
  renderAdd();

});






