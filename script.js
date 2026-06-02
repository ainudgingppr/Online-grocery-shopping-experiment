// All product list including new Avocado & Salmon
const products = [
    { id: 1, name: "Red Fuji Apple", price: 5.99 },
    { id: 2, name: "Whole Milk", price: 12.50 },
    { id: 3, name: "Whole Wheat Bread", price: 8.99 },
    { id: 4, name: "Farm Fresh Eggs", price: 15.00 },
    { id: 5, name: "Natural Mineral Water", price: 2.50 },
    { id: 6, name: "Fresh Beef", price: 18.99 },
    { id: 7, name: "Moisturizing Body Wash", price: 7.99 },
    { id: 8, name: "Raw Chicken Legs", price: 9.99 },
    { id: 9, name: "Dark Chocolate", price: 4.99 },
    { id: 10, name: "Fresh Cucumber", price: 1.99 },
    { id: 11, name: "Vanilla Ice Cream", price: 3.99 },
    { id: 12, name: "Ballpoint Pen", price: 2.49 },
    { id: 13, name: "Long Grain Rice", price: 6.99 },
    { id: 14, name: "Nourishing Shampoo", price: 8.49 },
    { id: 15, name: "Fresh Avocado", price: 3.49 },
    { id: 16, name: "Fresh Salmon Fillet", price: 22.99 }
];

let cart = [];
let logEntries = [];

// Add product to cart
function addToCart(pid) {
    const product = products.find(p => p.id === pid);
    const existingItem = cart.find(item => item.id === pid);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: pid,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    logAction(`Added product: ${product.name}, price: $${product.price.toFixed(2)}`);
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart list
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Start shopping now!</p>';
    } else {
        cartItems.innerHTML = "";
        cart.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.className = "cart-item";
            itemEl.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="delete-btn" onclick="removeItem(${item.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(itemEl);
        });
    }

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Change item quantity
function changeQuantity(pid, delta) {
    const item = cart.find(i => i.id === pid);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeItem(pid);
        return;
    }

    updateCart();
    logAction(`Changed quantity of ${item.name} to ${item.quantity}`);
}

// Remove item from cart
function removeItem(pid) {
    const index = cart.findIndex(i => i.id === pid);
    if (index > -1) {
        const removedItem = cart.splice(index, 1)[0];
        updateCart();
        logAction(`Removed product: ${removedItem.name}`);
    }
}

// Clear entire cart
function clearCart() {
    cart = [];
    updateCart();
    logAction("Cleared all items in shopping cart");
}

// Checkout process
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out!");
        logAction("Checkout failed: Cart is empty");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout Successful!\nTotal Amount: $${total.toFixed(2)}\nThank you for your purchase!`);
    logAction(`Checkout completed, total amount: $${total.toFixed(2)}`);

    // Download log file only at checkout
    downloadLogFile();
    clearCart();
}

// Log actions to console and store
function logAction(action) {
    const now = new Date().toLocaleString();
    const logText = `[${now}] ${action}\n`;
    console.log(logText);
    logEntries.push(logText);
}

// Download log file
function downloadLogFile() {
    const logContent = logEntries.join("");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_log.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize on page load
window.onload = function() {
    updateCart();
    logAction("System started: FreshMart experiment launched");
};