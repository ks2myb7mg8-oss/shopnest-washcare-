// Қазақ тіліне аудару қадамы: customize.js соңында шақырылады.
// Әр ауыстыру міндетті түрде табылуы керек, әйтпесе түпнұсқа сайт өзгерген деп құрастыру тоқтайды.
const fs = require('fs'), path = require('path');

module.exports = function (root) {
  const files = {};
  function rep(rel, pairs) {
    const file = path.join(root, rel);
    let s = files[rel] !== undefined ? files[rel] : fs.readFileSync(file, 'utf8');
    for (const [from, to] of pairs) {
      if (!s.includes(from)) throw Error('Translation source text not found in ' + rel + ': ' + from);
      s = s.split(from).join(to);
    }
    files[rel] = s;
  }

  // ---------- Frontend: app.js ----------
  rep('public/js/app.js', [
    ['Request failed (', 'Сұраныс орындалмады ('],
    ['/cart.html">Cart${', '/cart.html">Себет${'],
    ['>Home</a>', '>Басты бет</a>'],
    ['>My Orders</a>', '>Тапсырыстарым</a>'],
    ['>Admin</a>', '>Админ</a>'],
    ['Hi, ${', 'Сәлем, ${'],
    ['>Logout</button>', '>Шығу</button>'],
    ['>Login</a>', '>Кіру</a>'],
    ['>Register</a>', '>Тіркелу</a>'],
  ]);
  // Баға форматы: 2 500 ₸ (теңге белгісі соңында, ондық бөлшексіз)
  {
    const rel = 'public/js/app.js';
    const re = /function formatPrice\(n\) \{[^\n]*\}/;
    if (!re.test(files[rel])) throw Error('formatPrice not found');
    files[rel] = files[rel].replace(re,
      "function formatPrice(n) { return Number(n).toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₸'; }\n\n" +
      "// Тапсырыс күйлері (мәліметтер базасындағы мән ағылшынша қалады, экранда қазақша көрсетіледі)\n" +
      "const STATUS_KK = { placed: 'Қабылданды', processing: 'Өңделуде', shipped: 'Жөнелтілді', delivered: 'Жеткізілді', cancelled: 'Бас тартылды', pending: 'Күтуде' };\n" +
      "function statusLabel(s) { return STATUS_KK[s] || s; }");
  }

  // ---------- index.html ----------
  rep('public/index.html', [
    ['<html lang="en">', '<html lang="kk">'],
    ['<title>ShopNest — Shop Smart</title>', '<title>ShopNest — Көтерме каталог</title>'],
    ['<h1>Welcome to ShopNest</h1>', '<h1>ShopNest-ке қош келдіңіз</h1>'],
    ['<p>Everyday essentials, delivered with care.</p>', '<p>Күнделікті қажетті күтім құралдары — көтерме бағамен.</p>'],
    ['placeholder="Search products..."', 'placeholder="Тауар іздеу..."'],
    ['<option value="">All Categories</option>', '<option value="">Барлық санаттар</option>'],
    ['<p>Loading products...</p>', '<p>Тауарлар жүктелуде...</p>'],
    ['&copy; 2026 ShopNest. College mini-project.', '&copy; 2026 ShopNest. Күтім құралдарының көтерме каталогы.'],
    ['No products found.', 'Тауар табылмады.'],
    ["' in stock'", "' дана бар'"],
    ["'Out of stock'", "'Қоймада жоқ'"],
    ["'Out of Stock'", "'Қоймада жоқ'"],
    ['Add to Cart', 'Себетке қосу'],
    ['Buy Now', 'Қазір сатып алу'],
    ['Failed to load products: ', 'Тауарларды жүктеу мүмкін болмады: '],
    ["'Added to cart!'", "'Себетке қосылды!'"],
    ['`Order #${order.id} placed successfully!`', '`№${order.id} тапсырыс сәтті қабылданды!`'],
  ]);

  // ---------- login.html ----------
  rep('public/login.html', [
    ['<html lang="en">', '<html lang="kk">'],
    ['<title>Login — ShopNest</title>', '<title>Кіру — ShopNest</title>'],
    ['<h2>Welcome back</h2>', '<h2>Қайта қош келдіңіз</h2>'],
    ['<label for="email">Email</label>', '<label for="email">Электрондық пошта</label>'],
    ['<label for="password">Password</label>', '<label for="password">Құпиясөз</label>'],
    ['Login</button>', 'Кіру</button>'],
    ["'Logging in...'", "'Кіріп жатыр...'"],
    ["btn.textContent = 'Login'", "btn.textContent = 'Кіру'"],
    ['Don\'t have an account? <a href="register.html">Sign up</a>', 'Аккаунтыңыз жоқ па? <a href="register.html">Тіркелу</a>'],
  ]);

  // ---------- register.html ----------
  rep('public/register.html', [
    ['<html lang="en">', '<html lang="kk">'],
    ['<title>Sign Up — ShopNest</title>', '<title>Тіркелу — ShopNest</title>'],
    ['<h2>Create your account</h2>', '<h2>Аккаунт ашу</h2>'],
    ['<label for="name">Full Name</label>', '<label for="name">Аты-жөніңіз</label>'],
    ['placeholder="Your name"', 'placeholder="Атыңыз"'],
    ['<label for="email">Email</label>', '<label for="email">Электрондық пошта</label>'],
    ['<label for="password">Password</label>', '<label for="password">Құпиясөз</label>'],
    ['placeholder="At least 6 characters"', 'placeholder="Кемінде 6 таңба"'],
    ['Sign Up</button>', 'Тіркелу</button>'],
    ["'Creating account...'", "'Аккаунт жасалуда...'"],
    ["btn.textContent = 'Sign Up'", "btn.textContent = 'Тіркелу'"],
    ['Already have an account? <a href="login.html">Login</a>', 'Аккаунтыңыз бар ма? <a href="login.html">Кіру</a>'],
  ]);

  // ---------- cart.html ----------
  rep('public/cart.html', [
    ['<html lang="en">', '<html lang="kk">'],
    ['Your Cart', 'Себетіңіз'],
    ['<span>Subtotal</span>', '<span>Аралық сома</span>'],
    ['<span>Delivery</span><span>Free</span>', '<span>Жеткізу</span><span>Тегін</span>'],
    ['<span>Total</span>', '<span>Барлығы</span>'],
    ['<label for="address">Delivery Address</label>', '<label for="address">Жеткізу мекенжайы</label>'],
    ['placeholder="Enter your full address"', 'placeholder="Толық мекенжайыңызды жазыңыз"'],
    ['Place Order', 'Тапсырыс беру'],
    ['Your cart is empty.', 'Себетіңіз бос.'],
    ['Browse Products', 'Тауарларды қарау'],
    [' each</div>', ' / дана</div>'],
    ['Remove</button>', 'Жою</button>'],
    ['Failed to load cart.', 'Себетті жүктеу мүмкін болмады.'],
    ['Please enter a delivery address.', 'Жеткізу мекенжайын жазыңыз.'],
    ["'Placing order...'", "'Тапсырыс жасалуда...'"],
  ]);

  // ---------- orders.html ----------
  rep('public/orders.html', [
    ['<html lang="en">', '<html lang="kk">'],
    ['My Orders', 'Тапсырыстарым'],
    ['Order #${escapeHtml(placedId)} placed successfully! Thank you for shopping with us.', '№${escapeHtml(placedId)} тапсырыс сәтті қабылданды! Біздің дүкеннен сатып алғаныңызға рахмет.'],
    ['No orders yet.', 'Әзірге тапсырыс жоқ.'],
    ['Start Shopping', 'Сатып алуды бастау'],
    ['<strong>Order #${order.id}</strong>', '<strong>Тапсырыс №${order.id}</strong>'],
    ['${escapeHtml(order.status)}', '${escapeHtml(statusLabel(order.status))}'],
    ['Total: ${', 'Барлығы: ${'],
    ['Failed to load orders.', 'Тапсырыстарды жүктеу мүмкін болмады.'],
  ]);

  // ---------- admin.html ----------
  rep('public/admin.html', [
    ['<html lang="en">', '<html lang="kk">'],
    ['Admin Dashboard', 'Басқару тақтасы'],
    ['>Products</div>', '>Тауарлар</div>'],
    ['>Orders</div>', '>Тапсырыстар</div>'],
    ['Add New Product', 'Жаңа тауар қосу'],
    ['<label>Name</label>', '<label>Атауы</label>'],
    ['<label>Description</label>', '<label>Сипаттамасы</label>'],
    ['<label>Price (₹)</label>', '<label>Бағасы (₸)</label>'],
    ['<label>Stock</label>', '<label>Қоймадағы саны</label>'],
    ['<label>Category</label>', '<label>Санаты</label>'],
    ['placeholder="e.g. Electronics"', 'placeholder="мысалы: Күтім"'],
    ['<label>Image URL</label>', '<label>Сурет сілтемесі (URL)</label>'],
    ['Add Product', 'Тауар қосу'],
    ['Cancel Edit', 'Өзгертуді болдырмау'],
    ['<th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>', '<th>Атауы</th><th>Санаты</th><th>Бағасы</th><th>Саны</th><th>Әрекеттер</th>'],
    ['<th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th>', '<th>Тапсырыс №</th><th>Тұтынушы</th><th>Сомасы</th><th>Күйі</th><th>Күні</th><th>Жаңарту</th>'],
    ['>Edit</button>', '>Өзгерту</button>'],
    ['>Delete</button>', '>Жою</button>'],
    ['Failed to load products.', 'Тауарларды жүктеу мүмкін болмады.'],
    ['Edit Product', 'Тауарды өзгерту'],
    ['Update Product', 'Тауарды жаңарту'],
    ['Product updated.', 'Тауар жаңартылды.'],
    ['Product added.', 'Тауар қосылды.'],
    ["'Delete this product?'", "'Бұл тауарды жою керек пе?'"],
    ["|| 'General'", "|| 'Жалпы'"],
    ['Failed to load orders.', 'Тапсырыстарды жүктеу мүмкін болмады.'],
    ['${escapeHtml(o.status)}', '${escapeHtml(statusLabel(o.status))}'],
    ['${s}</option>', '${statusLabel(s)}</option>'],
  ]);

  // ---------- Backend messages (shown to the user in the forms) ----------
  rep('routes/auth.js', [
    ['Name, email and password are required.', 'Аты-жөні, электрондық пошта және құпиясөз міндетті.'],
    ['Password must be at least 6 characters.', 'Құпиясөз кемінде 6 таңба болуы керек.'],
    ['An account with this email already exists.', 'Бұл поштамен аккаунт бұрыннан бар.'],
    ['Email and password are required.', 'Электрондық пошта мен құпиясөзді жазыңыз.'],
    ['Invalid email or password.', 'Пошта немесе құпиясөз дұрыс емес.'],
  ]);
  rep('routes/cart.js', [
    ['Product not found.', 'Тауар табылмады.'],
    ['Added to cart.', 'Себетке қосылды.'],
    ['Cart item not found.', 'Себеттегі тауар табылмады.'],
    ['Item removed from cart.', 'Тауар себеттен жойылды.'],
    ['Cart updated.', 'Себет жаңартылды.'],
  ]);
  rep('routes/orders.js', [
    ['Your cart is empty.', 'Себетіңіз бос.'],
    ['`Not enough stock for ${item.name}.`', '`${item.name} қоймада жеткіліксіз.`'],
    ['Order placed successfully!', 'Тапсырыс сәтті қабылданды!'],
    ['Order not found.', 'Тапсырыс табылмады.'],
    ['Order status updated.', 'Тапсырыс күйі жаңартылды.'],
  ]);
  rep('routes/products.js', [
    ['Product not found.', 'Тауар табылмады.'],
    ['Name and price are required.', 'Атауы мен бағасы міндетті.'],
    ['Product deleted successfully.', 'Тауар жойылды.'],
  ]);
  rep('middleware/auth.js', [
    ['No token provided. Please login.', 'Кіру қажет. Алдымен жүйеге кіріңіз.'],
    ['Invalid or expired token.', 'Сессия жарамсыз немесе мерзімі өтті. Қайта кіріңіз.'],
    ['Admin access required.', 'Тек әкімші кіре алады.'],
  ]);

  for (const [rel, s] of Object.entries(files)) fs.writeFileSync(path.join(root, rel), s);
  console.log('Kazakh translation applied to ' + Object.keys(files).length + ' files.');
};
