let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let items = [];

function updateItemQuantity(itemId, price, quantity) {
    let item = items.find(i => i.id === itemId);
    if (!item) {
        if (quantity > 0) {
            let newItem = { id: itemId, price: price, quantity: quantity };
            items.push(newItem);
        }
    } else {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            let index = items.indexOf(item);
            items.splice(index, 1);
        }
    }
    updateMainButton();
}

function updateMainButton() {
    let totalPrice = calculateTotalPrice();
    if (totalPrice > 0) {
        tg.MainButton.setText('Сделать заказ');
        if (!tg.MainButton.isVisible) {
            tg.MainButton.show();
        }
    } else {
        tg.MainButton.hide();
    }
}

function calculateTotalPrice() {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    let data = {
        items: items,
        totalPrice: calculateTotalPrice()
    };
    tg.sendData(JSON.stringify(data));
});

document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener("click", function() {
        this.style.display = 'none';
        let quantityControls = this.closest('.product').querySelector('.quantity-controls');
        quantityControls.style.display = 'flex';
        let itemId = this.id;
        let price = parseInt(this.closest('.product').querySelector('.price').innerText.replace(' руб.', ''));
        updateItemQuantity(itemId, price, 1);
        this.closest('.product').querySelector('.quantity-display').innerText = 1;
    });
});

document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener("click", function() {
        let itemId = this.dataset.id;
        let price = parseInt(this.dataset.price);
        let quantityElement = this.closest('.product').querySelector('.quantity-display');
        let quantity = parseInt(quantityElement.innerText) + 1;
        quantityElement.innerText = quantity;
        updateItemQuantity(itemId, price, quantity);
    });
});

document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener("click", function() {
        let itemId = this.dataset.id;
        let price = parseInt(this.dataset.price);
        let quantityElement = this.closest('.product').querySelector('.quantity-display');
        let quantity = parseInt(quantityElement.innerText) - 1;
        if (quantity >= 0) {
            quantityElement.innerText = quantity;
            updateItemQuantity(itemId, price, quantity);
        }
    });
});

document.querySelectorAll('.product img').forEach(img => {
    img.addEventListener("click", function() {
        let product = this.closest('.product');
        let title = product.dataset.title;
        let description = product.dataset.description;
        let price = product.dataset.price;
        let image = product.dataset.image;

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalDescription').innerText = description;
        document.getElementById('modalPrice').innerText = price + ' руб.';
        document.getElementById('modalImage').src = image;

        let modal = document.getElementById('productModal');
        modal.style.display = "block";

        document.getElementById('modalDecrease').dataset.id = product.id;
        document.getElementById('modalIncrease').dataset.id = product.id;
        document.getElementById('modalDecrease').dataset.price = price;
        document.getElementById('modalIncrease').dataset.price = price;
        document.getElementById('modalBuyButton').dataset.id = product.id;
        document.getElementById('modalBuyButton').dataset.price = price;

        document.getElementById('modalQuantityDisplay').innerText = '0';
    });
});

document.querySelector('.close').addEventListener("click", function() {
    let modal = document.getElementById('productModal');
    modal.style.display = "none";
});

document.getElementById('modalIncrease').addEventListener("click", function() {
    let itemId = this.dataset.id;
    let price = parseInt(this.dataset.price);
    let quantityElement = document.getElementById('modalQuantityDisplay');
    let quantity = parseInt(quantityElement.innerText) + 1;
    quantityElement.innerText = quantity;
    updateItemQuantity(itemId, price, quantity);
});

document.getElementById('modalDecrease').addEventListener("click", function() {
    let itemId = this.dataset.id;
    let price = parseInt(this.dataset.price);
    let quantityElement = document.getElementById('modalQuantityDisplay');
    let quantity = parseInt(quantityElement.innerText) - 1;
    if (quantity >= 0) {
        quantityElement.innerText = quantity;
        updateItemQuantity(itemId, price, quantity);
    }
});

document.getElementById('modalBuyButton').addEventListener("click", function() {
    let itemId = this.dataset.id;
    let price = parseInt(this.dataset.price);
    let quantityElement = document.getElementById('modalQuantityDisplay');
    let quantity = parseInt(quantityElement.innerText);
    updateItemQuantity(itemId, price, quantity);

    let modal = document.getElementById('productModal');
    modal.style.display = "none";
});