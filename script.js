// 商品数据
const products = [
    { id: 1, name: "红富士苹果", price: 5.99 },
    { id: 2, name: "全脂纯牛奶", price: 12.50 },
    { id: 3, name: "全麦吐司面包", price: 8.99 },
    { id: 4, name: "农家土鸡蛋", price: 15.00 },
    { id: 5, name: "天然矿泉水", price: 2.50 }
];

let cart = [];
let logEntries = []; // 用来保存所有日志记录，结算时再下载

// 添加商品到购物车
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

// 更新购物车界面
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    // 更新购物车数量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // 更新购物车列表
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">您的购物车还是空的，快去挑选商品吧~</p>';
    } else {
        cartItems.innerHTML = "";
        cart.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.className = "cart-item";
            itemEl.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">¥${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="delete-btn" onclick="removeItem(${item.id})">删除</button>
                </div>
            `;
            cartItems.appendChild(itemEl);
        });
    }

    // 更新总价
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `¥${subtotal.toFixed(2)}`;
    totalEl.textContent = `¥${subtotal.toFixed(2)}`;
}

// 修改商品数量
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

// 删除商品
function removeItem(pid) {
    const index = cart.findIndex(i => i.id === pid);
    if (index > -1) {
        const removedItem = cart.splice(index, 1)[0];
        updateCart();
        logAction(`Removed product: ${removedItem.name}`);
    }
}

// 清空购物车
function clearCart() {
    cart = [];
    updateCart();
    logAction("Cleared all items in shopping cart");
}

// 结算（仅结算时下载日志）
function checkout() {
    if (cart.length === 0) {
        alert("您的购物车是空的，无法结算！");
        logAction("Checkout failed: Cart is empty");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`结算成功！\n应付金额：¥${total.toFixed(2)}\n感谢您的购买！`);
    logAction(`Checkout completed, total amount: $${total.toFixed(2)}`);

    // 结算时才下载完整日志文件
    downloadLogFile();
    clearCart();
}

// 记录日志（只保存到数组，不自动下载）
function logAction(action) {
    const now = new Date().toLocaleString();
    const logText = `[${now}] ${action}\n`;
    console.log(logText);
    logEntries.push(logText); // 保存日志到数组
}

// 下载完整日志文件（仅在结算时调用）
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

// 页面加载时初始化
window.onload = function() {
    updateCart();
    logAction("System started: FreshMart experiment launched");
};