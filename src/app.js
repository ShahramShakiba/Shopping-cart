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

  function showModalFunction() {
    backDrop.style.display = "block";
    cartModal.style.opacity = "1";
    cartModal.style.top = "21%";
    cartModal.style.position = "fixed";
  }
  
  function closeModalFunction() {
    backDrop.style.display = "none";
    cartModal.style.opacity = "0";
    cartModal.style.top = "-100%";
  }

cartBtn.addEventListener('click', showModalFunction);
closeModalBtn.addEventListener('click', closeModalFunction);
backDrop.addEventListener('click', closeModalFunction);

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
  cartItemsCounter = document.querySelector('.cart-items'),
  cartContent = document.querySelector('.cart-content');

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

        <button class="btn add-to-cart" data-id=${item.id}>
          Purchase
        </button>
      </div>
      `;
    });

    productsDOM.innerHTML = result;
  }

  getCartBtns() {
    //-> convert NodeList to Array
    const addCartBtns = document.querySelectorAll('.add-to-cart');

    //-> display products on cart
    addCartBtns.forEach((btn) => {
      const id = btn.dataset.id;

      //-> check if product is in the cart
      const isExist = cart.find((p) => p.id === id);
      if (isExist) {
        btn.innerText = 'Added';
        btn.disabled = true;
      }

      btn.addEventListener('click', (e) => {
        //-> when btn clicked to add product to cart
        e.target.innerText = 'Added';
        e.target.disabled = true;

        //-> get products from localStorage
        const addedProduct = { ...Storage.getProducts(id), quantity: 1 };

        //-> add to cart
        cart = [...cart, addedProduct];

        //-> save cart to localStorage
        Storage.saveCart(cart);

        //-> update cart value
        this.setCartValue(cart);

        //-> add to cart item: what item user added to cart
        this.addCartItem(addedProduct);

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

    cartTotal.innerText = `Total price: $ ${totalPrice.toFixed(2)}`;
    cartItemsCounter.innerText = tempCartItems;
  }

  addCartItem(cartItem) {
    const div = document.createElement('div');
    div.classList.add('cart-item');

    div.innerHTML = `
    <img
      class="cart-item-img"
      src="${cartItem.imageUrl}"
    />

    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$ ${cartItem.price}</h5>
    </div>

    <div class="cart-item-controller">
      <i class="ri-arrow-up-s-line arrow-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="ri-arrow-down-s-line arrow-down" data-id=${cartItem.id}></i>
    </div>

    <i class="ri-delete-bin-line trash" data-id=${cartItem.id}></i>
    `;

    cartContent.appendChild(div);
  }

  setUpApp() {
    //-> get cart from localStorage - update global cart
    cart = Storage.getCart() || [];

    //-> addCartItem to Modal
    cart.forEach((cartItem) => {
      const addCartBtn = document.querySelector(`[data-id="${cartItem.id}"]`);
  
      if (addCartBtn) {
        addCartBtn.innerText = 'Added';
        addCartBtn.disabled = true;
      }
  
      this.addCartItem(cartItem);
    });

    // set values: price + item
    this.setCartValue(cart);
  }
}

/*==================== localStorage ===================*/
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProducts(id) {
    const _products = JSON.parse(localStorage.getItem('products'));

    // parseInt(): convert string to integer
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return JSON.parse(localStorage.getItem('cart'));
  }
}

/*================ Show products on DOM ===============*/
document.addEventListener('DOMContentLoaded', () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getCartBtns();

  //-> get card and set up app
  ui.setUpApp();

  Storage.saveProducts(productsData);
});
