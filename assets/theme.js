/**
 * SIN'S COFFEE — Ultra-Luxury Shopify Store Theme Controller
 * Architecture: Shopify Online Store 2.0 Native Commerce & Cart APIs
 */

(function () {
  'use strict';

  // State Management
  const SinsState = {
    cart: {
      item_count: 0,
      total_price: 0,
      items: []
    },
    freeShippingThreshold: 4500 // £45 in pence
  };

  document.addEventListener('DOMContentLoaded', initTheme);

  function initTheme() {
    initDrawersAndModals();
    initAjaxCart();
    initProductSlider();
    initProcessTabs();
    initPDPInteractions();
    fetchCurrentCart();
  }

  /* ==========================================================================
     1. DRAWERS & MODALS (Cart, Search, Mobile Nav)
     ========================================================================== */

  function initDrawersAndModals() {
    // Cart Drawer Open/Close
    document.querySelectorAll('[data-drawer-open="sins-cart-drawer"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer('sins-cart-drawer');
      });
    });

    document.querySelectorAll('[data-drawer-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer('sins-cart-drawer');
      });
    });

    // Mobile Menu Open/Close
    const mobileMenuOpenBtn = document.querySelector('[data-mobile-menu-open]');
    const mobileMenuCloseBtn = document.querySelector('[data-mobile-menu-close]');
    const mobileMenu = document.getElementById('sins-mobile-menu');

    if (mobileMenuOpenBtn && mobileMenu) {
      mobileMenuOpenBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (mobileMenuCloseBtn && mobileMenu) {
      mobileMenuCloseBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Search Modal Open/Close
    const searchModal = document.getElementById('sins-search-modal');
    const searchOpenBtns = document.querySelectorAll('[data-search-open]');
    const searchCloseBtns = document.querySelectorAll('[data-search-close]');

    searchOpenBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchModal) {
          searchModal.classList.add('active');
          const input = searchModal.querySelector('input[type="search"]');
          if (input) setTimeout(() => input.focus(), 200);
          document.body.style.overflow = 'hidden';
        }
      });
    });

    searchCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchModal) {
          searchModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Escape Key Listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer('sins-cart-drawer');
        if (searchModal) searchModal.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  function openDrawer(id) {
    const drawer = document.getElementById(id);
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer(id) {
    const drawer = document.getElementById(id);
    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     2. SHOPIFY AJAX CART ENGINE
     ========================================================================== */

  function initAjaxCart() {
    // Quick Add buttons
    document.addEventListener('click', (e) => {
      const quickAddBtn = e.target.closest('[data-action="quick-add"]');
      if (quickAddBtn) {
        e.preventDefault();
        const variantId = quickAddBtn.dataset.variantId;
        const title = quickAddBtn.dataset.productTitle || 'Signature Reserve';
        const price = parseInt(quickAddBtn.dataset.productPrice, 10) || 1800;
        const image = quickAddBtn.dataset.productImage || '';
        
        addToCart(variantId, 1, { title, price, image });
      }
    });

    // Product detail page form submission
    const pdpForm = document.getElementById('sinsProductForm');
    if (pdpForm) {
      pdpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const variantIdInput = document.getElementById('pdpVariantId');
        const qtyInput = document.getElementById('pdpQuantity');
        const variantId = variantIdInput ? variantIdInput.value : 'mock-var-1';
        const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        
        const title = document.querySelector('.sins-pdp-title')?.textContent || 'Monsoon Malabar Reserve';
        const priceStr = document.getElementById('pdpPrice')?.textContent || '£18.00';
        const price = Math.round(parseFloat(priceStr.replace(/[^0-9.]/g, '')) * 100) || 1800;
        const image = document.getElementById('pdpMainImage')?.src || '';

        addToCart(variantId, qty, { title, price, image });
      });
    }

    // Cart Drawer Line Item Actions (delegated)
    const cartContainer = document.querySelector('[data-cart-items-container]');
    if (cartContainer) {
      cartContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-action="remove-item"]');
        if (removeBtn) {
          const key = removeBtn.dataset.key;
          changeCartItem(key, 0);
          return;
        }

        const incBtn = e.target.closest('[data-action="increase-qty"]');
        if (incBtn) {
          const key = incBtn.dataset.key;
          const currentQty = parseInt(incBtn.parentElement.querySelector('.sins-qty-val').textContent, 10);
          changeCartItem(key, currentQty + 1);
          return;
        }

        const decBtn = e.target.closest('[data-action="decrease-qty"]');
        if (decBtn) {
          const key = decBtn.dataset.key;
          const currentQty = parseInt(decBtn.parentElement.querySelector('.sins-qty-val').textContent, 10);
          changeCartItem(key, Math.max(0, currentQty - 1));
          return;
        }
      });
    }
  }

  // Fetch current live Shopify Cart
  function fetchCurrentCart() {
    fetch('/cart.js')
      .then(res => {
        if (!res.ok) throw new Error('Live Shopify cart endpoint not active');
        return res.json();
      })
      .then(cart => {
        updateCartState(cart);
      })
      .catch(() => {
        // Local preview fallback state
        updateCartUI();
      });
  }

  // Add Item
  function addToCart(variantId, quantity, metadata) {
    const payload = {
      id: variantId,
      quantity: quantity
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Not running on live Shopify backend');
        return res.json();
      })
      .then(() => {
        fetchCurrentCart();
        openDrawer('sins-cart-drawer');
      })
      .catch(() => {
        // Fallback for seamless local preview & testing
        handleLocalCartAdd(variantId, quantity, metadata);
        openDrawer('sins-cart-drawer');
      });
  }

  // Change Item Quantity
  function changeCartItem(key, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
      .then(res => {
        if (!res.ok) throw new Error('Not running on live Shopify backend');
        return res.json();
      })
      .then(cart => {
        updateCartState(cart);
      })
      .catch(() => {
        handleLocalCartChange(key, quantity);
      });
  }

  function updateCartState(cart) {
    SinsState.cart = cart;
    updateCartUI();
  }

  // Local state helpers for interactive preview testing
  function handleLocalCartAdd(variantId, quantity, metadata) {
    const existing = SinsState.cart.items.find(item => item.id === variantId);
    if (existing) {
      existing.quantity += quantity;
      existing.final_line_price = existing.quantity * existing.final_price;
    } else {
      SinsState.cart.items.push({
        id: variantId,
        key: variantId + '_' + Date.now(),
        title: metadata.title || 'Signature Reserve',
        final_price: metadata.price || 1800,
        final_line_price: (metadata.price || 1800) * quantity,
        quantity: quantity,
        image: metadata.image || 'assets/coffee-tin-monsoon.jpg',
        variant_title: '250g • Whole Bean'
      });
    }

    recalcLocalCart();
    updateCartUI();
  }

  function handleLocalCartChange(key, quantity) {
    if (quantity === 0) {
      SinsState.cart.items = SinsState.cart.items.filter(item => item.key !== key && item.id !== key);
    } else {
      const item = SinsState.cart.items.find(item => item.key === key || item.id === key);
      if (item) {
        item.quantity = quantity;
        item.final_line_price = item.quantity * item.final_price;
      }
    }
    recalcLocalCart();
    updateCartUI();
  }

  function recalcLocalCart() {
    SinsState.cart.item_count = SinsState.cart.items.reduce((acc, item) => acc + item.quantity, 0);
    SinsState.cart.total_price = SinsState.cart.items.reduce((acc, item) => acc + item.final_line_price, 0);
  }

  // Update Cart UI components
  function updateCartUI() {
    // 1. Badge counters
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = SinsState.cart.item_count;
    });

    // 2. Subtotal
    const subtotalFormatted = formatMoney(SinsState.cart.total_price);
    document.querySelectorAll('[data-cart-subtotal]').forEach(el => {
      el.textContent = subtotalFormatted;
    });

    // 3. Shipping threshold bar
    const shippingBar = document.querySelector('[data-shipping-threshold]');
    if (shippingBar) {
      const thresholdPence = (parseInt(shippingBar.dataset.shippingThreshold, 10) || 45) * 100;
      const progressFill = shippingBar.querySelector('[data-shipping-progress]');
      const shippingText = shippingBar.querySelector('[data-shipping-text]');

      const percent = Math.min(100, Math.round((SinsState.cart.total_price / thresholdPence) * 100));
      if (progressFill) progressFill.style.width = percent + '%';

      if (shippingText) {
        if (SinsState.cart.total_price >= thresholdPence) {
          shippingText.innerHTML = '<span class="unlocked">✓ COMPLIMENTARY UK COURIER DELIVERY UNLOCKED</span>';
        } else {
          const remaining = thresholdPence - SinsState.cart.total_price;
          shippingText.innerHTML = `ADD <strong>${formatMoney(remaining)}</strong> MORE FOR COMPLIMENTARY UK DELIVERY`;
        }
      }
    }

    // 4. Render Items inside Cart Drawer
    const itemsContainer = document.querySelector('[data-cart-items-container]');
    const cartFooter = document.querySelector('[data-cart-footer]');

    if (itemsContainer) {
      if (SinsState.cart.items.length === 0) {
        if (cartFooter) cartFooter.style.display = 'none';
        itemsContainer.innerHTML = `
          <div class="sins-cart-empty">
            <div class="sins-cart-empty__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 1.48 1.95 3.82 3.29 6.79 3.72v6zm6.79-6.14c-1.48-1.95-3.82-3.29-6.79-3.72V4.07c3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79z"/>
              </svg>
            </div>
            <h3 class="sins-cart-empty__title">YOUR SELECTION IS EMPTY</h3>
            <p class="sins-cart-empty__text">Explore our signature Indian coffee heritage beans and artisan roasts.</p>
            <a href="/collections/all" class="sins-btn sins-btn--gold" data-drawer-close>
              EXPLORE THE COLLECTION
            </a>
          </div>
        `;
      } else {
        if (cartFooter) cartFooter.style.display = 'block';
        itemsContainer.innerHTML = `
          <div class="sins-cart-items">
            ${SinsState.cart.items.map(item => `
              <div class="sins-cart-item" data-line-item-key="${item.key || item.id}">
                <div class="sins-cart-item__image">
                  <img src="${item.image}" alt="${item.title}" width="80" height="100">
                </div>
                <div class="sins-cart-item__info">
                  <div class="sins-cart-item__header">
                    <h4 class="sins-cart-item__title">${item.title}</h4>
                    <button type="button" class="sins-cart-item__remove" data-action="remove-item" data-key="${item.key || item.id}">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                  ${item.variant_title ? `<div class="sins-cart-item__variant">${item.variant_title}</div>` : ''}
                  <div class="sins-cart-item__price">${formatMoney(item.final_line_price || item.final_price)}</div>
                  <div class="sins-cart-item__qty-row">
                    <div class="sins-qty-control">
                      <button type="button" class="sins-qty-btn" data-action="decrease-qty" data-key="${item.key || item.id}">−</button>
                      <span class="sins-qty-val">${item.quantity}</span>
                      <button type="button" class="sins-qty-btn" data-action="increase-qty" data-key="${item.key || item.id}">+</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }
  }

  function formatMoney(cents) {
    return '£' + (cents / 100).toFixed(2);
  }

  /* ==========================================================================
     3. SIGNATURE COLLECTION HORIZONTAL SLIDER & FILTERING
     ========================================================================== */

  function initProductSlider() {
    const track = document.getElementById('sinsProductTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const progressFill = document.getElementById('sliderProgressFill');

    if (!track) return;

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 360, behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -360, behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0 && progressFill) {
        const percent = Math.min(100, Math.max(10, Math.round((track.scrollLeft / maxScroll) * 100)));
        progressFill.style.width = percent + '%';
      }
    }, { passive: true });

    // Category Tabs Filtering
    const tabs = document.querySelectorAll('.sins-cat-tab');
    const items = track.querySelectorAll('.sins-slider-item');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     4. COFFEE PROCESS 5-STEP JOURNEY
     ========================================================================== */

  function initProcessTabs() {
    const tabs = document.querySelectorAll('.sins-step-tab');
    const panels = document.querySelectorAll('.sins-stage-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const step = tab.dataset.step;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPanel = document.querySelector(`.sins-stage-panel[data-stage="${step}"]`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     5. PRODUCT DETAIL PAGE (PDP) INTERACTIVITY
     ========================================================================== */

  function initPDPInteractions() {
    // Weight & Grind Pill Selectors
    const weightPills = document.querySelectorAll('.sins-pill-selector[data-option="weight"] .sins-pill-btn');
    const grindPills = document.querySelectorAll('.sins-pill-selector[data-option="grind"] .sins-pill-btn');

    weightPills.forEach(pill => {
      pill.addEventListener('click', () => {
        weightPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const weightVal = pill.dataset.value;
        const selectedWeightLabel = document.getElementById('selectedWeight');
        if (selectedWeightLabel) selectedWeightLabel.textContent = weightVal;

        // Dynamic price update based on weight
        const price = parseInt(pill.dataset.price, 10);
        if (price) {
          const formatted = formatMoney(price);
          const pdpPrice = document.getElementById('pdpPrice');
          const pdpBtnPrice = document.getElementById('pdpBtnPrice');
          if (pdpPrice) pdpPrice.textContent = formatted;
          if (pdpBtnPrice) pdpBtnPrice.textContent = formatted;
        }
      });
    });

    grindPills.forEach(pill => {
      pill.addEventListener('click', () => {
        grindPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const grindVal = pill.dataset.value;
        const selectedGrindLabel = document.getElementById('selectedGrind');
        if (selectedGrindLabel) selectedGrindLabel.textContent = grindVal;
      });
    });

    // Quantity Inc/Dec
    const qtyInput = document.getElementById('pdpQuantity');
    const qtyInc = document.getElementById('pdpQtyInc');
    const qtyDec = document.getElementById('pdpQtyDec');

    if (qtyInc && qtyInput) {
      qtyInc.addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value, 10) + 1;
      });
    }

    if (qtyDec && qtyInput) {
      qtyDec.addEventListener('click', () => {
        const val = parseInt(qtyInput.value, 10);
        if (val > 1) qtyInput.value = val - 1;
      });
    }

    // Thumbnails Click
    const thumbs = document.querySelectorAll('.sins-thumb');
    const mainImg = document.getElementById('pdpMainImage');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg) {
          mainImg.src = thumb.dataset.src;
        }
      });
    });

    // Buy Now Button
    const buyNowBtn = document.getElementById('pdpBuyNow');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        const variantId = document.getElementById('pdpVariantId')?.value || '1';
        window.location.href = `/cart/${variantId}:1`;
      });
    }
  }

})();

