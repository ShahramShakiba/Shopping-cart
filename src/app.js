/*=================== Document Title ==================*/
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Follow me 😍' : 'on GitHub ✌';

  alertShow = !alertShow;
}, 1000);

/*==================== ProductsData ===================*/
//-> import productsData
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
  //-> while loading the page get products from api end point
  getProducts() {
    return productsData;
  }
}

/*================== Display Products =================*/
const productsDOM = document.querySelector('.products-center'),
  cartTotal = document.querySelector('.cart-total'),
  cartItemsCount = document.querySelector('.cart-items');

let cart = [];

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

  getCartBtns() {
    const addCartBtn = document.querySelectorAll('.add-to-cart');

    //-> convert NodeList to Array
    const buttons = [...addCartBtn];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;

      //-> check if product is in the cart
      const isExist = cart.find((p) => p.id === id);
      if (isExist) {
        btn.textContent = 'Added';
        btn.disabled = true;
      }

      btn.addEventListener('click', (e) => {
        //-> when btn clicked to add product to cart
        e.target.textContent = 'Added';
        e.target.disabled = true;

        //-> get products from localStorage
        const addedProduct = Storage.getProduct(id);
        console.log(addedProduct);
        //-> add to cart
        cart = [...cart, { ...addedProduct, quantity: 1 }];

        //-> save cart to localStorage
        Storage.saveCart(cart);

        //-> update cart value
        this.setCartValue(cart);

        //-> get cart from localStorage to avoid resetting the cart value 
      });
    });
  }

  setCartValue(cart) {
    //-> total price of cart
    let tempCartItems = 0;

    const totalPrice = cart.reduce((acc, curr) => {
      //-> show number of items in cart
      tempCartItems += curr.quantity;

      return acc + curr.quantity * curr.price;
    }, 0);

    cartTotal.textContent = `Total price: $ ${totalPrice.toFixed(2)}`;
    cartItemsCount.textContent = tempCartItems;
  }
}

/*==================== localStorage ===================*/
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem('products'));

    // parseInt() -> covert string to integer
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

/*================ Show products on DOM ===============*/
document.addEventListener('DOMContentLoaded', () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getCartBtns();

  Storage.saveProducts(productsData);
});
