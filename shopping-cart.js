// Shopping Cart Component - Tests multiple state, list rendering, and calculations
const availableProducts = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
    { id: 4, name: 'Monitor', price: 299 },
    { id: 5, name: 'Headphones', price: 150 },
];

const [cart, cartId, setCart] = useState([]);
const [totalPrice, totalPriceId, setTotalPrice] = useState(0);
const [itemCount, itemCountId, setItemCount] = useState(0);

// Helper to calculate totals
const updateTotals = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalPrice(total);
    setItemCount(count);
};

// Render the cart list
renderList(cart, () => {
    const cartHTML = cart().length === 0 
        ? '<p style="color: #666;">Your cart is empty</p>'
        : cart().map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price}</span>
                </div>
                <div class="item-controls">
                    <button class="qty-btn minus-btn" data-id="${item.id}">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
                <span class="item-total">Subtotal: $${item.price * item.quantity}</span>
            </div>
        `).join('');
    
    document.getElementById('cart-items').innerHTML = cartHTML;
    
    // Re-attach event listeners
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.onclick = (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const newCart = cart().map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(newCart);
            updateTotals(newCart);
        };
    });
    
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.onclick = (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const newCart = cart().map(item =>
                item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            ).filter(item => item.quantity > 0);
            setCart(newCart);
            updateTotals(newCart);
        };
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const newCart = cart().filter(item => item.id !== itemId);
            setCart(newCart);
            updateTotals(newCart);
        };
    });
});

// Add product to cart
document.getElementById('product-select').onchange = (e) => {
    const productId = parseInt(e.target.value);
    if (productId === 0) return;
    
    const product = availableProducts.find(p => p.id === productId);
    const existingItem = cart().find(item => item.id === productId);
    
    let newCart;
    if (existingItem) {
        newCart = cart().map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
    } else {
        newCart = [...cart(), { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    updateTotals(newCart);
    e.target.value = 0;
};

// Clear cart
document.getElementById('clear-cart').onclick = () => {
    setCart([]);
    setTotalPrice(0);
    setItemCount(0);
};

// Initialize displays with reactive IDs
document.getElementById('total-price').innerHTML = `<span data-reactive-id="${totalPriceId}">${totalPrice()}</span>`;
document.getElementById('item-count').innerHTML = `<span data-reactive-id="${itemCountId}">${itemCount()}</span>`;
