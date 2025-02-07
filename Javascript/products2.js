const apiUrl = 'https://api.everrest.educata.dev/shop/products';
const categoryUrl = 'https://api.everrest.educata.dev/shop/products/categories';


async function getProductById(id) {
  const response = await fetch(`${apiUrl}/id/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const data = await response.json();
  displayProduct(data);
}

async function getAllCategories() {
  const categoryUrl = 'https://api.everrest.educata.dev/shop/products/categories';

  try {
    const response = await fetch(categoryUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const categories = await response.json();
    console.log(categories); // You can display or process the categories here

    displayCategories(categories);

    // Optionally, you could pass the categories to a function to display them
  } catch (error) {
    console.error('Error fetching categories:', error);
    alert('There was an error fetching categories. Please try again later.');
  }
}

function displayCategories(categories) {
  const categoryFilter = document.getElementById('categoryFilter');

  // Clear existing options before adding new ones
  categoryFilter.innerHTML = '<option value="">All Categories</option>';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id; // Assuming each category has an `id`
    option.textContent = category.name; // Assuming each category has a `name`
    categoryFilter.appendChild(option);
  });
}

getAllCategories();

async function searchProducts() {
  const keyword = document.getElementById('searchKeyword').value;
  const category = document.getElementById('categoryFilter').value;
  const brand = document.getElementById('brandFilter').value;
  const priceRange = document.getElementById('priceRange').value;

  let query = `keywords=${keyword}&page_size=5`;

  if (category) query += `&category=${category}`;
  if (brand) query += `&brand=${brand}`;
  if (priceRange) query += `&price_lte=${priceRange}`;

  const response = await fetch(`${apiUrl}/search?${query}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const data = await response.json();
  displayProducts(data.products);
}

function displayProduct(product) {
  const productInfo = document.getElementById('productInfo');
  productInfo.innerHTML = `
    <div class="product">
      <img src="${product.thumbnail}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>Price: ${product.price.current} ${product.price.currency}</p>
      <p>Brand: ${product.brand}</p>
      <p>Stock: ${product.stock}</p>
      <p>Rating: ${product.rating}</p>
      <button onclick="rateProduct('${product._id}', 5)">Rate 5 Stars</button>
    </div>
  `;
}

function displayProducts(products) {
  const productInfo = document.getElementById('productInfo');
  productInfo.innerHTML = '';

  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>Price: ${product.price.current} ${product.price.currency}</p>
      <p>Brand: ${product.brand}</p>
      <p>Stock: ${product.stock}</p>
      <p>Rating: ${product.rating}</p>
      <button onclick="getProductById('${product._id}')">View More</button>
      <button onclick="addToCart('${product._id}', '${product.title}', ${product.price.current}, '${product.price.currency}')">Add to Cart</button>
    `;
    productInfo.appendChild(productElement);
  });
}

function addToCart(productId, productTitle, productPrice, productCurrency) {
  console.log(`Product ${productId} added to cart`);

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingProductIndex = cart.findIndex(item => item.id === productId);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      currency: productCurrency,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  alert('Product added to cart!');
}


async function rateProduct(productId, rating) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${apiUrl}/rate`, {

    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Tokenit chavanacvlo unda
    },
    body: JSON.stringify({
      productId: productId,
      rate: rating,
    }),
  });

  const data = await response.json();
  alert('Rated successfully!');
  displayProduct(data);
}

document.getElementById('priceRange').addEventListener('input', (event) => {
  document.getElementById('priceOutput').textContent = `0 - ${event.target.value} USD`;
});

function applyFilters() {
  searchProducts();
}

window.onload = function () {
  getProductById('64edc5b96ad1cbae75d3025a');
};
