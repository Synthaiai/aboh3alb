/**
 * ╔═══════════════════════════════════════════╗
 * ║   BAGHDAD TECH — Core Script               ║
 * ║   1. Translations Engine                   ║
 * ║   2. Theme Engine                          ║
 * ║   3. Scroll-Reveal (IntersectionObserver)  ║
 * ║   4. Counter Animation                     ║
 * ║   5. Hero Canvas Grid                      ║
 * ║   6. Navigation                            ║
 * ║   7. Form Handler                          ║
 * ╚═══════════════════════════════════════════╝
 */

'use strict';

/* ─────────────────────────────────────────────
   1. TRANSLATIONS ENGINE
   All UI strings in EN + AR. Keys map to
   data-i18n attributes in the HTML.
   ───────────────────────────────────────────── */
const i18n = {
  en: {
    nav_about:        'About',
    nav_services:     'Services',
    nav_portfolio:    'Portfolio',
    nav_contact:      'Contact',
    nav_cta:          'Start Project',

    hero_badge:       'Available for Projects — 2026',
    hero_h1_1:        'We Engineer',
    hero_h1_2:        'Digital Excellence',
    hero_sub:         'Two senior engineers building premium software, stunning interfaces, and smart digital products — from Baghdad to the world.',
    hero_cta_1:       'Explore Services',
    hero_cta_2:       'View Our Work',
    stat_projects:    'Projects Delivered',
    stat_clients:     'Happy Clients',
    stat_years:       'Years Experience',

    about_label:      'About Us',
    about_title:      'Two Engineers.<br>One Vision.',
    about_p1:         'We are Baghdad Tech — a boutique software studio founded by two senior developers with a passion for building exceptional digital experiences. We don\'t just write code; we craft systems that scale.',
    about_p2:         'Our expertise spans full-stack engineering, interface design, and product strategy. Every project we take is treated as our own — with precision, ownership, and relentless attention to quality.',

    services_label:   'What We Do',
    services_title:   'Services Built<br>for Impact',
    services_desc:    'Every service is engineered to deliver measurable value and lasting quality.',

    svc1_h:  'Software Development',
    svc1_p:  'Scalable, high-performance web and mobile applications engineered to enterprise standards.',
    svc1_f1: 'Web Applications',
    svc1_f2: 'REST & GraphQL APIs',
    svc1_f3: 'Cloud Architecture',

    svc2_h:  'UI/UX Design',
    svc2_p:  'Research-driven, pixel-perfect interfaces that convert visitors into loyal users.',
    svc2_f1: 'Design Systems',
    svc2_f2: 'Prototyping & Wireframes',
    svc2_f3: 'User Research',

    svc3_h:  'Product Creation',
    svc3_p:  'End-to-end product development — from discovery and strategy to final launch.',
    svc3_f1: 'MVP Development',
    svc3_f2: 'Product Strategy',
    svc3_f3: 'Growth Engineering',

    svc4_h:  'Digital Menus',
    svc4_p:  'Smart, QR-based digital menu solutions for modern restaurants and cafes.',
    svc4_f1: 'QR Code Menus',
    svc4_f2: 'Real-time Updates',
    svc4_f3: 'Analytics Dashboard',

    portfolio_label:  'Our Work',
    portfolio_title:  'Featured Projects',
    portfolio_desc:   'A curated selection of our most impactful work.',

    p1_tag:   'SaaS Platform',
    p1_title: 'FinFlow Dashboard',
    p1_desc:  'Real-time financial analytics platform with multi-tenant architecture and role-based access.',
    p2_tag:   'Mobile App',
    p2_title: 'DeliverQ',
    p2_desc:  'Food delivery platform with live tracking engine and driver dispatch system.',
    p3_tag:   'Digital Menu',
    p3_title: 'MenuAI',
    p3_desc:  'QR smart menu for 15+ Baghdad restaurants with real-time pricing and analytics.',

    contact_label:     'Get In Touch',
    contact_title:     'Ready to Build Something',
    contact_title_grad:'Exceptional?',
    contact_desc:      'Tell us about your project and we\'ll get back within 24 hours for a free consultation.',

    form_name:         'Your Name',
    form_name_ph:      'Ahmed Al-Rashidi',
    form_email:        'Email Address',
    form_email_ph:     'ahmed@example.com',
    form_service:      'Service Type',
    form_service_ph:   'Choose a service...',
    form_msg:          'Your Message',
    form_msg_ph:       'Tell us about your project...',
    form_send:         'Send Message',

    success_h:         'Message Sent!',
    success_p:         'We\'ll get back to you within 24 hours.',

    footer_tagline:    'Engineering the future from Baghdad.',
    footer_rights:     'All rights reserved.',
  },

  ar: {
    nav_about:        'من نحن',
    nav_services:     'خدماتنا',
    nav_portfolio:    'أعمالنا',
    nav_contact:      'اتصل بنا',
    nav_cta:          'ابدأ مشروعك',

    hero_badge:       'متاحون للمشاريع — 2026',
    hero_h1_1:        'نهندس',
    hero_h1_2:        'التميز الرقمي',
    hero_sub:         'مهندسان متمرسان يبنيان برمجيات متميزة، وواجهات مذهلة، ومنتجات رقمية ذكية — من بغداد إلى العالم.',
    hero_cta_1:       'استكشف الخدمات',
    hero_cta_2:       'تصفح أعمالنا',
    stat_projects:    'مشروع مُسلَّم',
    stat_clients:     'عميل سعيد',
    stat_years:       'سنوات خبرة',

    about_label:      'عن الفريق',
    about_title:      'مهندسان.<br>رؤية واحدة.',
    about_p1:         'نحن بغداد تك — استوديو برمجيات متخصص أسسه مطوران متمرسان شغفهما بناء تجارب رقمية استثنائية. لا نكتب كوداً فقط، نبني أنظمة تنمو وتتطور.',
    about_p2:         'خبرتنا تمتد عبر هندسة الويب المتكاملة، وتصميم الواجهات، واستراتيجية المنتجات. كل مشروع نعتبره ملكنا — بدقة واحترافية لا تهاون فيها.',

    services_label:   'ما نقدمه',
    services_title:   'خدمات مصممة<br>للنجاح',
    services_desc:    'كل خدمة مُصممة لتحقيق قيمة قابلة للقياس وجودة تدوم.',

    svc1_h:  'تطوير البرمجيات',
    svc1_p:  'تطبيقات ويب وموبايل عالية الأداء وقابلة للتوسع بمعايير المؤسسات.',
    svc1_f1: 'تطبيقات الويب',
    svc1_f2: 'واجهات API متقدمة',
    svc1_f3: 'بنية سحابية',

    svc2_h:  'تصميم UI/UX',
    svc2_p:  'واجهات دقيقة ببكسل تحول الزوار إلى مستخدمين مخلصين.',
    svc2_f1: 'أنظمة التصميم',
    svc2_f2: 'النماذج الأولية',
    svc2_f3: 'أبحاث المستخدم',

    svc3_h:  'ابتكار المنتجات',
    svc3_p:  'تطوير منتجات متكامل من الفكرة إلى الإطلاق والنمو.',
    svc3_f1: 'تطوير MVP',
    svc3_f2: 'استراتيجية المنتج',
    svc3_f3: 'هندسة النمو',

    svc4_h:  'المنيو الرقمي',
    svc4_p:  'حلول قوائم طعام ذكية بالـ QR للمطاعم والمقاهي الحديثة.',
    svc4_f1: 'قائمة QR رقمية',
    svc4_f2: 'تحديث فوري',
    svc4_f3: 'لوحة تحكم تحليلية',

    portfolio_label:  'أعمالنا',
    portfolio_title:  'مشاريع مختارة',
    portfolio_desc:   'نماذج مختارة من أكثر مشاريعنا تأثيراً.',

    p1_tag:   'منصة SaaS',
    p1_title: 'لوحة FinFlow',
    p1_desc:  'منصة تحليلات مالية فورية بهندسة متعددة المستأجرين وصلاحيات متطورة.',
    p2_tag:   'تطبيق موبايل',
    p2_title: 'DeliverQ',
    p2_desc:  'منصة توصيل طعام بمحرك تتبع مباشر ونظام إرسال السائقين.',
    p3_tag:   'منيو رقمي',
    p3_title: 'MenuAI',
    p3_desc:  'قائمة طعام ذكية بـ QR لأكثر من 15 مطعماً في بغداد.',

    contact_label:     'تواصل معنا',
    contact_title:     'مستعد لبناء شيء',
    contact_title_grad:'استثنائي؟',
    contact_desc:      'أخبرنا عن مشروعك وسنرد عليك خلال 24 ساعة للحصول على استشارة مجانية.',

    form_name:         'اسمك',
    form_name_ph:      'أحمد الراشدي',
    form_email:        'البريد الإلكتروني',
    form_email_ph:     'ahmed@example.com',
    form_service:      'نوع الخدمة',
    form_service_ph:   'اختر خدمة...',
    form_msg:          'رسالتك',
    form_msg_ph:       'أخبرنا عن مشروعك...',
    form_send:         'أرسل الرسالة',

    success_h:         'تم إرسال الرسالة!',
    success_p:         'سنرد عليك خلال 24 ساعة.',

    footer_tagline:    'نهندس المستقبل من بغداد.',
    footer_rights:     'جميع الحقوق محفوظة.',
  }
};

/* ─────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────── */
const state = {
  lang:  localStorage.getItem('btLang')  || 'en',
  theme: localStorage.getItem('btTheme') || 'light',
};

/* ─────────────────────────────────────────────
   2. LANGUAGE ENGINE
   ───────────────────────────────────────────── */
function applyLanguage(lang) {
  const t = i18n[lang];

  // Set document direction & lang attr
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Update lang toggle label
  document.getElementById('langLabel').textContent = lang === 'en' ? 'AR' : 'EN';

  // Persist
  localStorage.setItem('btLang', lang);
  state.lang = lang;
}

/* ─────────────────────────────────────────────
   3. THEME ENGINE
   ───────────────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);

  const sunIcon  = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  if (theme === 'dark') {
    sunIcon.style.display  = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display  = 'block';
    moonIcon.style.display = 'none';
  }

  localStorage.setItem('btTheme', theme);
  state.theme = theme;
}

/* ─────────────────────────────────────────────
   4. SCROLL REVEAL (IntersectionObserver)
   Deferred with rAF so browser finishes layout
   before observer checks element positions.
   ───────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const activate = (el) => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('active'), delay);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        activate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    /* No negative rootMargin — allows in-viewport elements to trigger */
    { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
  );

  /* Wait two frames so browser has computed layout */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      revealEls.forEach(el => observer.observe(el));

      /* Hard fallback: after 800ms reveal anything still hidden */
      setTimeout(() => {
        revealEls.forEach(el => {
          if (!el.classList.contains('active')) activate(el);
        });
      }, 800);
    });
  });
}

/* ─────────────────────────────────────────────
   5. COUNTER ANIMATION (Hero Stats)
   ───────────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;

  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeOutExpo
    const eased    = 1 - Math.pow(2, -10 * progress);
    const current  = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counterEls = document.querySelectorAll('.hero__stat-num[data-count]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   6. HERO CANVAS GRID
   Draws a subtle animated dot/grid overlay
   ───────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let width, height, dots;

  const DOT_SPACING = 36;
  const DOT_RADIUS  = 1.2;

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    for (let x = 0; x <= width; x += DOT_SPACING) {
      for (let y = 0; y <= height; y += DOT_SPACING) {
        dots.push({ x, y, alpha: 0.08 + Math.random() * 0.12 });
      }
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    frame++;

    // Determine base color from theme
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const dotColor = isDark ? '248,250,252' : '15,23,42';

    dots.forEach((d, i) => {
      // Subtle wave
      const wave = Math.sin(frame * 0.015 + i * 0.3) * 0.04;
      const alpha = d.alpha + wave;
      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor},${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
}

/* ─────────────────────────────────────────────
   7. NAVIGATION
   - Scroll shadow
   - Hamburger menu
   ───────────────────────────────────────────── */
function initNavigation() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');

  // Scroll shadow
  const scrollHandler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close drawer on link click
  drawer.querySelectorAll('.nav__drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ─────────────────────────────────────────────
   8. FORM HANDLER
   ───────────────────────────────────────────── */
function initForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('formSubmitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('[required]');
    let valid = true;
    inputs.forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = '#f87171';
        valid = false;
      }
    });
    if (!valid) return;

    // Loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = '...';

    // Simulate async submission (replace with real endpoint)
    await new Promise(resolve => setTimeout(resolve, 1200));

    form.hidden        = true;
    successMsg.hidden  = false;

    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = originalText;
  });
}

/* ─────────────────────────────────────────────
   BOOT — Initialize everything on DOM ready
   ───────────────────────────────────────────── */
function boot() {
  // Apply saved preferences immediately (no flash)
  applyTheme(state.theme);
  applyLanguage(state.lang);

  // Wire up controls
  document.getElementById('themeBtn').addEventListener('click', () => {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
  });

  document.getElementById('langBtn').addEventListener('click', () => {
    applyLanguage(state.lang === 'en' ? 'ar' : 'en');
  });

  // Init modules
  initNavigation();
  initScrollReveal();
  initCounters();
  initHeroCanvas();
  initForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
