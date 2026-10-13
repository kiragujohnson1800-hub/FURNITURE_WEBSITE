```javascript
/* Haven & Oak Furniture — shared storefront interactions */
(() => {
  "use strict";

  const CART_KEY = "havenOakCart";
  const COUPON_KEY = "havenOakCoupon";

  const money = value => new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

  // Furniture catalogue
  const products = [
    {
      id: "oslo-sofa",
      name: "Oslo Comfort Sofa",
      category: "sofas",
      price: 68900,
      oldPrice: 79900,
      badge: "Best seller",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
      description: "A generous, inviting sofa with clean lines and a supportive seat."
    },
    {
      id: "luna-chair",
      name: "Luna Lounge Chair",
      category: "chairs",
      price: 28900,
      badge: "New arrival",
      rating: 4.7,
      reviews: 68,
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85",
      description: "A sculptural accent chair made for slow mornings and good books."
    },
    {
      id: "sora-dining",
      name: "Sora Dining Table",
      category: "tables",
      price: 54900,
      badge: "Craft favourite",
      rating: 4.9,
      reviews: 53,
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=85",
      description: "A solid-wood centrepiece for meals, conversations, and celebrations."
    },
    {
      id: "haven-bed",
      name: "Haven Platform Bed",
      category: "beds",
      price: 74900,
      badge: "Natural finish",
      rating: 4.8,
      reviews: 82,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
      description: "A calm, low-profile bed with warm wood details and timeless appeal."
    },
    {
      id: "milo-desk",
      name: "Milo Work Desk",
      category: "tables",
      price: 31900,
      badge: "Small-space pick",
      rating: 4.6,
      reviews: 41,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
      description: "A compact desk that gives your workday a considered place to land."
    },
    {
      id: "aria-shelf",
      name: "Aria Open Shelf",
      category: "storage",
      price: 24900,
      badge: "Versatile",
      rating: 4.5,
      reviews: 36,
      image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85",
      description: "Open shelving for the books, objects, and memories you love."
    },
    {
      id: "nordic-sofa",
      name: "Nordic Two-Seater",
      category: "sofas",
      price: 58900,
      badge: "Sale",
      rating: 4.7,
      reviews: 97,
      image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=85",
      description: "A relaxed two-seater with understated proportions and soft upholstery."
    },
    {
      id: "elm-chair",
      name: "Elm Dining Chair",
      category: "chairs",
      price: 12900,
      badge: "Easy pairing",
      rating: 4.6,
      reviews: 29,
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85",
      description: "A light, sturdy dining chair with a warm natural finish."
    }
  ];

  // Read the saved cart safely
  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  // Save cart and refresh the cart counter
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const count = readCart().reduce((sum, item) => sum + item.qty, 0);

    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.textContent = count;
      el.classList.toggle("hidden", count === 0);
      el.setAttribute("aria-label", `${count} items in cart`);
    });
  }

  // Add furniture to the cart
  function addToCart(id, qty = 1, color = "Natural") {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const cart = readCart();
    const existing = cart.find(item => item.id === id && item.color === color);

    if (existing) {
      existing.qty = Math.min(20, existing.qty + qty);
    } else {
      cart.push({ id, qty: Math.min(20, qty), color });
    }

    saveCart(cart);
    toast(`${product.name} added to your cart.`);
  }

  // Small notification
  function toast(message) {
    let node = document.getElementById("site-toast");

    if (!node) {
      node = document.createElement("div");
      node.id = "site-toast";
      node.className = "fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-xl";
      node.setAttribute("role", "status");
      document.body.appendChild(node);
    }

    node.textContent = message;
    node.classList.remove("hidden");

    clearTimeout(node._hideTimer);
    node._hideTimer = setTimeout(() => {
      node.classList.add("hidden");
    }, 2600);
  }

  // Build a reusable furniture product card
  function productCard(p) {
    return `
      <article class="product-card group overflow-hidden rounded-2xl border border-stone-200 bg-white"
               data-category="${p.category}"
               data-price="${p.price}"
               data-name="${p.name.toLowerCase()}">

        <a href="product.html" class="relative block overflow-hidden bg-stone-100">
          <img
            src="${p.image}"
            alt="${p.name}"
            class="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'">

          <span class="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-800">
            ${p.badge}
          </span>
        </a>

        <div class="p-4 sm:p-5">
          <div class="mb-2 flex items-center justify-between gap-2">
            <span class="text-xs uppercase tracking-[.15em] text-stone-500">${p.category}</span>
            <span class="text-xs text-amber-700">
              ★ ${p.rating}
              <span class="text-stone-400">(${p.reviews})</span>
            </span>
          </div>

          <a href="product.html" class="font-serif text-xl text-stone-900 hover:text-amber-800">
            ${p.name}
          </a>

          <p class="mt-2 min-h-10 text-sm leading-6 text-stone-500">
            ${p.description}
          </p>

          <div class="mt-4 flex items-center justify-between gap-3">
            <span class="font-semibold text-stone-900">${money(p.price)}</span>

            <button
              type="button"
              class="add-to-cart rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
              data-id="${p.id}">
              Add to cart
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // Initialise shared website functionality
  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // Mobile navigation
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!isOpen));
        mobileMenu.classList.toggle("hidden", isOpen);
      });
    }

    // Current year in the footer
    document.querySelectorAll("[data-current-year]").forEach(el => {
      el.textContent = new Date().getFullYear();
    });

    // Render product grids
    document.querySelectorAll("[data-product-grid]").forEach(grid => {
      const source = grid.dataset.source || "all";
      const featured = source === "featured" ? products.slice(0, 4) : products;

      grid.innerHTML = featured.map(productCard).join("");
    });

    // Add-to-cart buttons
    document.addEventListener("click", event => {
      const button = event.target.closest(".add-to-cart");
      if (!button) return;

      const qtyInput = document.querySelector("[data-product-quantity]");
      const colorInput = document.querySelector("[data-selected-color]");

      const qty = qtyInput
        ? Math.max(1, Math.min(20, Number(qtyInput.value) || 1))
        : 1;

      const color = colorInput ? colorInput.value : "Natural";

      addToCart(button.dataset.id, qty, color);
    });

    // Shop category, price and sorting filters
    const filterForm = document.querySelector("[data-shop-filters]");
    const shopGrid = document.querySelector("[data-shop-grid]");

    if (filterForm && shopGrid) {
      const renderShop = () => {
        const category = filterForm.querySelector("[name=category]").value;
        const maxPrice = Number(filterForm.querySelector("[name=max-price]").value);
        const sort = filterForm.querySelector("[name=sort]").value;

        let shown = products.filter(p =>
          (category === "all" || p.category === category) &&
          p.price <= maxPrice
        );

        if (sort === "price-low") {
          shown.sort((a, b) => a.price - b.price);
        }

        if (sort === "price-high") {
          shown.sort((a, b) => b.price - a.price);
        }

        if (sort === "name") {
          shown.sort((a, b) => a.name.localeCompare(b.name));
        }

        shopGrid.innerHTML = shown.length
          ? shown.map(productCard).join("")
          : `
            <div class="col-span-full rounded-2xl bg-stone-100 p-10 text-center">
              <p class="font-serif text-2xl">No pieces found</p>
              <p class="mt-2 text-stone-600">Try another category or price range.</p>
            </div>
          `;

        const output = filterForm.querySelector("[data-price-output]");
        if (output) output.textContent = money(maxPrice);

        const count = document.querySelector("[data-results-count]");
        if (count) {
          count.textContent = `${shown.length} ${shown.length === 1 ? "piece" : "pieces"}`;
        }
      };

      filterForm.addEventListener("input", renderShop);
      renderShop();
    }

    // Product quantity buttons
    const qty = document.querySelector("[data-product-quantity]");

    document.querySelectorAll("[data-qty-step]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!qty) return;

        qty.value = Math.max(
          1,
          Math.min(20, (Number(qty.value) || 1) + Number(btn.dataset.qtyStep))
        );
      });
    });

    // Product colour selector
    document.querySelectorAll("[data-color-option]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-color-option]").forEach(b => {
          b.classList.remove("ring-2", "ring-stone-900", "ring-offset-2");
          b.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("ring-2", "ring-stone-900", "ring-offset-2");
        btn.setAttribute("aria-pressed", "true");

        const hidden = document.querySelector("[data-selected-color]");
        if (hidden) hidden.value = btn.dataset.colorOption;

        const label = document.querySelector("[data-color-label]");
        if (label) label.textContent = btn.dataset.colorOption;
      });
    });

    // Product image gallery
    document.querySelectorAll("[data-gallery-thumb]").forEach(btn => {
      btn.addEventListener("click", () => {
        const main = document.querySelector("[data-gallery-main]");

        if (main) {
          main.src = btn.dataset.galleryThumb;
          main.alt = btn.dataset.galleryAlt || "Oslo Comfort Sofa";
        }

        document.querySelectorAll("[data-gallery-thumb]").forEach(b => {
          b.classList.remove("ring-2", "ring-amber-800");
        });

        btn.classList.add("ring-2", "ring-amber-800");
      });
    });

    // Shopping cart page
    const cartRoot = document.querySelector("[data-cart-root]");
    if (cartRoot) renderCart(cartRoot);

    // Contact and newsletter demo forms
    document.querySelectorAll("form[data-demo-form]").forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const message = form.querySelector("[data-form-message]");

        if (message) {
          message.textContent = form.dataset.demoForm === "contact"
            ? "Thanks — this demo form validated successfully. No message was sent to a real business."
            : "Thanks for subscribing! This is a frontend demo; no email list was updated.";

          message.className = "mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800";
        }

        form.reset();
      });
    });

    // Demo promo code
    const couponForm = document.querySelector("[data-coupon-form]");

    if (couponForm) {
      couponForm.addEventListener("submit", event => {
        event.preventDefault();

        const code = couponForm.querySelector("input").value.trim().toUpperCase();
        const msg = couponForm.querySelector("[data-coupon-message]");

        if (code === "HAVEN10") {
          localStorage.setItem(COUPON_KEY, "HAVEN10");
          msg.textContent = "HAVEN10 applied — 10% off your subtotal.";
          msg.className = "mt-2 text-sm text-green-700";
        } else {
          localStorage.removeItem(COUPON_KEY);
          msg.textContent = "That code is not valid. Try HAVEN10 for the demo discount.";
          msg.className = "mt-2 text-sm text-red-700";
        }

        renderCart(cartRoot);
      });
    }

    // Demo checkout button
    const checkout = document.querySelector("[data-checkout]");

    if (checkout) {
      checkout.addEventListener("click", () => {
        toast("Checkout is a demo. No payment has been collected.");
      });
    }
  });

  // Render shopping cart items and totals
  function renderCart(root) {
    if (!root) return;

    const cart = readCart();

    const lines = cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return p ? { ...p, qty: item.qty, color: item.color } : null;
    }).filter(Boolean);

    const itemsHost = root.querySelector("[data-cart-items]");
    const emptyHost = root.querySelector("[data-cart-empty]");
    const summary = root.querySelector("[data-cart-summary]");

    if (!lines.length) {
      if (itemsHost) itemsHost.innerHTML = "";
      if (emptyHost) emptyHost.classList.remove("hidden");
      if (summary) summary.classList.add("hidden");

      root.querySelectorAll(
        "[data-cart-subtotal], [data-cart-discount], [data-cart-delivery], [data-cart-total]"
      ).forEach(el => {
        el.textContent = money(0);
      });

      return;
    }

    if (emptyHost) emptyHost.classList.add("hidden");
    if (summary) summary.classList.remove("hidden");

    if (itemsHost) {
      itemsHost.innerHTML = lines.map(p => `
        <article class="flex flex-col gap-4 border-b border-stone-200 py-5 sm:flex-row sm:items-center"
                 data-cart-line="${p.id}" data-color="${p.color}">

          <img src="${p.image}" alt="${p.name}"
               class="h-28 w-full rounded-xl object-cover sm:w-32" loading="lazy">

          <div class="flex-1">
            <p class="font-serif text-xl">${p.name}</p>
            <p class="mt-1 text-sm text-stone-500">Finish: ${p.color}</p>
            <p class="mt-2 font-semibold">${money(p.price)}</p>
          </div>

          <div class="flex items-center gap-3">
            <button class="cart-step rounded-full border border-stone-300 px-3 py-1"
                    data-step="-1" data-id="${p.id}" data-color="${p.color}"
                    aria-label="Decrease quantity">−</button>

            <span class="min-w-5 text-center">${p.qty}</span>

            <button class="cart-step rounded-full border border-stone-300 px-3 py-1"
                    data-step="1" data-id="${p.id}" data-color="${p.color}"
                    aria-label="Increase quantity">+</button>

            <button class="cart-remove ml-2 text-sm text-red-700 underline"
                    data-id="${p.id}" data-color="${p.color}">Remove</button>
          </div>

          <p class="min-w-24 text-right font-semibold">${money(p.price * p.qty)}</p>
        </article>
      `).join("");

      // Quantity controls
      itemsHost.querySelectorAll(".cart-step").forEach(btn => {
        btn.addEventListener("click", () => {
          const c = readCart();
          const found = c.find(i =>
            i.id === btn.dataset.id && i.color === btn.dataset.color
          );

          if (found) {
            found.qty = Math.max(
              1,
              Math.min(20, found.qty + Number(btn.dataset.step))
            );
          }

          saveCart(c);
          renderCart(root);
        });
      });

      // Remove an item
      itemsHost.querySelectorAll(".cart-remove").forEach(btn => {
        btn.addEventListener("click", () => {
          saveCart(readCart().filter(i =>
            !(i.id === btn.dataset.id && i.color === btn.dataset.color)
          ));

          renderCart(root);
        });
      });
    }

    // Calculate totals
    const subtotal = lines.reduce((sum, p) => sum + p.price * p.qty, 0);

    const discount = localStorage.getItem(COUPON_KEY) === "HAVEN10"
      ? Math.round(subtotal * 0.1)
      : 0;

    const delivery = subtotal >= 80000 ? 0 : 1500;
    const total = subtotal - discount + delivery;

    const set = (selector, value) => {
      root.querySelectorAll(selector).forEach(el => {
        el.textContent = money(value);
      });
    };

    set("[data-cart-subtotal]", subtotal);
    set("[data-cart-discount]", discount);
    set("[data-cart-delivery]", delivery);
    set("[data-cart-total]", total);
  }
})();
```