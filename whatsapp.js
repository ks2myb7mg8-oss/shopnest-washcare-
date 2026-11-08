// Тіркелусіз себет + WhatsApp арқылы тапсырыс. customize.js соңында, kazakh.js-тен кейін шақырылады.
const fs = require('fs'), path = require('path');

module.exports = function (root) {
  const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
  const write = (rel, s) => fs.writeFileSync(path.join(root, rel), s);
  const must = (s, from, rel) => { if (!s.includes(from)) throw Error('WhatsApp step: text not found in ' + rel + ': ' + from.slice(0, 60)); };
  const tpl = (name) => fs.readFileSync(path.join(__dirname, 'templates', name), 'utf8');

  // app.js: себет браузерде, мәзірде тек Басты бет + Себет (әкімшіге Админ)
  {
    const rel = 'public/js/app.js';
    let s = read(rel);
    const a = s.indexOf('// ---------- Navbar ----------');
    const b = s.indexOf('function requireLogin');
    if (a < 0 || b < 0 || b < a) throw Error('WhatsApp step: navbar block not found in app.js');
    s = s.slice(0, a) + tpl('app-cart.js') + s.slice(b);
    write(rel, s);
  }

  // index.html: себет браузерде; «Қазір сатып алу» себетке қосып, себетке өтеді
  {
    const rel = 'public/index.html';
    let s = read(rel);
    const stockLine = `<span class="stock \${p.stock <= 5 ? 'low' : ''}">\${p.stock > 0 ? p.stock + ' дана бар' : 'Қоймада жоқ'}</span>`;
    must(s, stockLine, rel);
    s = s.replace(stockLine, `\${p.stock > 0 ? '' : '<span class="stock low">Қоймада жоқ</span>'}`);
    const fetchLine = 'const products = await apiFetch(`/products?${params.toString()}`);';
    must(s, fetchLine, rel);
    s = s.replace(fetchLine, fetchLine + '\n    products.forEach(p => { loadedProducts[p.id] = p; });');
    const a = s.indexOf('async function addToCart(productId) {');
    const b = s.indexOf("document.getElementById('searchInput').addEventListener");
    if (a < 0 || b < 0 || b < a) throw Error('WhatsApp step: addToCart block not found in index.html');
    const block = `const loadedProducts = {};

function addToCart(productId) {
  const p = loadedProducts[productId];
  if (!p) return;
  addItemToCart(p);
  showAlert('Себетке қосылды!');
  renderNavbar();
}

function buyNow(productId) {
  const p = loadedProducts[productId];
  if (!p) return;
  addItemToCart(p);
  window.location.href = '/cart.html';
}

`;
    s = s.slice(0, a) + block + s.slice(b);
    write(rel, s);
  }

  // cart.html: толық жаңа бет (WhatsApp арқылы тапсырыс)
  write('public/cart.html', tpl('cart.html'));

  // Тіркелу және «Тапсырыстарым» беттері енді қажет емес — басты бетке бағыттаймыз
  const redirect = '<!DOCTYPE html><html lang="kk"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/index.html"><title>ShopNest</title></head><body><a href="/index.html">Басты бет</a></body></html>';
  write('public/register.html', redirect);
  write('public/orders.html', redirect);

  // login.html: тек әкімшіге арналған
  {
    const rel = 'public/login.html';
    let s = read(rel);
    const reg = '<p class="auth-switch">Аккаунтыңыз жоқ па? <a href="register.html">Тіркелу</a></p>';
    must(s, reg, rel);
    s = s.replace(reg, '');
    must(s, '<h2>Қайта қош келдіңіз</h2>', rel);
    s = s.replace('<h2>Қайта қош келдіңіз</h2>', '<h2>Әкімші кіруі</h2>');
    const redir = "window.location.href = 'index.html';";
    must(s, redir, rel);
    s = s.replace(redir, "window.location.href = data.user.role === 'admin' ? 'admin.html' : 'index.html';");
    write(rel, s);
  }

  // admin.html: серверде тапсырыс сақталмайды, сондықтан «Тапсырыстар» қойындысын алып тастаймыз
  {
    const rel = 'public/admin.html';
    let s = read(rel);
    const chip = `<div class="chip" data-tab="orders" onclick="switchTab('orders')">Тапсырыстар</div>`;
    must(s, chip, rel);
    s = s.replace(chip, '');
    write(rel, s);
  }

  // server.js: WhatsApp нөмірін Railway айнымалысынан береді
  {
    const rel = 'server.js';
    let s = read(rel);
    const health = "app.get('/api/health', (req, res) => res.json({ status: 'ok' }));";
    must(s, health, rel);
    s = s.replace(health, health + "\napp.get('/api/config', (req, res) => res.json({ whatsapp: String(process.env.WHATSAPP_NUMBER || '').replace(/\\D/g, '') }));");
    write(rel, s);
  }

  console.log('WhatsApp ordering applied (no customer login).');
};
