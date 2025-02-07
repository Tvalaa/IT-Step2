const apiUrl = 'https://api.everrest.educata.dev/shop/products';

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
    `;
    productInfo.appendChild(productElement);
  });
}

async function rateProduct(productId, rating) {
  const response = await fetch(`${apiUrl}/rate`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <your_token_here>', // Tokenit chavanacvlo unda
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
