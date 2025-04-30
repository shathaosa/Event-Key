window.addEventListener("DOMContentLoaded", async () => {
    const formData = JSON.parse(localStorage.getItem("bookings"));
    if (!formData || !Array.isArray(formData)) {
      console.error("Missing or invalid bookings data:", formData);
      document.getElementById("bookingsContainer").innerText = "Missing booking information. Please sign up again.";
      return;
    }

    console.log("Bookings data from localStorage:", formData);

    const tableContainer = document.getElementById("bookingsContainer");
    tableContainer.innerHTML = '';

    const table = document.createElement("table");
    table.setAttribute("id", "booking-table");
    table.classList.add("content-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Title", "Date", "Type", "Description", "Tax", "Total", "Children"];

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.innerText = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    formData.forEach(booking => {
        const row = document.createElement("tr");

        const childrenLabel = booking.children ? "Yes" : "No";

        const values = [
            booking.Event_title || "N/A",
            new Date(booking.Event_Date).toLocaleDateString(),
            booking.type || "N/A",
            booking.description || "N/A",
            booking.tax || "N/A",
            booking.total || "N/A",
            childrenLabel
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.innerText = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
});
