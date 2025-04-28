window.onload = function() {
    viewAccount();
};

function activate(active, unactive) {
    active.setAttribute("style", `
        background-color: #561050;
        color: #ffffff;
        padding: 10px;
        border: none;
        border-radius: 5px;
        margin-top: 10px;
        border-bottom-right-radius: 0px;
        border-bottom-left-radius: 0px;
    `);

    unactive.setAttribute("style", `
        background-color: #FFF5F1;
        color: black;
        border: none;
        border-bottom: 3px solid #561050;
        border-radius: 0px;
        cursor: pointer;
    `);
}

function viewBookings() {
    const bookingData = [
        {
            date: "2025-04-20",
            venue: "Venue A",
            flowers: "Roses, Lilies",
            photographer: "John Doe",
            catering: "Italian Cuisine",
            music: "Jazz Band",
            decoration: "Classical",
            Total: "236,000"
        },
        {
            date: "2025-04-19",
            venue: "Venue B",
            flowers: "Tulips, Orchids",
            photographer: "Jane Smith",
            catering: "Mexican Cuisine",
            music: "DJ",
            decoration: "Modern",
            Total: "300,000"
        }
    ];

    const tableContainer = document.getElementById("bookingsContainer");
    tableContainer.innerHTML = ''; 

    const table = document.createElement("table");
    table.setAttribute("id", "booking-table");
    table.classList.add("content-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Date", "Venue", "Flowers", "Photographer", "Catering", "Music", "Decoration", "Total"];

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.innerText = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    bookingData.forEach(booking => {
        const row = document.createElement("tr");

        Object.values(booking).forEach(value => {
            const td = document.createElement("td");
            td.innerText = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function viewAccount() {
    const accountData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        address: "123 Main Street, City, Country"
    };

    const container = document.getElementById("bookingsContainer");
    container.innerHTML = ''; 

    const accountDiv = document.createElement("div");
    accountDiv.classList.add("account-info");

    Object.entries(accountData).forEach(([field, value]) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.classList.add("account-field");

        const label = document.createElement("label");
        label.innerText = field.charAt(0).toUpperCase() + field.slice(1) + ": ";
        label.classList.add("account-label");

        const span = document.createElement("span");
        span.innerText = value;
        span.classList.add("account-value");

        const editIcon = document.createElement("i");
        editIcon.className = "fa-solid fa-pen-to-square edit-icon";
        editIcon.style.cursor = "pointer";
        editIcon.addEventListener("click", () => {
            if (span.isContentEditable) {
                span.contentEditable = "false";
                span.classList.remove("editing");
                editIcon.style.color = "#561050"; 
            } else {
                span.contentEditable = "true";
                span.focus();
                span.classList.add("editing");
                editIcon.style.color = "green"; 
            }
        });

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(span);
        fieldContainer.appendChild(editIcon);
        accountDiv.appendChild(fieldContainer);
    });

    container.appendChild(accountDiv);
}
