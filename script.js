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
const allCards = document.querySelectorAll('.product-card');

// 【分类筛选功能】点击Category下拉选项筛选商品
document.querySelectorAll('.cate-filter').forEach(item=>{
    item.onclick = function(){
        let type = this.dataset.type;
        allCards.forEach(card=>{
            if(type === 'all'){
                card.style.display = 'block';
            }else{
                card.style.display = card.dataset.type === type ? 'block':'none'
            }
        })
    }
})

// 添加购物车
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-btn')) {
        const pid = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === pid);
        const idx = cart.findIndex(item => item.id === pid);
        if (idx > -1) {
            cart[idx].quantity += 1;
        } else {
            cart.push({ id: pid, name: product.name, price: product.price, quantity: 1 });
        }
        updateCart();
    }
});

// 更新购物车面板
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="item-controls">
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                    <button onclick="removeItem(${item.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(div);
        });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// 修改商品数量
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeItem(id);
    updateCart();
}

// 删除单品
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// 清空购物车
document.getElementById('clear-cart').addEventListener('click', function() {
    cart = [];
    updateCart();
});

// 结算按钮
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Checkout successful!\nTotal: $${total.toFixed(2)}`);
    cart = [];
    updateCart();
});

// Tab切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// 初始化
updateCart();