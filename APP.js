// ( STEP 03: is product.js)
// ( STEP 04 )
import { productsData } from "./Products.js";

// ( STEP 01 )---Cart Item Modal---
// get purchase basket:
const cartBtn = document.querySelector(".cart-btn");
// get cart of backdrop:
const cartModal = document.querySelector(".cart");
// get backdrop:
const backDrop = document.querySelector(".backdrop");
// get confirm btn:
const closeModal = document.querySelector(".cart-item-confirm");

// ( STEP 09 )
const productsDOM = document.querySelector(".products-center");
// ( STEP 23 )---total price in cart---
const cartTotal = document.querySelector(".cart-total");
// ( STEP 24 )---number balay sabad---
const cartItems = document.querySelector(".cart-items");
// ( STEP 29 )---mohtava vasati cart---
const cartContent = document.querySelector(".cart-content");
// ( STEP 35 )---hamon btn clear dakhele cart---
const clearCart = document.querySelector(".clear-cart");

// ( STEP 16 )---baray sabade kharid in array khali ru dorost mikonim---
let cart = [];

// (STEP 41 )---ye motaghayer baray gereftn btn hay roy dom->global mikonim ke method hay dige ham dastresi behesh dashte bashan
let buttonsDOM = [];

/* --------------> (A) GET PRODUCTS <--------------- */
// ( STEP 05 )
class Products {
  getProducts() {
    return productsData;
  }
}

/* --------------> (B) DISPLAY PRODUCTS <-------------- */
class UI {
  // ( STEP 07 )
  displayProducts(products) {
    let result = "";
    // forEach: be in elat mizanim chon 1done tarif kardim ama chandin product darim va miad ru har kodom az onha in loop ru mizane
    products.forEach((item) => {
      result += `<div class="product">
      <div class="img-container">
        <img class="product-img" src=${item.imageUrl} />
      </div>
      <div class="product-desc">
        <p class="product-title">
          ${item.title}
        </p>
        <p class="product-price">$ ${item.price}</p>
      </div>
      <button class="add-to-cart" data-id=${item.id}>Purchase</button>
    </div>`;
      // result balayi ru bayad be ye jayi az mororgar(products-center) append konam:
      // ( STEP 10 )
      productsDOM.innerHTML = result;
    });
  }

  // ( STEP 14 )---vaghti roy btn producti click mishe az koja bedonim kodom product click khorde?---
  getAddToCartBtn() {
    // convert NODList to array: (spread operator)
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];

    // ( STEP 42 )---btn hay roy DOM ru brgirim(hamon dokmehay purchase)
    buttonsDOM = addToCartBtns;

    // ( STEP 15 )---vaghti producti to sabade kharid bashe, be user begam ke in pro dakhele sabad hast---
    addToCartBtns.forEach((btn) => {
      // id done done az btnha ru begiram:
      const id = btn.dataset.id;

      // ( STEP 17 )---check if this product id is in the cart or not---
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "Added";
        // user bad az ezafe shodan be cart natone ru btn click kone
        btn.disabled = true;
      }
      // age product dakhele cart bod in balayi ru neshon mide

      // ( STEP 18 )---age product dakhele cart nabod, logic app ru bnevisim---
      btn.addEventListener("click", (event) => {
        event.target.innerText = "Added";
        event.target.disabled = true;

        // ( STEP 20 )---get product from products--- quantity baray ine ke bedonim ghablan be cart add shode ya na
        const addedProduct = { ...Storage.getProducts(id), quantity: 1 };
        // be in dalil az Spread Op es mikonim, ke Obj jadidi ru be in Obj ghadimimon ezafe konim

        // add to cart---ye cart jadid dorost mikoim va carthay ghabli ru dakhelesh ba spread op copy mikonim
        cart = [...cart, addedProduct];

        // ( STEP 21 )---save cart to local storage
        Storage.saveCart(cart);

        // ( STEP 26 )---update cart value
        this.setCartValue(cart);
        // THIS, ru es mikonim, boro in method ru begir va inja baram render begir

        // ( STEP 27 )---add to cart item---on chizi ru ke user toy DOM set karde ru ezafe kon
        this.addCartItem(addedProduct);
        // get cart from storage !
      });
    });
  }

  // ( STEP 25 )---update meghdare cart---
  setCartValue(cart) {
    // 1. cart items :
    // 2. cart total price :
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      // har seri ke product be cart ezafe mishe meghdar on update shavad
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `Total price: ${totalPrice.toFixed(2)} $`;
    // toFixed(2): baray tabdil be 2 raghame ashar
    cartItems.innerText = tempCartItems;
  }

  // ( STEP 28 )
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img
              src=${cartItem.imageUrl}
              class="cart-item-img"
            />
            <div class="cart-item-desc">
              <h4>${cartItem.title}</h4>
              <h5>$ ${cartItem.price}</h5>
            </div>
            <div class="cart-item-controller">
              <i class="fa-solid fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fa-solid fa-chevron-down" data-id=${cartItem.id}></i>
            </div>
              <i class="fa-regular fa-trash-can" data-id=${cartItem.id}></i>
   `;
    //  (STEP 30 )---in div ke sakhtim ru be cart content roy DOM(mohtava tozihat cart) ezafe mikonim
    cartContent.appendChild(div);
  }

  // ( STEP 33 )
  setUpApp() {
    // get cart from storage :
    cart = Storage.getCart() || [];

    // add cartItem
    cart.forEach((cartItem) => this.addCartItem(cartItem));

    // dobare meghdar cart ru update mikonim---set values: price + item
    this.setCartValue(cart);
  }

  // ( STEP 34 ) tamame etefaghate dakhele cart: delete, remove, add kardan cart inja minevisim
  cartLogic() {
    // ( STEP 36 ) clear cart ru migirim -> ( STEP 40 ) bad method clearCart ru taarif
    clearCart.addEventListener("click", () => this.clearCart());

    // ( STEP 44 ) cart functionality--> btn hay kam v ziad kardan product dakhele cart
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;

        // ( STEP 45 ) get item from cart--> (event.target.dataset.id: gereftan chevron up)
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;

        // (STEP 46 ) update cart value
        this.setCartValue(cart);

        // (STEP 47 ) save cart
        Storage.saveCart(cart);

        // ( STEP 48 ) update cart item in UI--> meghdare va tedad number cart kamo ziad beshe
        // nextElementSibling: vaghti ru chevron click mikonam, on number ru begire
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
        // ( STEP 49 ) get trash can
      } else if (event.target.classList.contains("fa-trash-can")) {
        const removeItem = event.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);

        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);

        // ( STEP 50 ) remove kardan az roy cart content
        cartContent.removeChild(removeItem.parentElement);

        // ( STEP 51 ) get chevron down--> remove from cartItem
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const substractedItem = cart.find(
          (c) => c.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          
        }
        substractedItem.quantity--;

        // update cart value
        this.setCartValue(cart);

        //  save cart
        Storage.saveCart(cart);

        // update cart item in UI
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }

  // ( STEP 39 ) btn clear cart
  clearCart() {
    // remove: (DRY: don't Repeat Yourself)
    cart.forEach((cItem) => this.removeItem(cItem.id));
    // remove cart content children
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    // bade inke cart clear shod baste ham beshe
    closeModalFunction();
  }

  // ( STEP 38 )
  removeItem(id) {
    // update cart--> filter: on chizi ru ke ma mikhaymo ru hazf kone va on ru return nakone
    cart = cart.filter((cItem) => cItem.id !== id);
    // update total price and cart items:
    this.setCartValue(cart);
    // update storage:
    Storage.saveCart(cart);

    // ( STEP 44 ) get add to cart btns--> update text and disable
    this.getSingleButton(id);
  }

  // ( STEP 43 )
  getSingleButton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "Purchase";
    button.disabled = false;
  }
}

/* ----------------> (C) STORAGE <---------------- */
class Storage {
  // ( STEP 11 ) vaghti safhe refresh mishe etelaat dakhel browser monde bashe
  // vaghti 'static' mizarim digar niaz be NEW kardan nist
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
    // JSON.stringify: vorodi ru begir(products) va stringesh kon va esmesho bezar 'products'
  }

  // ( STEP 19 ) get product from products from local storage
  static getProducts(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
    // chon products hamon ham string ham number darand dar natije--> parseInt mikonim
  }

  // ( STEP 22 )
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ( STEP 32 ) inja cartha ru az storage migirim
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

// ( STEP 06 ) when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  // ( STEP 08 )
  const ui = new UI();
  ui.displayProducts(productsData);

  // ( STEP 13 )
  ui.getAddToCartBtn();

  // ( STEP 31 ) vaghti app reload mishe mire set up mikone application, local storage ru migire va cartha ru check mikone--> get cart and set up app
  ui.setUpApp();

  // ( STEP 37 )
  ui.cartLogic();

  // ( STEP 12 )chon bala 'static' zadim digar niazi be new kardan nist, mesle ui
  Storage.saveProducts(productsData);
});

// ( STEP 02 ) Cart Item Modal--> how to display or hide backdrop:
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

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
