// ── DATA ──────────────────────────────────────────────
const menuData = [
  {
    emoji: '🍲',
    name: 'Sop Iga',
    desc: 'dengan tulang sapi Wagyu A++',
    price: 100000,
    cat: 'food',
    rating: 4.7
  },
  {
    emoji: '🍟',
    name: 'Kentang goreng',
    desc: 'Kentang goreng pro max',
    price: 25000,
    cat: 'snack',
    rating: 4.8
  },
  {
    emoji: '☕',
    name: 'Kopi Selow',
    desc: 'Espresso , susu fresh, gula aren ',
    price: 22000,
    cat: 'drink',
    rating: 4.9
  },
  {
    emoji: '🥐',
    name: 'Craflle',
    desc: 'Renyah dan Gurih',
    price: 35000,
    cat: 'dessert',
    rating: 4.6
  },
  {
    emoji: '🍚',
    name: 'Nasi putih',
    desc: 'Dari Beras spesial dari Sukabumi pride',
    price: 5000,
    cat: 'food',
    rating: 4.5
  },
  {
    emoji: '🥤',
    name: 'Lemon tea',
    desc: 'buah segar, tanpa gula tambahan',
    price: 20000,
    cat: 'drink',
    rating: 4.7
  },
  {
    emoji: '🍌',
    name: 'Pisang goreng wijen',
    desc: 'Pisang Asli tanpa campuran kelapa sawit',
    price: 25000,
    cat: 'dessert',
    rating: 4.8
  },
  {
    emoji: '🍗',
    name: 'Chicken Spicy',
    desc: 'dari ayam kota, bukan ayam kampung',
    price: 40000,
    cat: 'food',
    rating: 4.6
  },
];

// ── STATE ──────────────────────────────────────────────
let cart = [];
let currentItem = null;

// ── HELPERS ───────────────────────────────────────────
function formatPrice(price) {
  return 'Rp ' + price.toLocaleString('id');
}

function getActiveCat() {
  const pill = document.querySelector('.cat-pill.active');
  if (!pill) return 'all';
  const text = pill.textContent.trim();
  if (text.includes('Makanan')) return 'food';
  if (text.includes('Minuman')) return 'drink';
  if (text.includes('Snack'))   return 'snack';
  if (text.includes('Dessert')) return 'dessert';
  return 'all';
}

// ── RENDER MENU ────────────────────────────────────────
function renderMenu(cat = 'all') {
  const list = document.getElementById('menuList');
  const filtered = cat === 'all' ? menuData : menuData.filter(i => i.cat === cat);

  list.innerHTML = filtered.map((item) => {
    const idx = menuData.indexOf(item);
    const inCart = cart.find(c => c.name === item.name);
    const qty = inCart ? inCart.qty : 0;

    return `
      <div class="menu-item" onclick="openItem(menuData[${idx}])">
        <div class="item-img">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-meta">
            <div class="item-price">${formatPrice(item.price / 1000 * 1000).replace('Rp ','Rp ').replace('000','k').replace(',','.')}</div>
            <div class="item-rating">⭐ ${item.rating}</div>
          </div>
        </div>
        ${qty > 0 ? `
          <div class="item-qty">
            <button class="qty-btn qty-minus" onclick="event.stopPropagation(); changeQty('${item.name}', -1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn qty-plus" onclick="event.stopPropagation(); changeQty('${item.name}', 1)">+</button>
          </div>
        ` : `
          <div class="item-add" onclick="event.stopPropagation(); addItem(menuData[${idx}])">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
        `}
      </div>
    `;
  }).join('');
}

// ── CATEGORY FILTER ────────────────────────────────────
function selectCat(el, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderMenu(cat);
}

// ── CART LOGIC ─────────────────────────────────────────
function addItem(item) {
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
  showToast(`${item.emoji} ${item.name} ditambahkan!`);
  renderMenu(getActiveCat());
}

function changeQty(name, delta) {
  const idx = cart.findIndex(c => c.name === name);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
  renderMenu(getActiveCat());
}

function updateCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // Header badge
  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.classList.add('bump');
  setTimeout(() => countEl.classList.remove('bump'), 300);

  // Bottom bar
  document.getElementById('cartBarCount').textContent = count;
  document.getElementById('cartBarTotal').textContent = formatPrice(total);

  const bar = document.getElementById('cartBar');
  if (count > 0) {
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
}

// ── TOAST ──────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ── ITEM DETAIL MODAL ──────────────────────────────────
function openItem(item) {
  currentItem = item;
  document.getElementById('modalEmoji').textContent = item.emoji;
  document.getElementById('modalName').textContent = item.name;
  document.getElementById('modalDesc').textContent = item.desc;
  document.getElementById('modalPrice').textContent = formatPrice(item.price);
  document.getElementById('modalBtn').onclick = () => {
    addItem(item);
    closeItemModal();
  };
  document.getElementById('overlay').classList.add('show');
}

function closeModal(e) {
  if (e.target === document.getElementById('overlay')) closeItemModal();
}

function closeItemModal() {
  document.getElementById('overlay').classList.remove('show');
}

// ── CART MODAL ─────────────────────────────────────────
function openCart() {
  const itemsEl = document.getElementById('cartItems');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div style="text-align:center; padding:30px 0; color:var(--text-muted)">
        🛒 Keranjang kosong
      </div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)} × ${item.qty}</div>
        </div>
        <div class="item-qty">
          <button class="qty-btn qty-minus"
            onclick="changeQty('${item.name}', -1); updateCartModal()">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn qty-plus"
            onclick="changeQty('${item.name}', 1); updateCartModal()">+</button>
        </div>
      </div>
    `).join('');
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartModalTotal').textContent = formatPrice(total);
  document.getElementById('cartOverlay').classList.add('show');
}

function updateCartModal() {
  updateCart();
  openCart();
}

function closeCartModal(e) {
  if (e.target === document.getElementById('cartOverlay')) {
    document.getElementById('cartOverlay').classList.remove('show');
  }
}

// ── CHECKOUT ───────────────────────────────────────────
function checkout() {
  document.getElementById('cartOverlay').classList.remove('show');
  showToast('🚀 Pesanan dikirim ke dapur!');
  setTimeout(() => {
    cart = [];
    updateCart();
    renderMenu('all');
  }, 500);
}

// ── INIT ───────────────────────────────────────────────
renderMenu('all');
