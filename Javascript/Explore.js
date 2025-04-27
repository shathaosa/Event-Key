const storeCard = document.getElementById("store-card");
const storeImg = document.getElementById("store-image");
const storeName = document.getElementById("store-name");
const storeLocation = document.getElementById("store-location");
const storeBudget = document.getElementById("store-budget");
const addToCart = document.getElementById("add-to-cart");

const quantity = document.getElementById("cart-quantity");
let quantityValue = 0;

addToCart.addEventListener("click", function () {
    quantityValue++;
    quantity.style.display = "inline"; 
    quantity.innerHTML = `${quantityValue}`; 
});