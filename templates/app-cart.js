// ---------- Себет: браузерде сақталады, тіркелу қажет емес ----------
function getCart() {
  try {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    return Array.isArray(c) ? c : [];
  } catch (e) { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) { /* ignore */ }
}
function cartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function addItemToCart(p) {
  const cart = getCart();
  const it = cart.find(i => i.id === p.id);
  if (it) it.qty += 1;
  else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
  saveCart(cart);
}

// ---------- Navbar ----------
function renderNavbar() {
  const el = document.getElementById('navbar');
  if (!el) return;
  const count = cartCount();
  const admin = isLoggedIn() && isAdmin();

  el.innerHTML = `
    <a href="/index.html" class="brand">Shop<span>Nest</span></a>
    <div class="nav-links">
      <a href="/index.html">Басты бет</a>
      <a href="/cart.html">Себет${count ? `<span class="badge">${count}</span>` : ''}</a>
      ${admin ? '<a href="/admin.html">Админ</a><button id="logoutBtn">Шығу</button>' : ''}
    </div>
  `;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = '/index.html';
    });
  }
}

