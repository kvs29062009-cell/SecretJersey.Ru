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


