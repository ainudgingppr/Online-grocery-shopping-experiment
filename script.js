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
    { id: 17, name: "Green Apple Pack", price: 6.49, isEco: true },
    { id: 18, name: "Organic Banana Bunch", price: 2.99, isEco: true },
    { id: 19, name: "Roma Tomato Box", price: 4.29, isEco: true },
    { id: 20, name: "Fresh Lemon Bag", price: 3.50, isEco: true },
    { id: 21, name: "Frozen Shrimp Pack", price: 14.99, isEco: true },
    { id: 22, name: "Premium Pork Chops", price: 12.49, isEco: true },
    { id: 23, name: "Ground Turkey", price: 10.99, isEco: true },
    { id: 24, name: "Cod Fish Fillets", price: 19.99, isEco: true }
];

let cart = [];
const allCards = document.querySelectorAll('.product-card');

// ====================== 改造：手动输入参与者ID，和问卷编号统一 ======================
function getParticipantID() {
    let pid = localStorage.getItem("participantID");
    // 本地没有存储ID → 强制弹窗手动输入
    while (!pid || pid.trim() === "") {
        pid = prompt("Please enter your Participant ID (same as questionnaire):");
        // 用户点取消则刷新页面重新输入
        if (pid === null) {
            location.reload();
        }
    }
    localStorage.setItem("participantID", pid.trim());
    return pid.trim();
}
const currentPID = getParticipantID();
// =============================================================================

// ====================== 全局统计变量（静默存储，用户不可见） ======================
let clickCount = parseInt(localStorage.getItem('siteClickCount')) || 0;
let totalSpent = parseFloat(localStorage.getItem('totalSpentMoney')) || 0;
let orderList = JSON.parse(localStorage.getItem('allOrders')) || [];
let abandonCartLogs = JSON.parse(localStorage.getItem('abandonCartLogs')) || [];

// 全局点击监听：统计页面点击，绑定参与者ID
document.addEventListener('click', function(){
    clickCount++;
    localStorage.setItem('siteClickCount', clickCount);
});
// =============================================================================

// ========== 静默记录用户浏览时长（绑定手动输入的参与者ID） ==========
const visitStartTime = new Date();
window.addEventListener('beforeunload', function() {
    const endTime = new Date();
    const stayMs = endTime - visitStartTime;
    const staySec = Math.floor(stayMs / 1000);
    const min = Math.floor(staySec / 60);
    const sec = staySec % 60;
    const displayTime = `${min} 分 ${sec} 秒`;

    const log = {
        participantID: currentPID,
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

// 删除单个商品（删空则记录弃购，绑定手动ID）
function removeItem(id) {
    const tempCart = [...cart];
    cart = cart.filter(i => i.id !== id);
    if(cart.length === 0 && tempCart.length > 0){
        recordAbandonCart(tempCart);
    }
    updateCart();
}

// 记录放弃购物车（携带手动输入的Participant ID）
function recordAbandonCart(cartData){
    const abandonTotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const abandonItems = cartData.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
    const abandonLog = {
        participantID: currentPID,
        abandonTime: new Date().toLocaleString(),
        cartItems: abandonItems,
        cartTotal: abandonTotal
    };
    abandonCartLogs.push(abandonLog);
    localStorage.setItem('abandonCartLogs', JSON.stringify(abandonCartLogs));
}

// 清空购物车
document.getElementById('clear-cart').addEventListener('click', () => {
    if(cart.length > 0){
        recordAbandonCart([...cart]);
    }
    cart = [];
    updateCart();
})

// 结算订单（每条订单绑定手动填写的ID）
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const orderAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let ecoNum = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product && product.isEco) {
            ecoNum += cartItem.quantity;
        }
    });

    const orderItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    const currentOrder = {
        participantID: currentPID,
        time: new Date().toLocaleString(),
        items: orderItems,
        ecoProductCount: ecoNum,
        orderTotal: orderAmount
    };
    orderList.push(currentOrder);
    localStorage.setItem('allOrders', JSON.stringify(orderList));

    totalSpent += orderAmount;
    localStorage.setItem('totalSpentMoney', totalSpent.toFixed(2));

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