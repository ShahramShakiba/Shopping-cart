/*=================== Document Title ==================*/
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Follow me 😍' : 'on GitHub ✌';

  alertShow = !alertShow;
}, 1000);

/*==================== ProductsData ===================*/
// import productsData
import { productsData } from './Products.js';

/*======================== Modal ======================*/
const cartBtn = document.querySelector('.cart-btn'),
  cartModal = document.querySelector('.cart'),
  backDrop = document.querySelector('.backdrop'),
  closeModalBtn = document.querySelector('.cart-item-confirm');

function toggleModal() {
  cartModal.classList.toggle('show');
  backDrop.classList.toggle('show');
}

cartBtn.addEventListener('click', toggleModal);
closeModalBtn.addEventListener('click', toggleModal);
backDrop.addEventListener('click', toggleModal);

/*==================== Get Products ===================*/
class Products {
  // while loading the page get products from api end point
  getProducts() {
    return productsData;
  }
}

/*================== Display Products =================*/
const productsDOM = document.querySelector('.products-center');

class UI {
  displayProducts(products) {
    let result = '';

    products.forEach((item) => {
      result += `
      <div class="product">
        <div class="img-container">
            <img
              class="product-img"
              src="${item.imageUrl}"
              alt="${item.title}"
            />
        </div>

        <div class="product-desc">
          <p class="product-title">
            ${item.title}
          </p>
          <p class="product-price">
            ${item.price}
          </p>
        </div>

        <button class="add-to-cart" data-id= "${item.id}" >
          Purchase
        </button>
      </div>
      `;
    });

    productsDOM.innerHTML = result;
  }
}

/*==================== localStorage ===================*/
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
}

/*================ Show products on DOM ===============*/
document.addEventListener('DOMContentLoaded', () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new UI();
  ui.displayProducts(productsData);

  Storage.saveProducts(productsData);
});
