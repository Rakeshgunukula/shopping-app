/* ========= PRODUCTS ========= */

const products = [
  { id:1, name:'iPhone 16 pro', image:'assets/iphone16pro.jpg', price:90000 },
  { id:2, name:'iPhone 17 pro', image:'assets/iphone17pro.jpg', price:100000 },
  { id:3, name:'iPhone 16', image:'assets/iphone16.jpg', price:72000 },
  { id:4, name:'Acer Aspire', image:'assets/aceraspire.jpg', price:42000 },
  { id:5, name:'iPhone 16 pro max', image:'assets/iphone16promax.jpg', price:120000 },
  { id:6, name:'Bed', image:'assets/bed.jpg', price:50000 },
  { id:7, name:'MacBook air', image:'assets/macbookair.jpg', price:80000 },
  { id:8, name:'Royal Enfield', image:'assets/royal.jpg', price:120000 },
];

// Formating Price according to indian currency

function formatPrice(price){
  return price.toLocaleString('en-IN');
}

function getCart(){
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

let cart = getCart();

/* ========= SCROLL ANIMATION ========= */

const logo = document.querySelector('.header .logo');
const input = document.querySelector('.inputcontainer input');
const header = document.querySelector('.header');
if(logo && input && header){
  window.addEventListener('scroll', ()=>{
    const maxScroll = 40;
    const progress = Math.min(window.scrollY / maxScroll, 1);
    // logo.style.opacity = 1 - progress;
    logo.style.transform = `scale(${1- progress})`;
    // input.style.transform = `translateX(${-2 * progress}%)`;
    input.style.flex = Math.min(0.6 + progress, 1);
    input.style.border = `${Math.min(1 + progress, 5)}px solid #ccc`;
    header.style.top = `${Math.min(-35 * progress)}px`;
    if(window.scrollY > 35){
      header.classList.add('shrink');
      input.classList.add('shrink');
    }
    else{
      header.classList.remove('shrink');
      input.classList.remove('shrink');
    }
  });
}
/* ========= DISPLAY PRODUCTS ========= */

function displayProducts(filter = ''){
  const container = document.querySelector('.productContainer');
  if(!container) return;

  container.innerHTML = '';

  products.forEach(product=>{
    if(product.name.toLowerCase().includes(filter)){
      container.innerHTML += `
        <div class="product">
          <div class="image">
            <img src="${product.image}">
          </div>
          <div class="productDetails">
            <p>${product.name}</p>
            <p>&#8377;${formatPrice(product.price)}</p>
          </div>
          <div class="productbtns">
            <button onclick="addToCart(${product.id}, this)">Add to cart</button>
            <button onclick="displayOrders(${product.id})">Order Now</button>
          </div>
        </div>
      `;
    }
  });
}

displayProducts();

/* ========= ADD TO CART ========= */

function addToCart(id, btn){
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if(item){
    item.quantity++;
  }else{
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  updateCartPage();

  // animation
  const img = btn.closest('.product').querySelector('img');
  const clone = img.cloneNode(true);
  const imgRect = img.getBoundingClientRect();
  const cartIcon = document.querySelector('.carticon');
  if(!cartIcon) return;

  const cartRect = cartIcon.getBoundingClientRect();

  clone.style.cssText = `
    position:fixed;
    top:${imgRect.top}px;
    left:${imgRect.left}px;
    width:${imgRect.width}px;
    padding:5px;
    height:${imgRect.height}px;
    transition:all 1s ease;
    z-index:100;
  `;

  document.body.appendChild(clone);

  requestAnimationFrame(()=>{
    clone.style.top = cartRect.top + 'px';
    clone.style.left = cartRect.left + 'px';
    clone.style.width = '20px';
    clone.style.height = '20px';
    clone.style.opacity = '0.7';
  });

  clone.addEventListener('transitionend', ()=> clone.remove());
}

/* ========= CART COUNT (HEADER) ========= */

function updateCartCount(){
  const el = document.querySelector('.productCount');
  if(!el) return;

  let total = 0;
  cart.forEach(i => total += i.quantity);
  el.textContent = total;
}

/* ========= PRODUCT SEARCH ========= */

const productInput = document.querySelector('#productInput');
if(productInput){
  productInput.addEventListener('input', ()=>{
    displayProducts(productInput.value.toLowerCase());
  });
}

/* ========= CART PAGE ========= */

function updateCartPage(filter = ''){
  const container = document.querySelector('.cartcontainer');
  if(!container) return;

  container.innerHTML = '';

  if(cart.length === 0){
    const cartE1 = document.createElement('div');
    cartE1.className = 'cartE1';
    cartE1.innerHTML = `Your cart is empty`;
    container.appendChild(cartE1);
    setTimeout(()=>{
      location.href = 'index.html';
    },3000)
  }

  cart.forEach(item=>{
    if(item.name.toLowerCase().includes(filter)){
      container.innerHTML += `
        <div class="cartItem">
          <div class="cartImage">
            <img src="${item.image}">
          </div>

          <div class="cartBtns">
            <button onclick="decreaseQty(${item.id})">-</button>
            <span class="cartCount">${item.quantity}</span>
            <button onclick="increaseQty(${item.id})">+</button>
          </div>

          <div class="cartItemName">${item.name}</div>
          <div class="cartItemPrice">&#8377;${formatPrice(item.price * item.quantity)}</div>
          <button class="remove" onclick="removeItem(${item.id})">Remove</button>
        </div>
      `;
    }
  });

  updateTotal();
}

/* ========= CART SEARCH ========= */

const cartInput = document.querySelector('#cartInput');
if(cartInput){
  cartInput.addEventListener('input', ()=>{
    updateCartPage(cartInput.value.toLowerCase());
  });
}

/* ========= QUANTITY CONTROLS ========= */

function increaseQty(id){
  cart.find(i => i.id === id).quantity++;
  saveCart();
  updateCartPage();
  updateCartCount();
}

function decreaseQty(id){
  cart.forEach((item,index)=>{
    if(item.id === id){
      if(item.quantity > 1){
        item.quantity--;
      }
      else{
        cart.splice(index,1);
      }
    }
  })
  saveCart();
  updateCartPage();
  updateCartCount();
}

// remove cart items with animations
function removeItem(id){
  cart.forEach((item,index)=>{
    if(item.id === id){
      cart.splice(index,1);
    }
  })
  saveCart();
  updateCartPage();
  updateCartCount();
}

// =========Remove Items by clicking the one single button

  function removeItems(){
  const items = document.querySelectorAll('.cartItem');

  if(items.length === 0) return;

  let index = 0;

  function removeNext(){
    if(index >= items.length){
      cart = [];
      saveCart();
      updateCartPage();
      updateCartCount();
      return;
    }

    const currentItem = items[index];
    currentItem.classList.add('remove');

    setTimeout(()=>{
      index++;
      removeNext();
    },400);
  }

  removeNext();
}

 

/* ========= TOTAL ========= */

function updateTotal(){
  const el = document.querySelector('.totalPrice b');
  if(!el) return;
  let total = 0;
  cart.forEach(i => total += i.price * i.quantity);
  el.textContent = formatPrice(total);
}

//==================Orders code
// Formating dates
const formater = new Intl.DateTimeFormat('en-IN',{
  weekday:'short',
  month:'short',
  day:'2-digit',
  year:'numeric',
  hour:'2-digit',
  minute:'2-digit',
  hour12:true,
});
function getOrders(){
  return JSON.parse(localStorage.getItem('orders')) || [];
}
let orders = getOrders();
  function displayOrders(id){
    const orderedItem = products.find(product => product.id === id);
    orders.push({...orderedItem, time:formater.format(Date.now())});
    saveorders();
    updateOrders();
  }

  // saveorders

  function saveorders(){
    localStorage.setItem('orders',JSON.stringify(orders));
  }
  function updateOrders(filter = ''){
    const ordersContainer = document.querySelector('.ordersContainer');
    if(!ordersContainer)return;
    ordersContainer.innerHTML = '';
    orders.forEach((order)=>{
      if(order.name.toLowerCase().includes(filter)){
      ordersContainer.innerHTML += `
       <div class="orderItem">
        <img src="${order.image}" alt="">
        <div class="orderName">${order.name}</div>
        <div class="orderPrice">&#8377;${formatPrice(order.price)}</div>
        <div class="status">
        <div class="step active">
        <div class="tick"></div>
  </div>
  <div class="line"></div>
  <div class="step">
    <div class="tick"></div>
  </div>
  <div class="ordered">Ordered</div>
  <div class="navBtn">></div>
</div>
<marquee class="orderDate">${order.time}</marquee>
</div>
</div>`;
    }
    });
  }
    // filter orders using filter method
    const orderInput = document.querySelector('#orderInput');
    if(orderInput){
      orderInput.addEventListener('input',()=>{
        updateOrders(orderInput.value.toLowerCase());
      });
    };

    setTimeout(()=>{
  const orderItems = document.querySelectorAll('.orderItem');

  orderItems.forEach(item => {
    const steps = item.querySelectorAll('.step');
    const line  = item.querySelector('.line');

    if(line) line.classList.add('active');
    if(steps[1]) steps[1].classList.add('active');
  });

},1500);
  // Removing Items
  function clearOrders(){
  const orderItems = document.querySelectorAll('.orderItem');
  if(orderItems.length === 0)return;
  let index = 0;
  function removeNext(){
    if(index >= orderItems.length){
      // clear storage after animation
      orders = [];
      localStorage.removeItem('orders');
      updateOrders();
      return;
    }

    const item = orderItems[index];
    item.classList.add('remove');

    setTimeout(()=>{
      index++;
      removeNext();
    },500); // speed control
  }

  removeNext();
}

    // animation after render orders

/* ========= NAV ========= */
// Add event listener to cart
const cartIcon = document.querySelector('.carticon');
const ordersBtn = document.querySelector('.orders button');
if(cartIcon){
  cartIcon.addEventListener('click', ()=> location.href = 'cart.html');
  // ordersBtn.addEventListener('click',()=> location.href = 'orders.html');
}


document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();        
  updateCartPage();       
  updateOrders();    
});
