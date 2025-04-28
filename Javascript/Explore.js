const storeCard = document.getElementById("store-card");
const storeImg = document.getElementById("store-image");
const storeName = document.getElementById("store-name");
const storeLocation = document.getElementById("store-location");
const storeBudget = document.getElementById("store-budget");

const cartIcon = document.getElementById('cart-icon');
const cartInfo = document.getElementById('cart-info');
const closeCart = document.getElementById('close-cart');

const addToCartButtons = document.querySelectorAll("#add-to-cart");
const quantity = document.getElementById("cart-quantity");
let quantityValue = 0;

const cartItemsBody = document.getElementById("cart-items-body");
const clearCartBtn = document.getElementById("clear-cart");

let cartRowCount = cartItemsBody.querySelectorAll("tr").length;

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

// Functions
function toggleCartVisibility(event) {
    event.preventDefault();
    cartInfo.style.display = cartInfo.style.display === 'none' ? 'block' : 'none';
}

function closeCartInfo() {
    cartInfo.style.display = 'none';
}

function addToCart() {
    const vendor = storeName.textContent; // Get the vendor name
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

        // Add item details to the cart table
        const category = "Category Name";
        const price = "$$$$";

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
        row.remove();
        quantityValue--;
        quantity.innerHTML = `${quantityValue}`;
        if (quantityValue === 0) {
            quantity.style.display = "none";
        }
        cartRowCount--; // Update and log the row count
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


