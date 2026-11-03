const $ = (selector) => document.querySelector(selector);

const formatNumber = (value) =>
    new Intl.NumberFormat("fa-IR").format(value);

const money = (value) => `${formatNumber(value)} تومان`;

const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

// محصولات نمونه؛ قیمت‌ها نمایشی هستند.
const products = [
    {
        id: 1,
        name: "رگال لباس فلزی",
        category: "رگال لباس",
        price: 850000,
        description: "مناسب چیدمان فروشگاه پوشاک",
        image: "2.png"
    },
    {
        id: 2,
        name: "قفسه فروشگاهی",
        category: "قفسه فروشگاهی",
        price: 1450000,
        description: "برای نمایش منظم محصولات",
        image: "1.png"
    },
    {
        id: 3,
        name: "استند سیگار",
        category: "استند",
        price: 650000,
        description: "مناسب نمایش کالاهای منتخب",
        image: "7.png"
    },
    {
        id: 4,
        name: "استند فلزی",
        category: "استند",
        price: 1200000,
        description: "برای استفاده بهتر از فضای فروشگاه",
        image: "6.png"
    },
    {
        id: 5,
        name: "قفسه چندطبقه",
        category: "قفسه فروشگاهی",
        price: 1850000,
        description: "چیدمان چندطبقه و کاربردی",
        image: "8.png"
    },
    {
        id: 6,
        name: "استند خشکبار",
        category: "استند",
        price: 780000,
        description: "طراحی ساده برای نمایش محصولات",
        image: "9.png"
    },
    {
        id: 7,
        name: "استند تره بار",
        category: "استند",
        price: 950000,
        description: "گزینه‌ای کاربردی برای فضای فروشگاه",
        image: "10.png"
    },
    {
        id: 8,
        name: "رگال چرخ‌دار",
        category: "رگال لباس",
        price: 1100000,
        description: "جابجایی آسان در محیط فروشگاه",
        image: "https://placehold.co/600x400/222222/D6AD60?text=Rolling+Rack"
    }
];

let activeCategory = "همه محصولات";
let searchTerm = "";
let cart = loadCart();

// -------------------------
// ذخیره سبد خرید در مرورگر
// -------------------------

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem("rackland_cart"));

        if (!Array.isArray(saved)) return [];

        return saved.filter((item) =>
            products.some((product) => product.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem("rackland_cart", JSON.stringify(cart));
}

// -------------------------
// منوی موبایل
// -------------------------

$("#menuToggle").addEventListener("click", () => {
    const isOpen = $("#nav").classList.toggle("show");

    $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
});

$("#nav").querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        $("#nav").classList.remove("show");
        $("#menuToggle").setAttribute("aria-expanded", "false");
    });
});

// -------------------------
// جستجو
// -------------------------

$("#searchToggle").addEventListener("click", () => {
    const bar = $("#searchBar");
    bar.classList.toggle("show");

    if (bar.classList.contains("show")) {
        $("#searchInput").focus();
    }
});

$("#searchInput").addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    renderProducts();
});

$("#clearSearch").addEventListener("click", () => {
    $("#searchInput").value = "";
    searchTerm = "";
    renderProducts();
    $("#searchInput").focus();
});

// -------------------------
// دسته‌بندی و محصولات
// -------------------------

function renderProducts() {
    let filtered = products.filter((product) => {
        const categoryMatch =
            activeCategory === "همه محصولات" ||
            product.category === activeCategory;

        const text = (
            product.name + " " +
            product.category + " " +
            product.description
        ).toLocaleLowerCase();

        return categoryMatch &&
            text.includes(searchTerm.toLocaleLowerCase());
    });

    const sort = $("#sortSelect").value;

    if (sort === "cheap") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "expensive") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
        filtered.sort((a, b) => b.id - a.id);
    }

    $("#productsTitle").textContent =
        activeCategory === "همه محصولات"
            ? "محصولات فروشگاه"
            : activeCategory;

    $("#resultMessage").textContent =
        `${formatNumber(filtered.length)} محصول پیدا شد`;

    $("#productList").innerHTML = filtered.length
        ? filtered.map((product) => `
            <article class="product-card">
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/222222/D6AD60?text=RackLand'">

                <div class="product-info">
                    <h3>${escapeHTML(product.name)}</h3>
                    <p>${escapeHTML(product.description)}</p>
                    <strong class="product-price">${money(product.price)}</strong>

                    <button class="add-cart" data-add="${product.id}">
                        افزودن به سبد خرید +
                    </button>
                </div>
            </article>
        `).join("")
        : '<div class="empty">محصولی با این مشخصات پیدا نشد.</div>';
}

$("#categories").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;
    searchTerm = "";
    $("#searchInput").value = "";

    renderProducts();

    $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#sortSelect").addEventListener("change", renderProducts);

$("#showAll").addEventListener("click", () => {
    activeCategory = "همه محصولات";
    searchTerm = "";
    $("#searchInput").value = "";

    renderProducts();
});

$("#productList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    addToCart(Number(button.dataset.add));
});

// -------------------------
// سبد خرید
// -------------------------

function addToCart(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const existing = cart.find((item) => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find((product) => product.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter((product) => product.id !== id);
    }

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);

    saveCart();
    renderCart();
}

function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const total = cart.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);

        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    $("#cartCount").textContent = formatNumber(count);
    $("#cartTotal").textContent = money(total);

    $("#cartItems").innerHTML = cart.length
        ? cart.map((item) => {
            const product = products.find((p) => p.id === item.id);

            if (!product) return "";

            return `
                <div class="cart-row">
                    <div>
                        <strong>${escapeHTML(product.name)}</strong>
                        <small>${money(product.price)} × ${formatNumber(item.quantity)}</small>
                    </div>

                    <div class="cart-controls">
                        <button data-plus="${item.id}" aria-label="افزایش">+</button>
                        <button data-minus="${item.id}" aria-label="کاهش">−</button>
                        <button data-remove="${item.id}">حذف</button>
                    </div>
                </div>
            `;
        }).join("")
        : '<div class="empty">سبد خرید شما خالی است.</div>';

    saveCart();
}

$("#cartItems").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.plus) {
        changeQuantity(Number(button.dataset.plus), 1);
    } else if (button.dataset.minus) {
        changeQuantity(Number(button.dataset.minus), -1);
    } else if (button.dataset.remove) {
        removeFromCart(Number(button.dataset.remove));
    }
});

$("#cartButton").addEventListener("click", () => {
    $("#cartModal").classList.add("show");
});

$("#closeCart").addEventListener("click", () => {
    $("#cartModal").classList.remove("show");
});

$("#cartModal").addEventListener("click", (event) => {
    if (event.target.id === "cartModal") {
        $("#cartModal").classList.remove("show");
    }
});

$("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) {
        alert("سبد خرید شما خالی است.");
        return;
    }

    alert("برای ثبت سفارش واقعی باید سامانه سفارش‌گیری به سایت متصل شود.");
});

// -------------------------
// اسلایدر
// -------------------------

const slides = [...document.querySelectorAll(".slide")];
const dotsContainer = $("#sliderDots");

let currentSlide = 0;
let sliderTimer;

slides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `اسلاید ${index + 1}`);

    dot.addEventListener("click", () => {
        showSlide(index);
        startSlider();
    });

    dotsContainer.appendChild(dot);
});

const dots = [...document.querySelectorAll(".slider-dot")];

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });

    $("#sliderCounter").textContent =
        `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
}

function startSlider() {
    clearInterval(sliderTimer);

    sliderTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

$("#nextSlide").addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startSlider();
});

$("#prevSlide").addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startSlider();
});

showSlide(0);
startSlider();

// -------------------------
// راه‌اندازی اولیه
// -------------------------

renderProducts();
renderCart();
