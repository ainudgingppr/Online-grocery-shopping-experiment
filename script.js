const products = [
    { id: 1, name: "Red Fuji Apple", price: 5.99, isEco: true },
    { id: 2, name: "Whole Milk", price: 12.50, isEco: true },
    { id: 3, name: "Whole Wheat Bread", price: 8.99, isEco: true },
    { id: 4, name: "Farm Fresh Eggs", price: 15.00, isEco: true },
    { id: 5, name: "Natural Mineral Water", price: 2.50, isEco: true },
    { id: 6, name: "Fresh Beef", price: 18.99, isEco: true },
    { id: 7, name: "Moisturizing Body Wash", price: 7.99, isEco: false },
    { id: 8, name: "Raw Chicken Legs", price: 9.99, isEco: true },
    { id: 9, name: "Dark Chocolate", price: 4.99, isEco: false },
    { id: 10, name: "Fresh Cucumber", price: 1.99, isEco: true },
    { id: 11, name: "Vanilla Ice Cream", price: 3.99, isEco: false },
    { id: 12, name: "Ballpoint Pen", price: 2.49, isEco: false },
    { id: 13, name: "Long Grain Rice", price: 6.99, isEco: true },
    { id: 14, name: "Nourishing Shampoo", price: 8.49, isEco: false },
    { id: 15, name: "Fresh Avocado", price: 3.49, isEco: true },
    { id: 16, name: "Fresh Salmon Fillet", price: 22.99, isEco: true },
    // 生鲜新增商品
    { id: 17, name: "Green Apple Pack", price: 6.49, isEco: true },
    { id: 18, name: "Organic Banana Bunch", price: 2.99, isEco: true },
    { id: 19, name: "Roma Tomato Box", price: 4.29, isEco: true },
    { id: 20, name: "Fresh Lemon Bag", price: 3.50, isEco: true },
    // 肉类海鲜新增商品
    { id: 21, name: "Frozen Shrimp Pack", price: 14.99, isEco: true },
    { id: 22, name: "Premium Pork Chops", price: 12.49, isEco: true },
    { id: 23, name: "Ground Turkey", price: 10.99, isEco: true },
    { id: 24, name: "Cod Fish Fillets", price: 19.99, isEco: true }
];

let cart = [];
const allCards = document.querySelectorAll('.product-card');

// ====================== 全局统计变量（静默存储，用户不可见） ======================
// 网站总点击次数
let clickCount = parseInt(localStorage.getItem('siteClickCount')) || 0;
// 累计总消费金额
let totalSpent = parseFloat(localStorage.getItem('totalSpentMoney')) || 0;
// 所有成功订单记录（商品清单、环保商品数量、订单金额）
let orderList = JSON.parse(localStorage.getItem('allOrders')) || [];
// 新增：放弃购物车记录（加购后未结算，清空/删除至空）
let abandonCartLogs = JSON.parse(localStorage.getItem('abandonCartLogs')) || [];

// 全局点击监听：统计页面点击，静默累加
document.addEventListener('click', function(){
    clickCount++;
    localStorage.setItem('siteClickCount', clickCount);
});
// =============================================================================

// ========== 静默记录用户浏览时长（用户完全无感知，数据存入本地供admin查看） ==========
const visitStartTime = new Date();
window.addEventListener('beforeunload', function() {
    const endTime = new Date();
    const stayMs = endTime - visitStartTime;
    const staySec = Math.floor(stayMs / 1000);
    const min = Math.floor(staySec / 60);
    const sec = staySec % 60;
    const displayTime = `${min} 分 ${sec} 秒`;

    const log = {
        enter: visitStartTime.toLocaleString(),
        leave: endTime.toLocaleString(),
        totalSecond: staySec,
        showTime: displayTime
    };

    let logs = JSON.parse(localStorage.getItem('freshmartVisitLogs')) || [];
    logs.push(log);
    localStorage.setItem('freshmartVisitLogs', JSON.stringify(logs));
});
// =============================================================================

// 分类筛选
document.querySelectorAll('.cate-filter').forEach(item => {
    item.onclick = function() {
        const type = this.dataset.type;
        allCards.forEach(card => {
            card.style.display = (type === 'all' || card.dataset.type === type) ? 'block' : 'none';
        })
    }
})

// 添加购物车
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-btn')) {
        const pid = parseInt(e.target.dataset.id);
        const item = products.find(p => p.id === pid);
        const existIndex = cart.findIndex(c => c.id === pid);
        if (existIndex > -1) {
            cart[existIndex].quantity += 1;
        } else {
            cart.push({ id: pid, name: item.name, price: item.price, quantity: 1 });
        }
        updateCart();
    }
});

// 更新购物车界面
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    const totalNum = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalNum;

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
        })
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// 修改商品数量
function changeQty(id, delta) {
    const target = cart.find(i => i.id === id);
    if (!target) return;
    target.quantity += delta;
    if (target.quantity <= 0) removeItem(id);
    updateCart();
}

// 删除单个商品（新增判断：删完购物车为空 → 记录放弃购物车）
function removeItem(id) {
    // 删除前先备份当前购物车数据
    const tempCart = [...cart];
    cart = cart.filter(i => i.id !== id);
    // 删除后购物车为空，记录放弃行为
    if(cart.length === 0 && tempCart.length > 0){
        recordAbandonCart(tempCart);
    }
    updateCart();
}

// 新增：记录放弃购物车公共函数
function recordAbandonCart(cartData){
    const abandonTotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const abandonItems = cartData.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
    const abandonLog = {
        abandonTime: new Date().toLocaleString(),
        cartItems: abandonItems,
        cartTotal: abandonTotal
    };
    abandonCartLogs.push(abandonLog);
    localStorage.setItem('abandonCartLogs', JSON.stringify(abandonCartLogs));
}

// 清空购物车（直接记录放弃购物车）
document.getElementById('clear-cart').addEventListener('click', () => {
    if(cart.length > 0){
        recordAbandonCart([...cart]);
    }
    cart = [];
    updateCart();
})

// 结算功能
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const orderAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 统计本次环保商品数量
    let ecoNum = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product && product.isEco) {
            ecoNum += cartItem.quantity;
        }
    });

    // 组装订单明细
    const orderItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    // 保存订单数据到本地（后台读取）
    const currentOrder = {
        time: new Date().toLocaleString(),
        items: orderItems,
        ecoProductCount: ecoNum,
        orderTotal: orderAmount
    };
    orderList.push(currentOrder);
    localStorage.setItem('allOrders', JSON.stringify(orderList));

    // 更新累计消费金额
    totalSpent += orderAmount;
    localStorage.setItem('totalSpentMoney', totalSpent.toFixed(2));

    // 仅展示基础结算提示（用户看不到统计数据）
    alert(`Checkout successful!\nTotal: $${orderAmount.toFixed(2)}`);

    cart = [];
    updateCart();
})

// Tab切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    })
})

// 页面初始化购物车
updateCart();