function showSidebar1(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}

function hideSidebar1(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}


function showSidebar() {
    document.getElementById("filtersSidebar").classList.add("open");
}

function hideSidebar() {
    document.getElementById("filtersSidebar").classList.remove("open");
}

function fetchProducts() {
    fetch("https://api.everrest.educata.dev/products")
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = ''; 
            products.forEach(product => {
                const imageUrl = product.imageUrl ? product.imageUrl : 'default-image.jpg';
                const productCard = `
                    <div class="product-card">
                        <img src="${imageUrl}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="product-price">${product.price} GEL</p>
                        <p class="product-rating">${product.rating} ★</p>
                        <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product)})">Add to Cart</button>
                    </div>
                `;
                productList.innerHTML += productCard;
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            alert("Failed to load products. Please try again later.");
        });
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartUI();
}

function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById("cartCount");
    
    if (cartCountElement) {
        cartCountElement.innerText = `Cart (${cartCount})`;
    }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
