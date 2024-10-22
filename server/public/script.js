const products = [
  {
    id: 1,
    name: "Build a structure from scratch",
    price: 100,
    class: "product-1",
  },
  {
    id: 2,
    name: "Build a structure from template",
    price: 200,
    class: "product-2",
  },
  { id: 3, name: "Build a custom model", price: 300, class: "product-3" },
  { id: 4, name: "Build a prototype", price: 400, class: "product-4" },
  {
    id: 5,
    name: "Build an advanced structure",
    price: 500,
    class: "product-5",
  },
  { id: 6, name: "Build a smart structure", price: 600, class: "product-6" },
  { id: 7, name: "Build a modular structure", price: 700, class: "product-7" },
  { id: 8, name: "Build a futuristic model", price: 800, class: "product-8" },
];

const cart = new Map();

function renderProducts() {
  const productContainer = document.getElementById("products");
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = `product ${product.class}`;
    productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <div id="remove-${product.id}" style="display: none;">
                <button onclick="removeFromCart(${product.id})">Remove from Cart</button>
            </div>
        `;
    productContainer.appendChild(productDiv);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (cart.has(id)) {
    cart.get(id).quantity += 1;
  } else {
    cart.set(id, { ...product, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  if (cart.has(id)) {
    const item = cart.get(id);
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.delete(id);
    }
  }
  renderCart();
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
            ${item.name} x ${item.quantity} = $${item.price * item.quantity}
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
    cartItemsContainer.appendChild(cartItemDiv);
  });

  document.getElementById("total-price").innerText = `$${total.toFixed(2)}`;

  products.forEach((product) => {
    const removeButton = document.getElementById(`remove-${product.id}`);
    if (cart.has(product.id)) {
      removeButton.style.display = "none";
    } else {
      removeButton.style.display = "none";
    }
  });
}

document.getElementById("checkout-button").addEventListener("click", () => {
  const itemsArray = Array.from(cart.values()).map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: itemsArray }),
  })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`HTTP status ${response.status}: ${response.statusText}`)
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data.url) {
        window.location = data.url;
      } else {
        console.error("Checkout session creation failed.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

renderProducts();
