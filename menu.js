/**
 * ╔═══════════════════════════════════════════════════╗
 * ║   مقهى ابو حالوب — Core Application Script v2.0        ║
 * ║   1. Firebase / Data Loading                       ║
 * ║   2. Rendering Engine                              ║
 * ║   3. Smart Suggestions Engine                      ║
 * ║   4. Cart System                                   ║
 * ║   5. UI — Modals, Drawer, Tabs, Toast              ║
 * ║   6. Search                                        ║
 * ║   7. Swipe-to-Close                                ║
 * ║   8. Service Worker Registration                   ║
 * ╚═══════════════════════════════════════════════════╝
 */
'use strict';

/* ─────────────────────────────────────────────────────
   1. STATE & DB
   ───────────────────────────────────────────────── */
let DB = {
  sandwiches: [], rolls: [], meals: [],
  lamma: [], plates: [], mansaf: [],
  weights: [], drinks: []
};

let cart      = [];
let modalItem = null;
let toastTimer;

/* ── FEATURED CARDS (static config) ── */
const FEAT = [
  { id: 1001, name: 'سمك مسكوف عراقي',      tag: 'المسكوف البغدادي الأصيل', price: 15000, col: 'linear-gradient(135deg,#2b2b2b,#111111)' },
  { id: 2001, name: 'دجاج مشوي بالتنور', tag: 'مشوي على حطب الحمضيات',    price: 15000, col: 'linear-gradient(135deg,#333333,#1a1a1a)' },
  { id: 3001, name: 'نفر كباب لحم عراقي',    tag: 'لحم بلدي عراقي فاخر',    price: 15000, col: 'linear-gradient(135deg,#444444,#222222)' },
  { id: 4002, name: 'بركر لحم بالجبن',   tag: 'برجر كلاسيكي بالجبنة السائحة',        price: 6500,  col: 'linear-gradient(135deg,#1a1a1a,#0a0a0a)' }
];

/* ── SMART SUGGESTIONS MAP ──
   Maps a category to the complementary categories.
   When a user opens an item from 'sandwiches',
   we suggest random items from 'drinks' and 'plates', etc. */
const SUGGEST_MAP = {
  masgouf: ['soft_drinks', 'cold_starters'],
  chicken: ['soft_drinks', 'cold_starters'],
  grills: ['soft_drinks', 'cold_starters'],
  burgers: ['soft_drinks', 'cold_starters'],
  sandwiches: ['soft_drinks', 'cold_starters'],
  cold_starters: ['soft_drinks'],
  hot_starters: ['soft_drinks'],
  soft_drinks: ['sandwiches', 'burgers'],
  energy_drinks: ['sandwiches', 'burgers'],
  fruits_cakes: ['soft_drinks'],
  mojito: ['sandwiches', 'burgers'],
  pancakes: ['soft_drinks'],
  smoothies: ['sandwiches', 'burgers'],
  hot_drinks: ['fruits_cakes'],
  milkshake: ['fruits_cakes'],
  sweets: ['soft_drinks'],
  ice_coffee: ['fruits_cakes'],
  ice_cream: ['fruits_cakes'],
  juices: ['sandwiches', 'burgers'],
  waffles: ['soft_drinks'],
  hookah: ['soft_drinks']
};

/* ─────────────────────────────────────────────────────
   2. FIREBASE INIT
   ───────────────────────────────────────────────── */
function initFirebase() {
  if (typeof firebase === 'undefined' ||
      firebaseConfig.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase not configured — loading local initialData.');
    if (typeof initialData !== 'undefined') loadFromData(initialData);
    return;
  }

  const dbRef = firebase.database().ref('h3alb_menu');
  dbRef.on('value', snap => {
    const data = snap.val();
    if (data && data.items) {
      loadFromData(data);
    } else if (typeof initialData !== 'undefined') {
      loadFromData(initialData);
    }
  });
}

/* ─────────────────────────────────────────────────────
   3. DATA LOADING
   ───────────────────────────────────────────────── */
function loadFromData(data) {
  const cats = [
    'masgouf', 'chicken', 'grills', 'burgers', 'sandwiches',
    'cold_starters', 'hot_starters', 'soft_drinks', 'energy_drinks',
    'fruits_cakes', 'mojito', 'pancakes', 'smoothies', 'hot_drinks',
    'milkshake', 'sweets', 'ice_coffee', 'ice_cream', 'juices',
    'waffles', 'hookah'
  ];
  cats.forEach(k => DB[k] = []);

  const items = data.items
    ? (Array.isArray(data.items) ? data.items : Object.values(data.items))
    : [];

  items.forEach(it => {
    if (it && DB[it.cat]) DB[it.cat].push(it);
  });

  populate();
  setTimeout(initReveal, 100);
}

/* ─────────────────────────────────────────────────────
   4. UTILITIES
   ───────────────────────────────────────────────── */
function all()        { return Object.values(DB).flat(); }
function getItem(id)  { return all().find(i => String(i.id) === String(id)); }

function imgTag(path, cls, alt) {
  if (!path) return `<div class="${cls || 'ic-ph'}"><i class="ph-light ph-fork-knife"></i></div>`;
  return `<img src="compressed-${path}" alt="${alt || ''}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'ic-ph\\'><i class=\\'ph-light ph-fork-knife\\'></i></div>'">`;
}

function badge(b) {
  if (b === 'new')     return `<span class="ibdg ibdg-new">جديد</span>`;
  if (b === 'popular') return `<span class="ibdg ibdg-pop">الأكثر طلباً</span>`;
  return '';
}

/* ─────────────────────────────────────────────────────
   5. RENDER CARD
   ───────────────────────────────────────────────── */
function bdgInline(b) {
  if (b === 'new') return `<span class="ibdg-inline" style="background:var(--tan); color:#fff; font-size:10px; font-weight:800; padding:3px 9px; border-radius:20px; display:inline-block; margin-bottom:6px; font-family:'Readex Pro',sans-serif;">جديد</span>`;
  if (b === 'popular') return `<span class="ibdg-inline" style="background:var(--red); color:#fff; font-size:10px; font-weight:800; padding:3px 9px; border-radius:20px; display:inline-block; margin-bottom:6px; font-family:'Readex Pro',sans-serif;">الأكثر طلباً</span>`;
  return '';
}

function rCard(item, delay = 0) {
  const inlineBadge = bdgInline(item.badge);

  return `<div class="ic" style="transition-delay:${delay}s; padding-top: 15px;" onclick="openModal('${item.id}')">
    <div class="ic-body">
      ${inlineBadge}
      <div class="ic-name">${item.name}</div>
      <div class="ic-desc">${item.desc || ''}</div>
      <div class="ic-foot">
        <span class="ic-price">${item.price.toLocaleString()} د.ع</span>
        <button class="ic-add" onclick="event.stopPropagation();qadd('${item.id}',this)" aria-label="أضف ${item.name}">
          <i class="ph-bold ph-plus"></i>
        </button>
      </div>
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────────────
   6. POPULATE ALL SECTIONS
   ───────────────────────────────────────────────── */
function populate() {
  const categories = [
    'masgouf', 'chicken', 'grills', 'burgers', 'sandwiches',
    'cold_starters', 'hot_starters', 'soft_drinks', 'energy_drinks',
    'fruits_cakes', 'mojito', 'pancakes', 'smoothies', 'hot_drinks',
    'milkshake', 'sweets', 'ice_coffee', 'ice_cream', 'juices',
    'waffles', 'hookah'
  ];
  categories.forEach(k => {
    const el = document.getElementById(k + 'G');
    if (el) {
      // Show skeleton first if empty
      if (!el.innerHTML) {
        el.innerHTML = Array(4).fill('<div class="ic skeleton" style="height:200px;border-radius:24px;"></div>').join('');
      }
      el.innerHTML = DB[k].map((it, i) => rCard(it, i * .06)).join('');
    }
  });

  // Popular grid
  document.getElementById('popG').innerHTML =
    all().filter(i => i.badge).map((it, i) => rCard(it, i * .05)).join('');

  // Featured slider
  document.getElementById('featS').innerHTML = FEAT.map(f => {
    const it = getItem(f.id);
    const imgHtml = it?.img
      ? `<img src="compressed-${it.img}" class="fc-img" alt="${f.name}" onerror="this.outerHTML='<div class=\\'fc-ph\\'><i class=\\'ph-light ph-fork-knife\\'></i></div>'">`
      : `<div class="fc-ph"><i class="ph-light ph-fork-knife"></i></div>`;

    return `<div class="fc" style="background:${f.col}" onclick="openModal('${f.id}')">
      ${imgHtml}
      <div class="fc-body">
        <div class="fc-name">${f.name}</div>
        <div class="fc-tag">${f.tag}</div>
        <div class="fc-foot">
          <span class="fc-price">${f.price.toLocaleString()} د.ع</span>
          <button class="fc-add" onclick="event.stopPropagation();qadd('${f.id}',this)" aria-label="أضف">
            <i class="ph-bold ph-plus"></i>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Dots
  document.getElementById('dots').innerHTML =
    FEAT.map((_, i) => `<div class="dot${i === 0 ? ' on' : ''}" onclick="scrollFeat(${i})"></div>`).join('');

  const featS = document.getElementById('featS');
  featS.addEventListener('scroll', function () {
    const i = Math.round(this.scrollLeft / 205);
    document.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('on', j === i));
  });
}

function scrollFeat(i) {
  document.getElementById('featS').scrollTo({ left: i * 205, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────
   7. SMART SUGGESTIONS ENGINE
   ───────────────────────────────────────────────── */
function getSuggestions(item, count = 4) {
  if (!item) return [];
  const targetCats = SUGGEST_MAP[item.cat] || [];
  let pool = [];
  targetCats.forEach(cat => {
    pool = pool.concat(DB[cat] || []);
  });
  // Shuffle & slice
  return pool.sort(() => Math.random() - 0.5).slice(0, count);
}

function renderSuggestions(item) {
  const suggestions = getSuggestions(item);
  if (!suggestions.length) return '';

  const cards = suggestions.map(s => {
    const img = s.img
      ? `<img src="compressed-${s.img}" alt="${s.name}" onerror="this.outerHTML='<div class=\\'rel-card-ph\\'><i class=\\'ph-light ph-fork-knife\\'></i></div>'">`
      : `<div class="rel-card-ph"><i class="ph-light ph-fork-knife"></i></div>`;
    return `<div class="rel-card" onclick="openModal('${s.id}')">
      ${img}
      <div class="rel-card-body">
        <div class="rel-card-name">${s.name}</div>
        <div class="rel-card-price">${s.price.toLocaleString()} د.ع</div>
      </div>
    </div>`;
  }).join('');

  return `<div class="m-related">
    <div class="m-related-title"><i class="ph-bold ph-sparkle"></i> يعجبك أيضاً</div>
    <div class="m-related-list">${cards}</div>
  </div>`;
}

/* ─────────────────────────────────────────────────────
   8. REVEAL OBSERVER (Intersection Observer)
   ───────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('reveal');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.06 });

function initReveal() {
  document.querySelectorAll('.ic').forEach(el => revealObs.observe(el));
}

/* ─────────────────────────────────────────────────────
   9. TABS & SWIPE NAVIGATION
   ───────────────────────────────────────────────── */
let tScroll = false;
function goTab(id, btn) {
  tScroll = true;
  const sec = document.getElementById(id);
  const vp  = document.getElementById('mainVp');

  document.querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  vp.scrollTo({ left: sec.offsetLeft, behavior: 'smooth' });
  setTimeout(() => tScroll = false, 800);
}

const secObs = new IntersectionObserver((entries) => {
  if (tScroll) return;
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio > 0.5) {
      const idx = Array.from(document.querySelectorAll('.sec')).indexOf(e.target);
      const tabs = document.querySelectorAll('.tb');
      if (tabs[idx]) {
        tabs.forEach(t => t.classList.remove('on'));
        tabs[idx].classList.add('on');
        tabs[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  });
}, { threshold: 0.51, root: document.getElementById('mainVp') });

setTimeout(() => {
  document.querySelectorAll('.sec').forEach(s => secObs.observe(s));
}, 500);

/* ─────────────────────────────────────────────────────
   10. SEARCH
   ───────────────────────────────────────────────── */
function doSearch(v) {
  v = v.trim();
  const featWrap = document.getElementById('featWrap');
  const popG     = document.getElementById('popG');

  if (!v) {
    featWrap.style.display = 'block';
    populate();
    return;
  }

  featWrap.style.display = 'none';
  const res = all().filter(i =>
    i.name.includes(v) || (i.desc && i.desc.includes(v))
  );

  popG.innerHTML = res.length
    ? res.map((it, i) => rCard(it, i * .04)).join('')
    : '<p style="color:var(--sub);font-size:14.5px;grid-column:1/-1;padding:40px 0;text-align:center;font-weight:600;">لا توجد نتائج مطابقة 💔</p>';

  goTab('home', document.querySelector('.tb'));
  setTimeout(initReveal, 50);
}

/* ─────────────────────────────────────────────────────
   11. ITEM MODAL
   ───────────────────────────────────────────────── */
function openModal(id) {
  const item = getItem(id);
  if (!item) return;
  modalItem = item;

  // Image
  const imgHtml = item.img
    ? `<div class="m-img-wrap"><img src="compressed-${item.img}" class="m-img" alt="${item.name}" loading="lazy" onerror="this.outerHTML='<div class=\\'m-ph\\'><i class=\\'ph-light ph-fork-knife\\'></i></div>'"></div>`
    : `<div class="m-ph"><i class="ph-light ph-fork-knife"></i></div>`;

  document.getElementById('mImgW').innerHTML = imgHtml;
  document.getElementById('mName').textContent  = item.name;
  document.getElementById('mPrice').textContent = item.price.toLocaleString() + ' د.ع';
  document.getElementById('mDesc').textContent  = item.desc || '';

  // Badge
  const badgeEl = document.getElementById('mBadge');
  if (badgeEl) {
    if (item.badge === 'popular') { badgeEl.textContent = '⭐ الأكثر طلباً'; badgeEl.style.display = 'inline-block'; }
    else if (item.badge === 'new') { badgeEl.textContent = '✨ جديد'; badgeEl.style.display = 'inline-block'; }
    else { badgeEl.style.display = 'none'; }
  }

  // Smart Suggestions
  document.getElementById('mRelated').innerHTML = renderSuggestions(item);

  document.getElementById('mov').classList.add('on');
}

function closeModal()    { document.getElementById('mov').classList.remove('on'); modalItem = null; }
function closeModalOv(e) { if (e.target === document.getElementById('mov')) closeModal(); }
function addFromModal()  { if (modalItem) { addToCart(modalItem.id); closeModal(); } }

/* ─────────────────────────────────────────────────────
   11.5 SMART ACTIVE SUGGESTIONS POPUP
   ───────────────────────────────────────────────── */
const SMART_COPIES = {
  sandwiches: { msg: 'برّد على گلبك 🧊 ضيف مشروب بارد ويه الشاورما يخبل!', suggest: ['soft_drinks'] },
  burgers:    { msg: 'برّد على گلبك 🧊 ضيف مشروب بارد ويه البرجر يخبل!', suggest: ['soft_drinks'] },
  grills:      { msg: 'المشويات طازجة ولذيذة 😋 جربها مع مقبلاتنا!', suggest: ['soft_drinks', 'cold_starters'] },
  masgouf:      { msg: 'المسكوف البغدادي يكمل ويه مقبلات باردة وعصائر', suggest: ['soft_drinks', 'cold_starters'] },
  chicken:     { msg: 'جرب ويه الدجاج مقبلاتنا المميزة 🥗', suggest: ['soft_drinks', 'cold_starters'] }
};

let smartTriggeredCount = 0;

function triggerSmartSuggestion(addedItem) {
  if (!addedItem || smartTriggeredCount >= 3) return; // avoid severe spam
  if (!SMART_COPIES[addedItem.cat]) return;

  const targets = SMART_COPIES[addedItem.cat].suggest;
  const hasRelatedInCart = cart.some(c => targets.includes(c.cat));
  if (hasRelatedInCart) return;

  let pool = [];
  targets.forEach(cat => { pool = pool.concat(DB[cat] || []); });
  pool = pool.filter(p => !cart.some(c => c.id === p.id));
  if (pool.length === 0) return;

  const suggestions = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  if (!suggestions.length) return;

  const copy = SMART_COPIES[addedItem.cat].msg;
  document.getElementById('smTitle').innerHTML = 'كمل وجبتك ✨';
  document.getElementById('smCopy').textContent = copy;

  const cardsHtml = suggestions.map(s => {
    const imgHtml = s.img 
      ? `<img src="compressed-${s.img}" class="sm-card-img" alt="${s.name}" onerror="this.outerHTML='<div class=\\'sm-card-ph\\'><i class=\\'ph-light ph-fork-knife\\'></i></div>'">`
      : `<div class="sm-card-ph"><i class="ph-light ph-fork-knife"></i></div>`;

    return `<div class="sm-card">
      ${imgHtml}
      <div class="sm-card-body">
        <div>
          <div class="sm-card-name">${s.name}</div>
          <div class="sm-card-price">${s.price.toLocaleString()} د.ع</div>
        </div>
        <button class="sm-card-add" onclick="addSmartItem('${s.id}')">
          <i class="ph-bold ph-plus"></i> أضف للسلة
        </button>
      </div>
    </div>`;
  }).join('');

  document.getElementById('smCards').innerHTML = cardsHtml;
  document.getElementById('sov').classList.add('on');
  smartTriggeredCount++;
}

function closeSmartModal() { document.getElementById('sov').classList.remove('on'); }
function closeSmartOv(e) { if(e.target === document.getElementById('sov')) closeSmartModal(); }

function addSmartItem(id) {
  addToCart(id, true);
  closeSmartModal();
}

/* ─────────────────────────────────────────────────────
   12. CART SYSTEM
   ───────────────────────────────────────────────── */
function qadd(id, btn) {
  addToCart(id);
  if (btn) {
    // Button pulse
    btn.style.transform = 'scale(1.55)';
    setTimeout(() => btn.style.transform = '', 220);

    // Fly-dot animation
    const rect     = btn.getBoundingClientRect();
    const cartEl   = document.getElementById('fbar');
    const cartRect = cartEl.getBoundingClientRect();
    const dot      = document.createElement('div');
    dot.className  = 'fly-dot';
    dot.innerHTML  = '<i class="ph-bold ph-check"></i>';
    dot.style.left = rect.left + 'px';
    dot.style.top  = rect.top  + 'px';
    dot.style.setProperty('--dx', (cartRect.left + cartRect.width  / 2 - rect.left - 13) + 'px');
    dot.style.setProperty('--dy', (cartRect.top  + cartRect.height / 2 - rect.top  - 13) + 'px');
    document.body.appendChild(dot);

    setTimeout(() => {
      dot.remove();
      if (cartEl.classList.contains('on')) {
        cartEl.style.transform = 'translateX(-50%) scale(1.1)';
        setTimeout(() => cartEl.style.transform = '', 220);
      }
    }, 640);
  }
}

function addToCart(id, skipSuggest = false) {
  const item = getItem(id);
  if (!item) return;
  const ex = cart.find(c => String(c.id) === String(id));
  if (ex) ex.qty++;
  else cart.push({ ...item, qty: 1 });
  updateUI();
  showToast('تمت إضافة ' + item.name);

  if (!skipSuggest) {
    setTimeout(() => triggerSmartSuggestion(item), 600); // Wait for animations
  }
}

function removeFromCart(id) {
  cart = cart.filter(c => String(c.id) !== String(id));
  updateUI(); renderDrawer();
}

function changeQty(id, d) {
  const ex = cart.find(c => String(c.id) === String(id));
  if (!ex) return;
  ex.qty += d;
  if (ex.qty <= 0) { removeFromCart(id); return; }
  updateUI(); renderDrawer();
}

function clearCart()    { document.getElementById('cov').classList.add('on'); }
function closeConfirm() { document.getElementById('cov').classList.remove('on'); }
function confirmClear() { cart = []; updateUI(); renderDrawer(); closeConfirm(); }

function totalN() { return cart.reduce((s, c) => s + c.qty, 0); }
function totalP() { return cart.reduce((s, c) => s + c.price * c.qty, 0); }

function updateUI() {
  const n  = totalN(), t = totalP();
  const hd = document.getElementById('hdrDot');
  hd.textContent = n;
  hd.classList.toggle('on', n > 0);
  const fb = document.getElementById('fbar');
  fb.classList.toggle('on', n > 0);
  document.getElementById('fbCnt').textContent   = n;
  document.getElementById('fbPrice').textContent = t.toLocaleString() + ' د.ع';
}

/* ─────────────────────────────────────────────────────
   13. CART DRAWER
   ───────────────────────────────────────────────── */
function openDrawer()    { renderDrawer(); document.getElementById('dov').classList.add('on'); }
function closeDrawer()   { document.getElementById('dov').classList.remove('on'); }
function closeDrawerOv(e){ if (e.target === document.getElementById('dov')) closeDrawer(); }

function renderDrawer() {
  const body = document.getElementById('dBody');
  const foot = document.getElementById('dFoot');

  if (cart.length === 0) {
    body.innerHTML = `<div class="d-empty">
      <i class="ph-light ph-shopping-cart-simple"></i>
      <p>سلتك فارغة</p>
      <small>أضف أطباقك المفضلة</small>
    </div>`;
    
    // Show suggestions even if empty!
    const emptySuggest = getSuggestions({cat:'grills'}, 3);
    body.innerHTML += `<div class="d-upsell-empty">
      <p class="upsell-title">اقتراحات لك ✨</p>
      <div class="upsell-list">${emptySuggest.map(s => `
        <div class="upsell-mini" onclick="addToCart('${s.id}')">
          <img src="compressed-${s.img}" onerror="this.src='https://via.placeholder.com/40'">
          <span>${s.name}</span>
          <i class="ph-bold ph-plus"></i>
        </div>`).join('')}
      </div>
    </div>`;

    foot.style.display = 'none';
    return;
  }

  foot.style.display = 'block';
  document.getElementById('dCount').textContent = totalN() + ' صنف';
  document.getElementById('dTotal').textContent = totalP().toLocaleString() + ' د.ع';

  const cartItemsHtml = cart.map((c, i) => {
    const imgHtml = c.img
      ? `<img src="compressed-${c.img}" alt="${c.name}" onerror="this.outerHTML='<i class=\\'ph-light ph-fork-knife\\'></i>'">`
      : `<i class="ph-light ph-fork-knife"></i>`;

    return `<div class="citem" style="animation-delay:${i * 0.05}s">
      <div class="citem-img"><i class="ph-light ph-fork-knife"></i></div>
      <div class="citem-info">
        <div class="citem-name">${c.name}</div>
        <div class="citem-sub">${(c.price * c.qty).toLocaleString()} د.ع</div>
        <div class="citem-unit">${c.price.toLocaleString()} د.ع × ${c.qty}</div>
      </div>
      <div class="cqty">
        <button class="qb" onclick="changeQty(${c.id},-1)" aria-label="تقليل"><i class="ph-bold ph-minus"></i></button>
        <span class="qn">${c.qty}</span>
        <button class="qb" onclick="changeQty(${c.id},1)"  aria-label="زيادة"><i class="ph-bold ph-plus"></i></button>
      </div>
      <button class="crem" onclick="removeFromCart(${c.id})" aria-label="حذف"><i class="ph-bold ph-trash-simple"></i></button>
    </div>`;
  }).join('');

  // Add "Complete your meal" upsell in drawer
  const hasDrink = cart.some(c => c.cat === 'soft_drinks');
  const upsellItems = getSuggestions(cart[cart.length-1], 2);
  const upsellHtml = !hasDrink ? `
    <div class="d-upsell">
      <p><i class="ph-fill ph-sparkls"></i> شتحب تشرب ويه وجبتك؟ 🥤</p>
      <div class="upsell-grid">
        ${(DB['soft_drinks'] || []).slice(0, 3).map(d => `
          <button class="up-btn" onclick="addToCart('${d.id}')">
            + ${d.name}
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  body.innerHTML = cartItemsHtml + upsellHtml;
}

/* ─────────────────────────────────────────────────────
   14. CHECKOUT FORM
   ───────────────────────────────────────────────── */
function checkout()      { if (cart.length) { document.getElementById('fov').classList.add('on'); closeDrawer(); } }
function closeForm()     { document.getElementById('fov').classList.remove('on'); }
function closeFormOv(e)  { if (e.target === document.getElementById('fov')) closeForm(); }

function checkBranchMaint(v) {
  if (v === 'الأعظمية') showToast('⚠️ عفواً، فرع الأعظمية تحت الصيانة حالياً.');
}

function sendOrder() {
  const branch = document.getElementById('custBranch').value;
  const name   = document.getElementById('custName').value.trim();
  const phone  = document.getElementById('custPhone').value.trim();

  if (!branch)              { showToast('يرجى اختيار الفرع!'); return; }
  if (branch === 'الأعظمية') { showToast('⚠️ هذا الفرع تحت الصيانة حالياً!'); return; }
  if (!name)                { showToast('يرجى إدخال اسمك!'); return; }
  if (!phone)               { showToast('يرجى إدخال رقم الهاتف!'); return; }

  const branchNumbers = {
    'حي الجامعة': '964775090007',
    'الحارثية':   '9647765090009'
  };

  const now   = new Date();
  let h       = now.getHours(), m = now.getMinutes();
  const ampm  = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  const timeStr = h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;

  let msg = `*طلب جديد — مقهى ابو حالوب* 🟢\n`;
  msg += `📍 *الفرع:* ${branch}\n`;
  msg += `🙋‍♂️ *من:* ${name}\n`;
  msg += `📞 *الرقم:* ${phone}\n`;
  msg += `⏱️ *الوقت:* ${timeStr}\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  cart.forEach(c => {
    msg += `🔸 *${c.qty}×* ${c.name}\n`;
    msg += `   (${(c.price * c.qty).toLocaleString()} د.ع)\n`;
  });
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *الإجمالي:* ${totalP().toLocaleString()} د.ع\n`;

  const waUrl = `https://wa.me/${branchNumbers[branch]}?text=${encodeURIComponent(msg)}`;
  cart = []; updateUI(); renderDrawer(); closeForm();
  window.open(waUrl, '_blank');
  setTimeout(() => openAlert('تم إرسال طلبك بنجاح عبر واتساب.'), 800);
}

/* ─────────────────────────────────────────────────────
   15. ALERTS & TOASTS
   ───────────────────────────────────────────────── */
let alertTimer;
function openAlert(msg) {
  document.getElementById('paMsg').innerHTML = msg;
  document.getElementById('aov').classList.add('on');
  clearTimeout(alertTimer);
  alertTimer = setTimeout(closeAlert, 3500);
}
function closeAlert() { document.getElementById('aov').classList.remove('on'); }

function showToast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('toastTxt').textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2400);
}

/* ─────────────────────────────────────────────────────
   16. SWIPE-TO-CLOSE (Drawers & Modals)
   ───────────────────────────────────────────────── */
function initSwipe(elId, closeFunc) {
  const el      = document.getElementById(elId);
  if (!el) return;
  const content = el.children[0];
  let startY = 0, currentY = 0;

  content.addEventListener('touchstart', e => {
    const target = e.target;
    const body   = target.closest?.('.d-body');
    if (body && body.scrollHeight > body.clientHeight && body.scrollTop > 0) return;
    startY = e.touches[0].clientY;
    content.style.transition = 'none';
  }, { passive: true });

  content.addEventListener('touchmove', e => {
    if (!startY) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) content.style.transform = `translateY(${diff}px)`;
  }, { passive: true });

  content.addEventListener('touchend', () => {
    if (!startY) return;
    const diff = currentY - startY;
    content.style.transition = 'transform .42s cubic-bezier(.16,1,.3,1)';
    if (diff > 120) closeFunc();
    else content.style.transform = '';
    setTimeout(() => content.style.transition = '', 440);
    startY = 0;
  });
}

/* ─────────────────────────────────────────────────────
   17. BOOT
   ───────────────────────────────────────────────── */
function boot() {
  initFirebase();
  initReveal();
  initSwipe('dov', closeDrawer);
  initSwipe('mov', closeModal);
  initSwipe('fov', closeForm);

  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err =>
        console.warn('SW registration failed:', err)
      );
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

