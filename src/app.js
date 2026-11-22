const WHATSAPP_NUMBER = '6281291309007';

const SPICE_DESCRIPTIONS = {
  0: 'Level 0: Tanpa cabai, tetap gurih manis atau asin autentik.',
  1: 'Level 1: Pedas tipis-tipis yang hangat dan nagih.',
  3: 'Level 3: Pedas sedang pas mantap — favorit mayoritas pelanggan.',
  6: 'Level 6: Pedas nampol dengan aroma cabai segar yang kuat.',
  8: 'Level 8: Pedas maksimal paling ekstrem untuk penantang sejati.',
};

const REGIONAL_OUTLETS = {
  Jabodetabek: {
    cities: 'Jakarta Selatan · Jakarta Barat · Bekasi · Depok · Tangerang · Bogor',
    flagshipArea: 'Tebet, Kemang, Margonda Depok, Summarecon Bekasi, Gading Serpong',
    hours: '10.00 – 22.00 WIB (Beberapa gerai 24 jam)',
    services: 'Dine-in · Takeaway · Parkir Luas · Order WA Rombongan',
    mapsQuery: 'https://www.google.com/maps/search/Mie+Gacoan+Jabodetabek',
  },
  'Jawa Barat': {
    cities: 'Bandung · Cimahi · Cirebon · Tasikmalaya · Karawang · Sukabumi',
    flagshipArea: 'Dago, Buahbatu, Setiabudi Bandung, Jalan Cipto Cirebon',
    hours: '10.00 – 22.00 WIB',
    services: 'Dine-in · Takeaway · Area Nongkrong Outdoor',
    mapsQuery: 'https://www.google.com/maps/search/Mie+Gacoan+Bandung',
  },
  'Jawa Tengah & DIY': {
    cities: 'Yogyakarta · Sleman · Solo · Semarang · Purwokerto · Magelang',
    flagshipArea: 'Gejayan, Babarsari Yogyakarta, Slamet Riyadi Solo, Pandanaran Semarang',
    hours: '10.00 – 22.00 WIB',
    services: 'Dine-in · Takeaway · Ramah Mahasiswa & Komunitas',
    mapsQuery: 'https://www.google.com/maps/search/Mie+Gacoan+Yogyakarta',
  },
  'Jawa Timur': {
    cities: 'Surabaya · Malang · Sidoarjo · Kediri · Jember · Madiun',
    flagshipArea: 'Darmo Surabaya, Soekarno-Hatta Malang, Ambengan, Sidoarjo Kota',
    hours: '10.00 – 23.00 WIB',
    services: 'Dine-in · Takeaway · Pusat Kelahiran Konsep Gacoan',
    mapsQuery: 'https://www.google.com/maps/search/Mie+Gacoan+Surabaya+Malang',
  },
  'Bali & Sumatra': {
    cities: 'Denpasar · Badung · Medan · Palembang · Lampung · Pekanbaru',
    flagshipArea: 'Renon Denpasar, Teuku Umar Bali, Ringroad Medan, Demang Palembang',
    hours: '10.00 – 22.00 WITA / WIB',
    services: 'Dine-in · Takeaway · Area Keluarga & Wisatawan',
    mapsQuery: 'https://www.google.com/maps/search/Mie+Gacoan+Denpasar+Medan',
  },
};

const state = {
  selectedLevel: 3,
  cart: [],
};

function formatRupiah(amount) {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

function syncCanonicalMetadata() {
  const canonicalUrl = window.location.origin + window.location.pathname;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalUrl);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
    });
  }
}

function setupImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const box = document.createElement('div');
      box.className = 'img-fallback-box';
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', img.getAttribute('alt') || 'Mie Gacoan');
      box.textContent = img.getAttribute('data-fallback') || 'Mie Gacoan Indonesia';
      img.replaceWith(box);
    });
  });
}

function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileMenu');
  if (!toggleBtn || !drawer) return;

  const setOpen = (isOpen) => {
    drawer.hidden = !isOpen;
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  };

  toggleBtn.addEventListener('click', () => {
    setOpen(drawer.hidden);
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function setupSpiceSelector() {
  const buttons = document.querySelectorAll('.spice-btn[data-level]');
  const descEl = document.getElementById('spiceDescText');
  const directWaBtn = document.getElementById('directComboWaBtn');
  const addComboBtn = document.getElementById('addFeaturedComboBtn');
  const spiceCardBtns = document.querySelectorAll('.btn-card-add[data-has-spice="true"]');

  const applyLevel = (level) => {
    state.selectedLevel = level;

    buttons.forEach((btn) => {
      const btnLevel = Number(btn.getAttribute('data-level'));
      btn.setAttribute('aria-checked', String(btnLevel === level));
    });

    if (descEl && SPICE_DESCRIPTIONS[level]) {
      descEl.textContent = SPICE_DESCRIPTIONS[level];
    }

    if (directWaBtn) {
      const msg = encodeURIComponent(
        `Halo Mie Gacoan! Saya ingin pesan Mie Gacoan Special Combo dengan Level ${level}.`
      );
      directWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    }

    if (addComboBtn) {
      addComboBtn.setAttribute('data-spice', String(level));
    }

    spiceCardBtns.forEach((btn) => {
      const label = btn.querySelector('.btn-card-add-label');
      if (label) {
        label.textContent = `Tambah (Lvl ${level})`;
      }
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = Number(btn.getAttribute('data-level'));
      applyLevel(level);
    });
  });

  applyLevel(state.selectedLevel);
}

function setupMenuFilter() {
  const tabs = document.querySelectorAll('.tab-btn[data-filter]');
  const cards = document.querySelectorAll('.menu-card[data-category]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        card.hidden = filter !== 'all' && cat !== filter;
      });
    });
  });
}

function setupCartDrawer() {
  const overlay = document.getElementById('orderDrawerOverlay');
  const backdrop = document.getElementById('orderDrawerBackdrop');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const openDesktopBtn = document.getElementById('openCartDesktopBtn');
  const openMobileBtn = document.getElementById('openCartMobileBtn');
  const emptyCtaLink = document.getElementById('drawerEmptyMenuLink');
  const clearBtn = document.getElementById('clearCartBtn');
  const nameInput = document.getElementById('drawerCustomerName');
  const cityInput = document.getElementById('drawerCityArea');

  const cartListEl = document.getElementById('cartList');
  const emptyEl = document.getElementById('drawerEmptyState');
  const inputsEl = document.getElementById('drawerInputs');
  const footerEl = document.getElementById('drawerFooter');
  const drawerTitleEl = document.getElementById('order-drawer-title');
  const subtotalEl = document.getElementById('drawerSubtotal');
  const checkoutLinkEl = document.getElementById('drawerCheckoutWaLink');
  const headerDesktopLabel = document.getElementById('headerDesktopCartLabel');
  const headerMobileCount = document.getElementById('headerMobileCartCount');

  const openDrawer = () => {
    if (!overlay) return;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
  };

  const buildWaHref = (subtotal) => {
    const lines = state.cart.map((entry) => {
      const levelPart = entry.spiceLevel !== undefined ? ` (Level ${entry.spiceLevel})` : '';
      return `- ${entry.qty}x ${entry.name}${levelPart} — ${formatRupiah(entry.price * entry.qty)}`;
    });

    const customerName = nameInput ? nameInput.value.trim() : '';
    const cityArea = cityInput ? cityInput.value.trim() : '';

    const text = [
      'Halo Mie Gacoan! Saya ingin memesan:',
      ...lines,
      `Total Estimasi: ${formatRupiah(subtotal)}`,
      customerName ? `Nama Pemesan: ${customerName}` : '',
      cityArea ? `Area / Kota: ${cityArea}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const renderCart = () => {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (headerDesktopLabel) {
      headerDesktopLabel.textContent = totalCount > 0 ? `Keranjang (${totalCount})` : 'Pesan Sekarang';
    }
    if (headerMobileCount) {
      headerMobileCount.textContent = totalCount > 0 ? String(totalCount) : 'Pesan';
    }
    if (drawerTitleEl) {
      drawerTitleEl.textContent = `Keranjang Pesanan (${totalCount})`;
    }

    const isEmpty = state.cart.length === 0;
    if (emptyEl) emptyEl.hidden = !isEmpty;
    if (inputsEl) inputsEl.hidden = isEmpty;
    if (footerEl) footerEl.hidden = isEmpty;
    if (cartListEl) cartListEl.innerHTML = '';

    if (!isEmpty && cartListEl) {
      state.cart.forEach((entry) => {
        const li = document.createElement('li');
        li.className = 'cart-item';

        const info = document.createElement('div');
        const title = document.createElement('p');
        title.className = 'font-display';
        title.style.fontSize = '0.875rem';
        title.style.fontWeight = '700';
        title.textContent = entry.name;

        const meta = document.createElement('p');
        meta.style.fontSize = '0.75rem';
        meta.style.color = '#71717a';
        meta.style.marginTop = '0.25rem';
        const spiceText =
          entry.spiceLevel !== undefined ? `Level Pedas ${entry.spiceLevel}` : entry.categoryLabel;
        meta.textContent = `${spiceText} · ${formatRupiah(entry.price)}`;

        info.append(title, meta);

        const controls = document.createElement('div');
        controls.className = 'cart-qty-controls';

        const decBtn = document.createElement('button');
        decBtn.type = 'button';
        decBtn.className = 'qty-btn';
        decBtn.setAttribute('aria-label', `Kurangi jumlah ${entry.name}`);
        decBtn.textContent = '−';
        decBtn.addEventListener('click', () => updateQty(entry.key, -1));

        const qtyVal = document.createElement('span');
        qtyVal.className = 'font-mono tabular-nums';
        qtyVal.style.width = '1.5rem';
        qtyVal.style.textAlign = 'center';
        qtyVal.style.fontSize = '0.875rem';
        qtyVal.style.fontWeight = '600';
        qtyVal.textContent = String(entry.qty);

        const incBtn = document.createElement('button');
        incBtn.type = 'button';
        incBtn.className = 'qty-btn';
        incBtn.setAttribute('aria-label', `Tambah jumlah ${entry.name}`);
        incBtn.textContent = '+';
        incBtn.addEventListener('click', () => updateQty(entry.key, 1));

        controls.append(decBtn, qtyVal, incBtn);
        li.append(info, controls);
        cartListEl.appendChild(li);
      });
    }

    if (subtotalEl) {
      subtotalEl.textContent = formatRupiah(subtotal);
    }
    if (checkoutLinkEl) {
      checkoutLinkEl.href = buildWaHref(subtotal);
    }
  };

  const addToCart = (item) => {
    const key =
      item.spiceLevel !== undefined ? `${item.id}-lvl-${item.spiceLevel}` : item.id;
    const existing = state.cart.find((entry) => entry.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ ...item, key, qty: 1 });
    }
    renderCart();
    openDrawer();
  };

  const updateQty = (key, delta) => {
    state.cart = state.cart
      .map((entry) => (entry.key === key ? { ...entry, qty: entry.qty + delta } : entry))
      .filter((entry) => entry.qty > 0);
    renderCart();
  };

  document.querySelectorAll('[data-add-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price'));
      const categoryLabel = btn.getAttribute('data-category-label') || 'Menu Mie Gacoan';
      const hasSpice = btn.getAttribute('data-has-spice') === 'true';

      addToCart({
        id,
        name,
        price,
        categoryLabel,
        spiceLevel: hasSpice ? state.selectedLevel : undefined,
      });
    });
  });

  if (openDesktopBtn) openDesktopBtn.addEventListener('click', openDrawer);
  if (openMobileBtn) openMobileBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  if (emptyCtaLink) emptyCtaLink.addEventListener('click', closeDrawer);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.cart = [];
      renderCart();
    });
  }

  const updateWaLinkOnly = () => {
    if (!checkoutLinkEl) return;
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    checkoutLinkEl.href = buildWaHref(subtotal);
  };

  if (nameInput) nameInput.addEventListener('input', updateWaLinkOnly);
  if (cityInput) cityInput.addEventListener('input', updateWaLinkOnly);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeDrawer();
    }
  });

  renderCart();
}

function setupFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger[aria-controls]');

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('aria-controls');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      triggers.forEach((other) => {
        const otherPanelId = other.getAttribute('aria-controls');
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
        other.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!isExpanded && panelId) {
        const targetPanel = document.getElementById(panelId);
        btn.setAttribute('aria-expanded', 'true');
        if (targetPanel) targetPanel.hidden = false;
      }
    });
  });
}

function setupRegionalDirectory() {
  const tabs = document.querySelectorAll('.geo-tab-btn[data-region]');
  const regionNameEl = document.getElementById('geoRegionTitle');
  const citiesEl = document.getElementById('geoCities');
  const flagshipEl = document.getElementById('geoFlagship');
  const hoursEl = document.getElementById('geoHours');
  const servicesEl = document.getElementById('geoServices');
  const mapsLinkEl = document.getElementById('geoMapsLink');
  const mapsLabelEl = document.getElementById('geoMapsLabel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const region = tab.getAttribute('data-region');
      const data = region ? REGIONAL_OUTLETS[region] : null;
      if (!data) return;

      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));

      if (regionNameEl) regionNameEl.textContent = `Kota Layanan (${region})`;
      if (citiesEl) citiesEl.textContent = data.cities;
      if (flagshipEl) flagshipEl.textContent = data.flagshipArea;
      if (hoursEl) hoursEl.textContent = data.hours;
      if (servicesEl) servicesEl.textContent = data.services;
      if (mapsLinkEl) mapsLinkEl.href = data.mapsQuery;
      if (mapsLabelEl) mapsLabelEl.textContent = `Cari Cabang ${region} di Google Maps`;
    });
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  const nameEl = document.getElementById('contactName');
  const phoneEl = document.getElementById('contactPhone');
  const messageEl = document.getElementById('contactMessage');
  const errorEl = document.getElementById('contactFormError');
  const successBox = document.getElementById('contactSuccessBox');
  const waLink = document.getElementById('contactWaLink');

  if (!form || !nameEl || !phoneEl || !messageEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const message = messageEl.value.trim();

    if (name.length < 2 || phone.length < 8 || message.length < 5) {
      if (errorEl) {
        errorEl.textContent = 'Mohon lengkapi nama, nomor WhatsApp aktif, dan detail pesan Anda.';
        errorEl.hidden = false;
      }
      if (successBox) successBox.hidden = true;
      return;
    }

    if (errorEl) errorEl.hidden = true;
    const waText = encodeURIComponent(
      `Halo Mie Gacoan, nama saya ${name} (${phone}). Pesan: ${message}`
    );
    if (waLink) {
      waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
    }
    if (successBox) {
      successBox.hidden = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  syncCanonicalMetadata();
  registerServiceWorker();
  setupImageFallbacks();
  setupMobileMenu();
  setupSpiceSelector();
  setupMenuFilter();
  setupCartDrawer();
  setupFaqAccordion();
  setupRegionalDirectory();
  setupContactForm();
});
