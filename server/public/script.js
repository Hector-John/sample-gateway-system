const products = [
    { id: 1, name: "Build a structure from scratch", price: 100 },
    { id: 2, name: "Build a structure from template", price: 200 },
    { id: 3, name: "Build a custom model", price: 300 },
    { id: 4, name: "Build a prototype", price: 400 },
    { id: 5, name: "Build an advanced structure", price: 500 },
    { id: 6, name: "Build a smart structure", price: 600 },
    { id: 7, name: "Build a modular structure", price: 700 },
    { id: 8, name: "Build a futuristic model", price: 800 },
];

let cart = [];

function updateCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerText = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        cartItemsDiv.appendChild(div);
        total += item.price * item.quantity;
    });

    document.getElementById("total-price").innerText = `$${total.toFixed(2)}`;
}

function addToCart(id, quantity) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Add the gypsum filling directly to the cart
        if (id === "gypsum") {
            cart.push({
                id: "gypsum",
                name: "Gypsum Filling",
                price: 35,  // price per square meter
                quantity: quantity,
            });
        } else {
            cart.push({ ...product, quantity });
        }
    }
    updateCart();
}

function createGypsumProductCard() {
    const gypsumCard = document.createElement("div");
    gypsumCard.classList.add("gypsum-product");
    gypsumCard.innerHTML = `
        <h3>Gypsum Filling</h3>
        <p>Price: $35 per square meter</p>
        <input type="number" id="gypsum-quantity" placeholder="Square meters" min="1" />
        <div class="total" id="gypsum-total">Total: $0.00</div>
        <button id="add-gypsum-to-cart">Add to Cart</button>
    `;

    const gypsumInput = gypsumCard.querySelector("#gypsum-quantity");
    const gypsumTotalDiv = gypsumCard.querySelector("#gypsum-total");
    
    gypsumInput.addEventListener("input", () => {
        const quantity = Number(gypsumInput.value);
        const total = quantity * 35;
        gypsumTotalDiv.innerText = `Total: $${total.toFixed(2)}`;
    });

    gypsumCard.querySelector("#add-gypsum-to-cart").addEventListener("click", () => {
        const quantity = Number(gypsumInput.value);
        if (quantity > 0) {
            addToCart("gypsum", quantity);
            gypsumInput.value = '';
            gypsumTotalDiv.innerText = `Total: $0.00`;
        }
    });

    document.getElementById("products").appendChild(gypsumCard);
}

function createProductCards() {
    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product");
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id}, 1)">Add to Cart</button>
        `;
        document.getElementById("products").appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    createProductCards();
    createGypsumProductCard();
    
    document.getElementById("checkout-button").addEventListener("click", async () => {
        const response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price // Ensure price is included
                }))
            }),
        });

        const session = await response.json();
        if (session.url) {
            window.location = session.url; 
        } else {
            console.error("Failed to create checkout session:", session.error);
        }
    });
});
