const fs=require('fs'),path=require('path');
const root='/app';
const dbfile=path.join(root,'db.js');
let db=fs.readFileSync(dbfile,'utf8');
const data=[
['ALTAY SIBERIA күннен қорғайтын крем SPF50+','Бет пен денеге арналған күннен қорғайтын крем SPF50+ PA+++. Құрамында алоэ вера мен пантенол бар, суға төзімді. Көтерме баға — 1 данасы.',2500,'Күтім','IMG_3558(1).jpg'],
['YOUMAIDOU жасыл шаш кондиционері 800 мл','Сульфатсыз кондиционер: шашты тереңнен ылғалдандырып, жұмсақ әрі тегіс етеді.',1600,'Күтім','IMG_3560(1).jpg'],
['YOUMAIDOU көгілдір шаш кондиционері 758 мл','Сульфатсыз кондиционер: ылғалдандырады, шашты жұмсақ әрі тегіс етеді. Шаштың барлық түріне жарайды.',1600,'Күтім','IMG_3562(1).jpg'],
['YOUMAIDOU қызғылт шампунь 758 мл','Сульфатсыз шампунь: нәзік тазалайды, табиғи теңгерімді сақтайды. Күнделікті қолдануға жарайды.',1600,'Күтім','IMG_3563(1).jpg'],
['HANNIAI көгілдір шампунь 750 мл','Сульфатсыз шампунь: шаш пен бас терісін нәзік тазалайды, құрғатпайды және тітіркендірмейді.',1500,'Күтім','IMG_3564(1).jpg'],
['WOZHIAN душ гелі + скраб 2-і-1 400 мл','Душ гелі мен скраб бір құралда: терінің үсті қабатын тазалап, жұмсақ әрі тегіс етеді. Нәзік және балғын хош иістер.',1000,'Күтім','IMG_3565(1).jpg'],
['HANNIAI хош иісті душ гелі 1 л','Нәзік тазалайды, терін ылғалдандырады. Үш хош иіс: камелия, раушан, фрезия.',1700,'Күтім','IMG_3566(1).jpg'],
['MPINBA шиммері бар хош иісті сұйық сабын 500 мл','Жарқыл (шиммер) қосылған хош иісті сұйық сабын. Қолды нәзік тазалайды, құрғатпайды, күнделікті күтімге арналған.',1200,'Күтім','IMG_3567(1).jpg'],
['YOUMAIDOU шиммері бар хош иісті сұйық сабын 420 мл','Үш хош иіс: гүлді нәзіктік, лаванда үйлесімі, ваниль шабыты. Қолды нәзік тазалап, ылғалдандырады.',950,'Күтім','IMG_3568(1).jpg']
].map(([n,d,p,c,img])=>[n,d,p,c,'/images/washcare/'+img,10]);
if(!db.includes("path.join(__dirname, 'shopnest.db')")) throw Error('Original database layout changed');
db=db.replace("path.join(__dirname, 'shopnest.db')","process.env.DB_PATH || path.join(__dirname, 'shopnest.db')");
const m=db.match(/const products = \[[\s\S]*?\n\s*\];/);
if(!m)throw Error('Original seed data structure changed');
db=db.replace(m[0],'const products = '+JSON.stringify(data,null,2)+';');
if(!db.includes("bcrypt.hashSync('admin123', 10)"))throw Error('Admin seed format changed');
db=db.replace("bcrypt.hashSync('admin123', 10)","bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10)");
db=db.replace("console.log('Seeded admin user: admin@shopnest.com / admin123');","console.log('Seeded admin user: admin@shopnest.com');");
fs.writeFileSync(dbfile,db);
const publicDir=path.join(root,'public');const imageDir=path.join(publicDir,'images','washcare');fs.mkdirSync(imageDir,{recursive:true});
for(const f of fs.readdirSync('/build/custom/photos'))fs.copyFileSync(path.join('/build/custom/photos',f),path.join(imageDir,f));
const appFile=path.join(publicDir,'js','app.js');let app=fs.readFileSync(appFile,'utf8');
app=app.replace(/₹/g,'₸');fs.writeFileSync(appFile,app);
const cssDir=path.join(publicDir,'css');fs.mkdirSync(cssDir,{recursive:true});
fs.writeFileSync(path.join(cssDir,'washcare-mobile.css'),`/* Additive mobile rules: keep ShopNest's original theme */
html{-webkit-text-size-adjust:100%}body{max-width:100%;overflow-x:hidden}img{max-width:100%}input,select,textarea,button{box-sizing:border-box}
@media(max-width:768px){.product-grid,.products-grid,#productGrid,#productsGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.product-card{min-width:0}.form-row,.admin-layout{grid-template-columns:1fr!important}table{display:block;max-width:100%;overflow-x:auto}input,select,textarea{font-size:16px}.container,.wrapper,main{max-width:100%;box-sizing:border-box}}
@media(max-width:380px){.product-grid,.products-grid,#productGrid,#productsGrid{gap:8px!important}}`);
for(const f of fs.readdirSync(publicDir).filter(n=>n.endsWith('.html'))){const h=path.join(publicDir,f);let s=fs.readFileSync(h,'utf8');if(!/name=["']viewport["']/i.test(s))s=s.replace(/<head([^>]*)>/i,'<head$1>\n<meta name="viewport" content="width=device-width,initial-scale=1">');s=s.replace(/<\/head>/i,'<link rel="stylesheet" href="/css/washcare-mobile.css">\n</head>');fs.writeFileSync(h,s)}
let server=fs.readFileSync(path.join(root,'server.js'),'utf8');
server="if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12 || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || !process.env.DB_PATH)) { throw Error('Missing secure ADMIN_PASSWORD (12+), JWT_SECRET (32+) or DB_PATH environment variable'); }\n"+server;
server=server.replace(/console\.log\(` Admin login ->[^\n]+\n/,'console.log(` Admin login -> admin@shopnest.com\\n`);\n');
fs.writeFileSync(path.join(root,'server.js'),server);
require('/build/custom/kazakh.js')(root);
console.log('Original ShopNest retained. Kazakh washcare catalog and mobile CSS prepared.');
