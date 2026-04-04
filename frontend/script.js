// Global Cart Array
let cart = JSON.parse(localStorage.getItem('vegCart')) || [];
let allVegetables = [];

// Auto-detect API base URL: works with both Live Server and Express backend
// Auto-detect API base URL: works with both local dev and production on Render
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '5000' ? '' : 'http://localhost:5000')
    : (window.location.protocol === 'file:' ? 'http://localhost:5000' : '');

// Store Location Coordinates (Ramesh vegetable market)
const STORE_COORDS = { lat: 17.0302101, lng: 80.8053063 };
let currentDeliveryDistance = 0;
let deliveryCharges = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    checkAuthState();
    updateCartCount();

    // Page specific logic
    if (document.getElementById('product-grid')) {
        fetchVegetables();
        setupFilters();
        setupSearch();
    }

    if (document.getElementById('cartItemsContainer')) {
        renderCart();
    }

    if (document.getElementById('checkoutForm')) {
        renderCheckout();
        initializeAddressMap();
    }

    // Scroll Reveal Animation Global Observer
    window.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Initial Observation for static elements
    document.querySelectorAll('.reveal').forEach(el => window.observer.observe(el));
});



// ---------- THEME LOGIC ----------
function initTheme() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && toggleSwitch) {
            toggleSwitch.checked = true;
        }
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function (e) {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// ---------- AUTH LOGIC ----------
function checkAuthState() {
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    const loginBtn = document.getElementById('loginBtnNav');
    const myOrdersLink = document.getElementById('myOrdersLinkNav');

    // Default style
    if (loginBtn) {
        loginBtn.classList.add('btn-login');
    }

    if (userAuth && userAuth.loggedIn && loginBtn) {
        loginBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout (${userAuth.name})`;
        loginBtn.classList.remove('btn-login');
        loginBtn.classList.add('btn-logout');
        loginBtn.href = "#";
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('userAuth');
                window.location.href = 'index.html';
            }
        };


        if (myOrdersLink) {
            myOrdersLink.style.display = 'inline-block';
        }
    }

    // Admin Visibility Logic
    const adminBtn = document.getElementById('adminBtnNav');
    if (adminBtn) {
        // Strict admin email check
        const isAdmin = userAuth && userAuth.loggedIn && userAuth.email === 'tejaswaroop367@gmail.com';
        adminBtn.style.display = isAdmin ? 'inline-block' : 'none';

        // Ensure it points to admin dashboard which now has both panels
        adminBtn.href = 'admin.html';
        adminBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i> Admin Panel';
    }
}

// ---------- API LOGIC ----------
async function fetchVegetables() {
    try {
        const response = await fetch(`${API_BASE}/api/vegetables`);
        if (!response.ok) throw new Error('Failed to fetch vegetables');

        allVegetables = await response.json();
        renderProducts(allVegetables);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-grid').innerHTML = '<p style="color:red;">Error loading products. Make sure backend is running.</p>';
    }
}

// ---------- RENDER PRODUCTS ----------
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach((veg, index) => {
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${veg.image}" alt="${veg.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${veg.name}</h3>
                <p class="product-desc">${veg.description}</p>
                <div class="product-bottom">
                    <span class="product-price">₹${veg.pricePerKg} <span style="font-size:12px; color:#666; font-weight:normal;">/ kg</span></span>
                    <button class="add-to-cart-btn" onclick="addToCart('${veg._id}', '${veg.name}', ${veg.pricePerKg}, '${veg.image}')">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
        // Observe newly added card
        if (typeof observer !== 'undefined') observer.observe(card);
    });
}


// ---------- FILTER & SEARCH ----------
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const category = e.target.getAttribute('data-filter');
            if (category === 'all') {
                renderProducts(allVegetables);
            } else {
                const filtered = allVegetables.filter(v => v.category.toLowerCase().includes(category));
                renderProducts(filtered);
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allVegetables.filter(v => v.name.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    }
}

// ---------- CART LOGIC ----------
function addToCart(id, name, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, pricePerKg: price, quantity: 1, image });
    }

    saveCart();
    updateCartCount();
    showToast(`${name} added to cart!`);

    // Animate cart icon
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        floatingCart.style.animation = 'none';
        setTimeout(() => floatingCart.style.animation = 'cartPop 0.3s ease', 10);
    }
}

function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counts.forEach(c => c.textContent = totalItems);
}

function saveCart() {
    localStorage.setItem('vegCart', JSON.stringify(cart));
}

// ---------- CART PAGE RENDER ----------
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const summaryTotal = document.getElementById('summaryItemsTotal');
    const grandTotal = document.getElementById('summaryGrandTotal');

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty. <a href="index.html" style="color:var(--primary-color);">Start shopping</a></p>';
        summaryTotal.textContent = '₹0';
        grandTotal.textContent = '₹0';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.quantity * item.pricePerKg;
        total += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.pricePerKg} / kg</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity} kg</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">₹${itemTotal}</div>
            <button class="cart-item-remove" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(itemEl);
    });

    summaryTotal.textContent = `₹${total}`;
    grandTotal.textContent = `₹${total}`;
}

function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        saveCart();
        renderCart();
        updateCartCount();
    }
}

function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
    showToast('Item removed from cart', 'danger');
}

function goToCheckout() {
    if (cart.length === 0) {
        showToast('Cart is empty!', 'danger');
        return;
    }

    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    if (!userAuth || !userAuth.loggedIn) {
        showToast('Please Login/Signup to proceed with your order!', 'danger');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    window.location.href = 'checkout.html';
}

// ---------- CHECKOUT & WHATSAPP ----------
function renderCheckout() {
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    if (!userAuth || !userAuth.loggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);
    if (subtotal === 0) {
        window.location.href = 'index.html';
        return;
    }

    // Initial calculation if marker is already set
    if (marker) {
        const pos = marker.getLatLng();
        calculateDelivery(pos.lat, pos.lng);
    } else {
        updateCheckoutDisplay(subtotal, 0, 0);
    }
}

function calculateDelivery(lat, lng) {
    const dist = getDistance(STORE_COORDS.lat, STORE_COORDS.lng, lat, lng);
    currentDeliveryDistance = dist;

    // Rules: < 2km free, else 15 per km
    if (dist < 2) {
        deliveryCharges = 0;
    } else {
        deliveryCharges = Math.round(dist * 15);
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);
    updateCheckoutDisplay(subtotal, dist, deliveryCharges);
}

function updateCheckoutDisplay(subtotal, distance, charges) {
    const total = subtotal + charges;

    // Update UI elements
    const checkoutTotal = document.getElementById('checkoutTotal');
    if (checkoutTotal) checkoutTotal.textContent = `₹${total}`;

    // Update summary details if they exist
    const summaryDetails = document.querySelector('.summary-details');
    if (summaryDetails) {
        summaryDetails.innerHTML = `
            <div class="summary-row">
                <span>Items Subtotal</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Distance</span>
                <span>${distance.toFixed(2)} km</span>
            </div>
            <div class="summary-row">
                <span>Delivery Charges</span>
                <span>${charges === 0 ? 'FREE' : '₹' + charges}</span>
            </div>
            <div class="summary-row summary-total" style="border-top: 1px solid #eee; margin-top: 10px; padding-top: 10px;">
                <span>Total Amount</span>
                <span id="checkoutTotal">₹${total}</span>
            </div>
        `;
    }

    // Update QR Amount if visible
    const qrAmountDisplay = document.getElementById('qrAmountDisplay');
    if (qrAmountDisplay) qrAmountDisplay.textContent = total;

    const qrImg = document.getElementById('qrImage');
    if (qrImg && qrImg.src.includes('data=upi://pay')) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9989322515@ptaxis%26pn=FreshVeggies%26am=${total}`;
    }
}

// Haversine formula to calculate distance in KM
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function togglePaymentQR() {
    const qrSection = document.getElementById('qrSection');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const qrImg = document.getElementById('qrImage');
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);
    const total = subtotal + deliveryCharges;

    if (paymentMethod === 'Online Payment') {
        qrSection.style.display = 'block';
        document.getElementById('qrAmountDisplay').textContent = total;
        // Dynamically update QR code with total amount if possible
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9989322515@ptaxis%26pn=FreshVeggies%26am=${total}`;
    } else {
        qrSection.style.display = 'none';
    }
}

async function placeOrder() {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const transactionId = document.getElementById('transactionId')?.value || '';
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);
    const totalPrice = subtotal + deliveryCharges;

    const formattedItems = cart.map(item => ({
        vegetableId: item.id,
        name: item.name,
        quantity: item.quantity,
        pricePerKg: item.pricePerKg,
        totalPrice: item.quantity * item.pricePerKg
    }));

    // Start with Pending for Online, Verified for COD (or Pending until delivery)
    const paymentStatus = (paymentMethod === 'Online Payment') ? 'Pending' : 'Pending';

    // 1. Save to Database
    try {
        const userAuth = JSON.parse(localStorage.getItem('userAuth'));
        const userEmail = (userAuth && userAuth.loggedIn) ? userAuth.email : 'Guest';

        const response = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: name,
                phone,
                address,
                paymentMethod,
                items: formattedItems,
                totalPrice,
                deliveryCharges,
                distance: currentDeliveryDistance,
                userEmail,
                paymentStatus,
                transactionId // Note: Added to backend model if needed, otherwise just in logs
            })
        });

        if (!response.ok) {
            console.error('Order creation failed on server');
        }
    } catch (err) {
        console.error(err);
    }

    // 2. Generate WhatsApp Link
    let waMessage = `*Hello, I want to place an order:*\n\n`;
    waMessage += `*Payment: ${paymentMethod}* ${paymentMethod === 'Online Payment' ? '(Paid via QR)' : ''}\n`;
    if (transactionId) waMessage += `ID/UTR: ${transactionId}\n`;
    waMessage += `\n`;

    formattedItems.forEach(item => {
        waMessage += `🛒 ${item.name} - ${item.quantity}kg - ₹${item.totalPrice}\n`;
    });
    waMessage += `\n*Subtotal: ₹${totalPrice - deliveryCharges}*\n`;
    waMessage += `*Delivery: ${deliveryCharges === 0 ? 'FREE' : '₹' + deliveryCharges} (${currentDeliveryDistance.toFixed(2)} km)*\n`;
    waMessage += `*Total Amount: ₹${totalPrice}*\n`;
    waMessage += `\n*Customer Details:*\n`;
    waMessage += `Name: ${name}\n`;
    waMessage += `Phone: ${phone}\n`;
    waMessage += `Address: ${address}\n`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waURL = `https://wa.me/919989322515?text=${encodedMessage}`;

    // 3. Clear cart & redirect
    cart = [];
    saveCart();

    window.location.href = waURL;
}

// ---------- UI HELPERS ----------
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="color: ${type === 'success' ? 'var(--primary-color)' : 'var(--danger-color)'};"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInLeft 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// ---------- ADDRESS & MAP LOGIC ----------
let map, marker;

function initializeAddressMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Default to India center or User location if possible
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;

    map = L.map('map').setView([defaultLat, defaultLng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

    // Try to get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
            marker.setLatLng([latitude, longitude]);
            reverseGeocode(latitude, longitude);
            calculateDelivery(latitude, longitude);
        });
    }

    // Map click - move marker and geocode
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        reverseGeocode(lat, lng);
        calculateDelivery(lat, lng);
    });

    // Marker drag - geocode on end
    marker.on('dragend', (e) => {
        const { lat, lng } = marker.getLatLng();
        reverseGeocode(lat, lng);
        calculateDelivery(lat, lng);
    });

    // Address Search Suggestions
    const searchInput = document.getElementById('addressSearch');
    const suggestionsDiv = document.getElementById('addressSuggestions');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value;
        if (query.length < 3) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 500);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`);
        const data = await response.json();

        const suggestionsDiv = document.getElementById('addressSuggestions');
        suggestionsDiv.innerHTML = '';

        if (data.length > 0) {
            suggestionsDiv.style.display = 'block';
            data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = item.display_name;
                div.onclick = () => {
                    const lat = parseFloat(item.lat);
                    const lon = parseFloat(item.lon);
                    map.setView([lat, lon], 16);
                    marker.setLatLng([lat, lon]);
                    document.getElementById('address').value = item.display_name;
                    document.getElementById('addressSearch').value = '';
                    suggestionsDiv.style.display = 'none';
                    calculateDelivery(lat, lon);
                };
                suggestionsDiv.appendChild(div);
            });
        } else {
            suggestionsDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            document.getElementById('address').value = data.display_name;
        }
    } catch (error) {
        console.error('Error reverse geocoding:', error);
    }
}
