const storeCard = document.querySelector(".store-card");
const storeImg = document.querySelector(".store-image");
const storeName = document.querySelector(".store-name");
const storeLocation = document.querySelector(".store-location");
const storeBudget = document.querySelector(".store-budget");

const cartIcon = document.querySelector('#cart-icon');
const cartInfo = document.querySelector('#cart-info');
const closeCart = document.querySelector('#close-cart');

const addToCartButtons = document.querySelectorAll(".add-to-cart");
const quantity = document.querySelector("#cart-quantity");
let quantityValue = 0;

const cartItemsBody = document.getElementById("cart-items-body");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");

let cartRowCount = cartItemsBody.querySelectorAll("tr").length;
let data = []; // Array to store retrieved data
let selected=[]; // Array to store selected items

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

// Assign event listeners
cartIcon.addEventListener('click', toggleCartVisibility);

if (closeCart) closeCart.addEventListener('click', closeCartInfo);

addToCartButtons.forEach((button) => button.addEventListener("click", addToCart));

cartItemsBody.addEventListener("click", removeCartItem);

clearCartBtn.addEventListener("click", clearCart);


function toggleCartVisibility(event) {
    event.preventDefault();
    cartInfo.style.display = cartInfo.style.display === 'none' ? 'block' : 'none';
}

function closeCartInfo() {
    cartInfo.style.display = 'none';
}

function addToCart(event) {
    const button = event.target; // Get the clicked button
    const storeCard = button.closest('.store-card'); // Find the parent store card
    const vendor = storeCard.querySelector('.store-name').textContent; // Get the vendor name

    const existingItem = Array.from(cartItemsBody.querySelectorAll("tr")).find(row => {
        const vendorCell = row.querySelector("td:nth-child(2)");
        return vendorCell && vendorCell.textContent === vendor; // Exclude rows without a vendor cell
    });

    if (!existingItem) {
        // Remove "No items in the cart!" row if it exists
        const noItemsRow = cartItemsBody.querySelector("tr td[colspan='4']");
        if (noItemsRow) {
            noItemsRow.parentElement.remove();
        }
        quantityValue++;
        quantity.style.display = "inline";
        quantity.innerHTML = `${quantityValue}`;

        // Retrieve item details from the data array
        const item = data.find(store => store.vendor === vendor);
        const category = item ? item.category : "Unknown Category";
        const price = item ? item.price : "Unknown Price";
        selected.push(item); // Add the selected item to the array
        console.log(selected); // Log the selected items

        // Add item details to the cart table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${category}</td>
            <td>${vendor}</td>
            <td>${price}</td>
            <td class="remove-item"><button id="remove-row"><i class="fa-solid fa-xmark"></i></button></td>
        `;
        cartItemsBody.appendChild(newRow);

        cartRowCount--; // Update and log the row count
    }
}

function removeCartItem(event) {
    if (event.target.closest(".remove-item")) {
        const row = event.target.closest("tr");
        const vendor = row.querySelector("td:nth-child(2)").textContent; // Get vendor name from the row
        row.remove();
        quantityValue--;
        quantity.innerHTML = `${quantityValue}`;
        if (quantityValue === 0) {
            quantity.style.display = "none";
        }
        cartRowCount--; // Update and log the row count

        // Remove the item from the selected array
        selected = selected.filter(item => item.vendor !== vendor);
        console.log(selected); // Log the updated selected items

        // Check if the cart is empty and add "No items in the cart!" row if it is
        if (cartItemsBody.querySelectorAll("tr").length === 0) {
            noItemsInCart();
        }
    }
}

function clearCart() {
    cartItemsBody.innerHTML = ""; // Clear all rows
    quantityValue = 0;
    quantity.style.display = "none";
    quantity.innerHTML = `${quantityValue}`;
    cartRowCount--; // Update and log the row count
    if (cartItemsBody.querySelectorAll("tr").length === 0) {
        noItemsInCart();
    }
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



// Function to fetch user data
function fetchUserData() {
    fetch('http://localhost:3000/explore')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            data = items; 
            displayStores(data); 
        })
        .catch(error => {
           console.error('Error fetching data:', error);
        });

}

function displayStores(stores) {
    const storesSection = document.querySelector('.stores-cards');
    storesSection.innerHTML = ''; // Clear any existing content

    stores.forEach(store => {
        // Create store card
        const storeCard = document.createElement('div');
        storeCard.classList.add('store-card'); // Use class instead of id for multiple cards

        // Create store image
        const storeImage = document.createElement('div');
        storeImage.classList.add('store-image');
        img=document.createElement('img');
        storeImage.appendChild(img);
        img.setAttribute('alt', 'Store Image'); // Set alt attribute for accessibility
        img.src = store.image; // Set background image

        // Create store name
        const storeName = document.createElement('h4');
        storeName.classList.add('store-name');
        storeName.textContent = store.vendor; // Use vendor as store name

        // Create store location
        const storeLocation = document.createElement('p');
        storeLocation.classList.add('store-location');
        storeLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${store.category}`; // Use category for location

        // Create store budget
        const storeBudget = document.createElement('p');
        storeBudget.classList.add('store-budget');
        storeBudget.textContent = '$$$$'; // Update as needed

        // Create add to cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.onclick = addToCart; // Add event listener for adding to cart

        // Append elements to the store card
        storeCard.appendChild(storeImage);
        storeCard.appendChild(storeName);
        storeCard.appendChild(storeLocation);
        storeCard.appendChild(storeBudget);
        storeCard.appendChild(addToCartButton);

        // Append store card to the section
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
