// 商品数据（和你的Python代码完全一致）
const products = [
    { id: 1, name: "苹果", price: 5.99 },
    { id: 2, name: "牛奶", price: 12.50 },
    { id: 3, name: "面包", price: 8.99 },
    { id: 4, name: "鸡蛋", price: 15.00 },
    { id: 5, name: "矿泉水", price: 2.50 }
];

// 购物车对象
let cart = {};

// 加入购物车
function add(pid) {
    cart[pid] = (cart[pid] || 0) + 1;
    updateCart();
    log("添加商品 ID:" + pid);
}

// 删除商品
function remove(pid) {
    delete cart[pid];
    updateCart();
    log("删除商品 ID:" + pid);
}

// 清空购物车
function clearCart() {
    cart = {};
    updateCart();
    log("清空购物车");
}

// 结算
function checkout() {
    if (Object.keys(cart).length === 0) {
        alert("购物车为空");
        return;
    }
    alert("实验结算完成！");
    log("执行结算");
    cart = {};
    updateCart();
}

// 更新购物车界面
function updateCart() {
    let list = document.getElementById("cart-list");
    list.innerHTML = "";
    let total = 0;

    for (let pid in cart) {
        let p = products.find(x => x.id == pid);
        let count = cart[pid];
        let subtotal = p.price * count;
        total += subtotal;

        let item = document.createElement("div");
        item.className = "cart-row";
        item.innerHTML = `
            <span>${p.name} x${count} = ￥${subtotal.toFixed(2)}</span>
            <button class="delete" onclick="remove(${pid})">删除</button>
        `;
        list.appendChild(item);
    }

    document.getElementById("total").innerText = total.toFixed(2);
}

// 写入日志（和原Python代码逻辑一致）
function log(msg) {
    let time = new Date().toLocaleString();
    console.log("[" + time + "] " + msg);
}