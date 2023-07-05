/*==================== Document Title ===================*/
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Follow me 😍' : 'on GitHub ✌';

  alertShow = !alertShow;
}, 1000);

/*======================== Modal =====================*/

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
