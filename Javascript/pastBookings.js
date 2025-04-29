window.onload = function() {
    viewBookings();
};

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
