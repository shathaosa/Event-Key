const storesSection = document.querySelector('.stores-cards');
const storeCard = document.querySelector(".store-card");
const storeImg = document.querySelector(".store-image");
const storeName = document.querySelector(".store-name");
const storeLocation = document.querySelector(".store-location");
const storeBudget = document.querySelector(".store-budget");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

const dateInput = document.querySelector("#date");
const errorMessage = document.getElementById("error-message");
const quantity = document.querySelector("#cart-quantity");
let quantityValue = 0;

const cartIcon = document.querySelector('#cart-icon');
const cartInfo = document.querySelector('#cart-info');
const closeCart = document.querySelector('#close-cart');
const cartItemsBody = document.getElementById("cart-items-body");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");

const allCategories = document.getElementById("all");
const venuesCategory = document.getElementById("venues");
const musicCategory = document.getElementById("music");
const cateringCategory = document.getElementById("catering");
const flowersCategory = document.getElementById("flowers");
const photographersCategory = document.getElementById("photographers");
const decorCategory = document.getElementById("decor");

let cartRowCount = cartItemsBody.querySelectorAll("tr").length;
let data = []; // Array to store retrieved data
let selected = []; // Array to store selected items


// Assign event listeners
cartIcon.addEventListener('click', toggleCartVisibility);

if (closeCart) closeCart.addEventListener('click', closeCartInfo);

addToCartButtons.forEach((button) => button.addEventListener("click", addToCart));

cartItemsBody.addEventListener("click", removeCartItem);

clearCartBtn.addEventListener("click", clearCart);


// Set initial quantity value based on existing cart items
if (!(cartRowCount === 0)) {
    quantityValue = cartRowCount;
    quantity.style.display = "inline";
    quantity.innerHTML = `${quantityValue}`;
    console.log(`Cart Row Count: ${cartRowCount}`);
}
else {
    noItemsInCart();
}

if (dateInput) {
    dateInput.addEventListener("input", () => {
        if (dateInput.value) {
            errorMessage.style.display = "none";
        }
    });
}

function toggleCartVisibility(event) {
    event.preventDefault();
    cartInfo.style.display = cartInfo.style.display === 'none' ? 'block' : 'none';
}

function closeCartInfo() {
    cartInfo.style.display = 'none';
}

function updateCartQuantity(change) {
    quantityValue += change;
    quantity.style.display = quantityValue > 0 ? "inline" : "none";
    quantity.innerHTML = `${quantityValue}`;
}

function findCartItem(vendor) {
    return Array.from(cartItemsBody.querySelectorAll("tr")).find(row => {
        const vendorCell = row.querySelector("td:nth-child(2)");
        return vendorCell && vendorCell.textContent === vendor;
    });
}

function addCartRow(category, vendor, price) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${category}</td>
        <td>${vendor}</td>
        <td>${price}</td>
        <td class="remove-item"><button id="remove-row"><i class="fa-solid fa-xmark"></i></button></td>
    `;
    cartItemsBody.appendChild(newRow);
}

function handleEmptyCart() {
    if (cartItemsBody.querySelectorAll("tr").length === 0) {
        noItemsInCart();
    }
}

function addToCart(event) {
    const button = event.target;
    const storeCard = button.closest('.store-card'); // Get the specific store card
    const vendor = storeCard.querySelector('.store-name').textContent; // Get vendor name from the card

    if (!dateInput || !dateInput.value) {
        errorMessage.textContent = "Please select a date before adding items to the cart.";
        return;
    }

    if (!findCartItem(vendor)) {
        const noItemsRow = cartItemsBody.querySelector("tr td[colspan='4']");
        if (noItemsRow) noItemsRow.parentElement.remove();

        updateCartQuantity(1);

        const item = data.find(store => store.vendor === vendor);
        const category = item ? item.category : "Unknown Category";
        const price = item ? item.price : "Unknown Price";
        selected.push(item);
        console.log(selected);

        addCartRow(category, vendor, price);
    }
}

function removeCartItem(event) {
    if (event.target.closest(".remove-item")) {
        const row = event.target.closest("tr");
        const vendor = row.querySelector("td:nth-child(2)").textContent;
        row.remove();

        updateCartQuantity(-1);
        selected = selected.filter(item => item.vendor !== vendor);
        console.log(selected);

        handleEmptyCart();
    }
}

function clearCart() {
    cartItemsBody.innerHTML = "";
    updateCartQuantity(-quantityValue);
    selected = [];
    handleEmptyCart();
}

function noItemsInCart() {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td colspan="4" style="height: 100px;text-align: center;font-size: 1em; font-weight: 500;">No items in the cart!</td>
    `;
    cartItemsBody.appendChild(newRow);
}

// To make the cart draggable
dragElement(document.getElementById("cart-info"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



function fetchUserData() {
    // Display loading text
    storesSection.innerHTML = '<p class="loading-text">Loading stores...</p>';

    fetch('http://localhost:3000/explore')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            data = items;
            displayStores(data); // Display stores after fetching
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Show error message
            storesSection.innerHTML = '<p class="error-text">Failed to load stores. Please try again later.</p>';
        });
}

// Add 'selected' class to allCategories by default
allCategories.classList.add('selected');

// Add event listeners to category buttons
const categoryButtons = [allCategories, venuesCategory, musicCategory, cateringCategory, flowersCategory, photographersCategory, decorCategory];
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'selected' class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('selected'));
        // Add 'selected' class to the clicked button
        button.classList.add('selected');
        // Filter stores based on the selected category
        const category = button.id === 'all' ? null : button.id;
        displayStores(data, category);
    });
});

function displayStores(stores, filterCategory = null) {
    storesSection.innerHTML = ''; // Clear existing content

    const filteredStores = filterCategory
        ? stores.filter(store => store.category.toLowerCase() === filterCategory.toLowerCase())
        : stores;

    if (filteredStores.length === 0) {
        storesSection.innerHTML = '<p class="error-text">No stores found for the selected category.</p>';
        return;
    }

    filteredStores.forEach(store => {
        const storeCard = document.createElement('div');
        storeCard.classList.add('store-card');

        const storeImage = document.createElement('div');
        storeImage.classList.add('store-image');
        const img = document.createElement('img');
        img.setAttribute('alt', 'Store Image');
        img.src = store.image || 'path/to/default-image.jpg'; // Fallback image
        storeImage.appendChild(img);

        const storeName = document.createElement('h4');
        storeName.classList.add('store-name');
        storeName.textContent = store.vendor;

        const storeLocation = document.createElement('p');
        storeLocation.classList.add('store-location');
        storeLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${store.location}`;

        const storeBudget = document.createElement('p');
        storeBudget.classList.add('store-budget');
        storeBudget.textContent = Number(store.price).toLocaleString(); // Format price with commas

        const budgetImg = document.createElement('img');
        budgetImg.src = '/Media/Riyal.png'; 
        budgetImg.alt = 'Riyal Icon';
        budgetImg.style.marginLeft = '5px'; 
        budgetImg.width= 15;
        storeBudget.appendChild(budgetImg);

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.onclick = addToCart;

        storeCard.append(storeImage, storeName, storeLocation, storeBudget, addToCartButton);
        storesSection.appendChild(storeCard);
    });
}

// Fetch data when the page loads
window.onload = fetchUserData;

checkoutBtn.onclick = function () {
    const selectedData = JSON.stringify(selected);
    const encodedData = encodeURIComponent(selectedData);
    window.location.href = `Host.html?selected=${encodedData}`;
};
