const PRODUCTS_API = "https://dummyjson.com/products";
const CATEGORIES_API = "https://dummyjson.com/products/categories";

const searchInput = document.querySelector("#search-input");
const categoriesDiv = document.querySelector("#category-filters");
const productsDiv = document.querySelector("#products-container");
const productDetailDiv = document.querySelector("#product-detail-container");
const wishlistCount = document.querySelector("#wishlist-count");
const wishlistDiv = document.querySelector("#wishlist-container");
const cartCount = document.querySelector("#cart-count");
const cartDiv = document.querySelector("#cart-container");


const convertToINR = price => (price * 100).toFixed(2);
const formatCategory = category => category.replace("-", "");
const getFromStorage = key => JSON.parse(localStorage.getItem(key)) || [];
const setInStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value)); // returns undefined as setItem returns undefined
const updateWishlistCount = () => wishlistCount.textContent = getFromStorage("wishlist").length || 0;
const updateCartCount = () => cartCount.textContent = getFromStorage("cart").reduce((acc, curr) => (acc + curr.quantity || 0), 0);
const totalCartAmount = () => getFromStorage("cart").reduce((acc, curr) => acc + (curr.price * curr.quantity || 0), 0);
// console.log(setInStorage("wishlist", {}));
// console.log(updateWishlistCount);


async function fetchCategories() {
    try {
        const resp = await fetch(CATEGORIES_API);
        const data = await resp.json();
        console.log(data);
        renderCategories(data);
    } catch (e) {
        console.log(e);
        categoriesDiv.innerHTML = "Failed to load Categories.";
    }
};

function renderCategories(categories) {
    let allCategories = [{ name: "all", slug: "all", url: PRODUCTS_API }, ...categories];

    allCategories.forEach(({ name, slug, url }) => {
        let catBtn = document.createElement("button");
        catBtn.className = `cat-btn px-4 py-1.5 rounded-md text-sm font-medium border border-slate-300 capitalize transition ${name === "all" ? "active" : ""}`;
        catBtn.type = "button";
        catBtn.dataset.category = slug;
        catBtn.dataset.url = url;
        catBtn.textContent = `${formatCategory(name)}`;
        // console.log(catBtn);

        categoriesDiv.append(catBtn);
    });
};

async function fetchProducts(url) {
    try {
        productsDiv.innerHTML = `<span class="loader">Loading...</span>`;
        const resp = await fetch(url);
        const data = await resp.json();
        console.log(data);
        renderProducts(data.products);
    } catch (e) {
        console.log(e);
        productsDiv.innerHTML = "Failed to load Products.";
    }
};

function renderProducts(products) {
    productsDiv.innerHTML = "";

    products.forEach(({ thumbnail, category, title, price, id }) => {
        let card = document.createElement("article");
        card.className = "bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition";
        card.innerHTML = `
        <div class="h-48 w-full flex items-center justify-center p-3 mb-4 bg-white">
            <img src=${thumbnail}
              alt="Essence Mascara Lash Princess" class="max-h-full max-w-full object-contain" loading="lazy">
        </div>
        <div class="flex-grow flex flex-col">
            <span class="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              ${category}
            </span>
            <h2 class="font-semibold text-slate-900 text-sm mb-2 line-clamp-2" title="Essence Mascara Lash Princess">
              ${title}
            </h2>
            <div class="mt-auto pt-2">
              <span class="text-lg font-bold text-slate-900">
                ₹${convertToINR(price)}
              </span>
            </div>
            <a href="product-details.html?id=${id}"
              class="mt-4 block w-full text-center bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition">
              View Details
            </a>
        </div>
        `;

        productsDiv.append(card);
    });
};

async function fetchProductDetails() {
    if (productDetailDiv) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const url = `${PRODUCTS_API}/${id}`;

        productDetailDiv.innerHTML = `<span class="loader">Loading...</span>`;
        try {
            const resp = await fetch(url);
            const data = await resp.json();
            console.log(data);
            renderProductDetails(data);
        } catch (e) {
            console.log(e);
            productDetailDiv.innerHTML = "Failed to load Product Details.";
        }

    }
};

function renderProductDetails(product) {
    let { thumbnail, title, category, rating, reviews, price, description, quantity } = { ...product, quantity: 1 };

    productDetailDiv.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        <div
          class="bg-white border border-slate-200 rounded-lg p-8 flex items-center justify-center min-h-[350px] md:min-h-[440px]">
          <img src=${thumbnail}
            alt=${title} class="max-h-96 max-w-full object-contain">
        </div>

        <div class="flex flex-col">
          <div>
            <span class="inline-block text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              ${category}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
            ${title}
          </h1>

          <div class="flex items-center gap-1 mb-4">
            <div class="flex items-center" aria-label="${rating} out of 5 stars">
              <svg class="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg class="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg class="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg class="w-5 h-5 text-slate-300 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg class="w-5 h-5 text-slate-300 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="ml-2 text-sm text-slate-500 font-medium">
              ${rating} (${reviews.length} reviews)
            </span>
          </div>

          <div class="mb-6">
            <span class="text-2xl sm:text-3xl font-bold text-slate-900">
              ₹${convertToINR(price)}
            </span>
          </div>

          <div class="border-t border-b border-slate-200 py-6 mb-6">
            <p class="text-slate-600 text-base leading-relaxed">
              ${description}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

            <div class="flex items-center border border-slate-300 rounded-md bg-white w-fit">
              <button type="button" id="qty-minus"
                class="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l-md transition"
                aria-label="Decrease quantity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4">
                  </path>
                </svg>
              </button>

              <span id="qty-value" class="w-12 text-center text-sm font-semibold text-slate-900 select-none">
                ${quantity}
              </span>

              <button type="button" id="qty-plus"
                class="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-md transition"
                aria-label="Increase quantity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>

            <button type="button" id="add-to-cart-btn"
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Add to Cart</span>
            </button>

            <button type="button" id="add-to-wishlist-btn"
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border border-teal-700 text-teal-700 hover:bg-teal-50 font-medium py-2.5 px-6 rounded-md shadow-sm transition">
              <svg id="wishlist-btn-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                </path>
              </svg>
              <span id="wishlist-btn-text">Add to Wishlist</span>
            </button>
          </div>

        </div>
    </div>
    `

    productDetailDiv.addEventListener("click", e => {
        e.stopPropagation();
        let qtyValue = productDetailDiv.querySelector("#qty-value");

        if (e.target.closest("#qty-minus")) {
            qtyValue.textContent = Math.max(1, Number(qtyValue.textContent) - 1);
        };
        if (e.target.closest("#qty-plus")) {
            qtyValue.textContent = Number(qtyValue.textContent) + 1;
        };
        if (e.target.closest("#add-to-cart-btn")) {
            addToCart(product, quantity = Number(qtyValue.textContent));
        };
        if (e.target.closest("#add-to-wishlist-btn")) {
            addToWishlist(product);
        };
    });

};

function addToWishlist(product) {

    let wishlistArr = getFromStorage("wishlist");
    if(wishlistArr.length){
        let existsIn = wishlistArr.some(p => product.id === p.id); // some returns true if the callback fn is true for any one iteration & short-circuits remaining iterations else returns false
        if (existsIn) return;
        setInStorage("wishlist", [...wishlistArr, product]);
    } else {
        setInStorage("wishlist", [product]);
    };
    updateWishlistCount();
};

function loadWishlistPage() {
    if (!wishlistDiv) return;
    let wishlistArr = getFromStorage("wishlist");
    console.log(wishlistArr);
    if (!wishlistArr.length) {
        wishlistDiv.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
            <div class="w-16 h-16 mx-auto mb-4 text-slate-300 flex items-center justify-center">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-800 mb-2">Your wishlist is empty</h2>
            <p class="text-slate-500 text-sm mb-6">Looks like you haven't saved any products to your wishlist yet.</p>
            <a href="index.html" class="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-2.5 rounded-md transition text-sm">
                Start Shopping
            </a>
        </div>
      `
    } else {
        let outerDiv = document.createElement("div");
        outerDiv.className = `bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-sm`;
        wishlistArr.forEach(({ thumbnail, title, price, id }) => {
            let card = document.createElement("div");
            card.className = `wishlist-card p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between`;
            card.dataset.id = id;
            card.innerHTML = `
            <div class="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded p-1.5 flex items-center justify-center shrink-0">
                    <img 
                        src=${thumbnail} 
                        alt=${title}
                        class="max-h-full max-w-full object-contain"
                    >
                </div>
                <div class="min-w-0 flex-1">
                    <a href="product-details.html?id=${id}"
                    class="text-sm font-semibold text-slate-900 hover:text-teal-700 line-clamp-2 transition" 
                    title=${title}
                    >
                        ${title}
                    </a>
                    <p class="text-sm font-bold text-slate-900 mt-1">₹${convertToINR(price)}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button 
                type="button" 
                class="wishlist-add-cart-btn inline-flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition shadow-sm"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <span>Add to Cart</span>
                </button>
                <button 
                type="button" 
                class="wishlist-remove-btn inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-red-600 border border-slate-300 hover:border-red-300 text-sm font-medium py-2 px-3 rounded transition"
                title="Remove from Wishlist"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Remove from Wishlist</span>
                </button>
            </div>`;

            outerDiv.appendChild(card);

        });
        wishlistDiv.appendChild(outerDiv);

        wishlistDiv.addEventListener("click", e => {
            e.stopPropagation();
            if (e.target.closest(".wishlist-remove-btn")) {
                let card = e.target.closest(".wishlist-card");
                let removeId = Number(card.dataset.id);
                // console.log(card, removeId, card.dataset);
                let wishlistArr = getFromStorage("wishlist");
                let updatedWishlist = wishlistArr.filter(p => p.id !== removeId);
                setInStorage("wishlist", updatedWishlist);
                card.remove();
                updateWishlistCount();
                if (!updatedWishlist.length) loadWishlistPage();
            };

            if (e.target.closest(".wishlist-add-cart-btn")) {
                let card = e.target.closest(".wishlist-card");
                let addId = Number(card.dataset.id);
                let wishlistArr = getFromStorage("wishlist");
                let product = wishlistArr.find(p => p.id === addId);
                // console.log(product);
                addToCart(product);
            };
        });
    }
};

function addToCart(product, quantity = 1) {
    
    let cartArr = getFromStorage("cart");
    if (cartArr.length) { 
        let isExist = cartArr.some(p => product.id === p.id);
        if (isExist) setInStorage("cart", cartArr.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p));
        else setInStorage("cart", [...cartArr, {...product, quantity : quantity}]);
    } else {
        setInStorage("cart", [{...product, quantity : quantity}]);
    };
    updateCartCount();
};

function loadCartPage() {
    if (!cartDiv) return;
    let cartArr = getFromStorage("cart");
    console.log(cartArr);
    if (!cartArr.length) {
        cartDiv.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
            <div class="w-16 h-16 mx-auto mb-4 text-slate-300 flex items-center justify-center">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h2>
            <p class="text-slate-500 text-sm mb-6">Looks like you haven't added any products to your cart yet.</p>
            <a href="index.html" class="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-2.5 rounded-md transition text-sm">
                Continue Shopping
            </a>
        </div>
        `;
    } else {
        let totalAmount = 0;

        let outerDiv = document.createElement("div");
        outerDiv.className = `grid grid-cols-1 lg:grid-cols-3 gap-8 items-start`;
        let cartItemsDiv = document.createElement("div");
        cartItemsDiv.className = `lg:col-span-2 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-sm`;

        cartArr.forEach(({ thumbnail, title, price, id, quantity }) => {
            // console.log(quantity);
            let card = document.createElement("div");
            card.className = `cart-card p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between`;
            card.dataset.id = id;
            card.innerHTML = `
                <div class="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                    <div
                    class="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded p-1.5 flex items-center justify-center shrink-0">
                    <img src=${thumbnail}
                    alt=${title} class="max-h-full max-w-full object-contain">
                    </div>
                    <div class="min-w-0 flex-1">
                        <a href="product-details.html?id=${id}"
                        class="text-sm font-semibold text-slate-900 hover:text-teal-700 line-clamp-2 transition"
                        title=${title}>
                            ${title}
                        </a>
                        <p class="cart-item-price text-xs text-slate-500 mt-1">₹${convertToINR(price)} each</p>
                    </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto shrink-0">

                    <div class="flex items-center border border-slate-300 rounded bg-white">
                        <button type="button"
                        class="cart-qty-minus p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l transition"
                        aria-label="Decrease quantity"> 
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                        </button>
                        
                        <span id="cart-qty-value" class="w-8 text-center text-xs font-semibold text-slate-800 select-none">${quantity}</span>
                         
                        <button type="button"
                        class="cart-qty-plus p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r transition"
                        aria-label="Increase quantity">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="w-20 text-right">
                        <span class="cart-item-total text-sm font-bold text-slate-900">₹${convertToINR(price * quantity)}</span>
                    </div>
                    <button type="button"
                    class="cart-wishlist-btn text-slate-400 hover:text-teal-700 p-1.5 rounded transition"
                    title="Add to Wishlist" aria-label="Add to Wishlist">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                        </path>
                        </svg>
                    </button>
                    <button type="button" class="cart-remove-btn text-slate-400 hover:text-red-600 p-1.5 rounded transition"
                    title="Remove from cart" aria-label="Remove item">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                        </svg>
                    </button>
                </div>
            `;

            cartItemsDiv.appendChild(card);
        });
        outerDiv.appendChild(cartItemsDiv);

        let cartSummaryDiv = document.createElement("div");
        cartSummaryDiv.className = `bg-white border border-slate-200 rounded-lg p-6 shadow-sm sticky top-24`;
        cartSummaryDiv.innerHTML = `
            <h2 class="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
                Order Summary
            </h2>

            <div class="flex items-center justify-between text-base font-semibold text-slate-900 mb-6">
                <span>Total Amount</span>
                <span class="total-amount text-xl font-bold text-teal-700">₹${convertToINR(totalCartAmount())}</span>
            </div>

            <button type="button" id="checkout-btn"
                class="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded-md shadow-sm transition text-center">
                Proceed to Checkout
            </button>
        `;

        outerDiv.appendChild(cartSummaryDiv);

        cartDiv.appendChild(outerDiv);

        cartDiv.addEventListener("click", e => {
            e.stopPropagation();

            let card = e.target.closest(".cart-card");
            let cardId = Number(card?.dataset.id);
            let qtyValue = card?.querySelector("#cart-qty-value");
            let itemPrice = card?.querySelector(".cart-item-price");
            let itemTotalSpan = card?.querySelector(".cart-item-total");
            let price = itemPrice.textContent.replace(/[₹,\s]|each/g, "")

            let totalAmountSpan = cartDiv.querySelector(".total-amount");

            if (e.target.closest(".cart-qty-minus")) {
                qtyValue.textContent = Math.max(1, Number(qtyValue.textContent) - 1);
                setInStorage("cart", getFromStorage("cart").map(p => p.id === cardId ? { ...p, quantity: Number(qtyValue.textContent) } : p));
                itemTotalSpan.textContent = `₹${(Number(qtyValue.textContent) * Number(price)).toFixed(2)}`;
                totalAmountSpan.textContent = `₹${convertToINR(totalCartAmount())}`;
            };

            if (e.target.closest(".cart-qty-plus")) {
                qtyValue.textContent = Number(qtyValue.textContent) + 1;
                setInStorage("cart", getFromStorage("cart").map(p => p.id === cardId ? { ...p, quantity: Number(qtyValue.textContent) } : p));
                itemTotalSpan.textContent = `₹${(Number(qtyValue.textContent) * Number(price)).toFixed(2)}`;
                totalAmountSpan.textContent = `₹${convertToINR(totalCartAmount())}`;
            };

            if (e.target.closest(".cart-remove-btn")) {
                let card = e.target.closest(".cart-card");
                let removeId = Number(card.dataset.id);
                // console.log(card, removeId, card.dataset);
                let cartArr = getFromStorage("cart");
                let updatedCart = cartArr.filter(p => p.id !== removeId);
                setInStorage("cart", updatedCart);
                card.remove();
                updateCartCount();
                if (!updatedCart.length) loadCartPage();
            };

            if (e.target.closest(".cart-wishlist-btn")) {
                let card = e.target.closest(".cart-card");
                let addId = Number(card.dataset.id);
                let cartArr = getFromStorage("cart");
                let product = cartArr.find(p => p.id === addId);
                // console.log(product);
                addToWishlist(product);
            };
        });
    };
};

function init() {

    if (searchInput) {
        searchInput.addEventListener("input", e => {
            e.stopPropagation();
            value = e.target.value;
            fetchProducts(`${PRODUCTS_API}/search?q=${value}&limit=0`);
        });
    };
    
    if (categoriesDiv) {
        categoriesDiv.addEventListener("click", e => {
            e.stopPropagation();
    
            let elem = e.target;
            if (!elem.type) return;
    
            document.querySelectorAll(".cat-btn").forEach(c => c.classList.toggle("active", c.dataset.category === elem.dataset.category));
            fetchProducts(elem.dataset.url);
        });
    };
    
    if (productsDiv) { // applied this check here instead of inside these 2 functions as they are on same page
        fetchCategories();
        fetchProducts(`${PRODUCTS_API}?limit=0`);
    };
    
    fetchProductDetails();
    
    updateWishlistCount();
    loadWishlistPage();
    
    updateCartCount();
    loadCartPage(); 
};


init();