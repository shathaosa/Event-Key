window.addEventListener("DOMContentLoaded", async () => {
    const formData = JSON.parse(localStorage.getItem("hostFormData"));
    if (!formData || !formData.email || !formData.contact) {
      document.getElementById("bookingsContainer").innerText = "Missing login information.";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/userBookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          contact: formData.contact,
        }),
      });
  
      const data = await response.json();
  
      if (!data.success || !data.bookings || data.bookings.length === 0) {
        document.getElementById("bookingsContainer").innerText = "No bookings found.";
        return;
      }
  
      const tableContainer = document.getElementById("bookingsContainer");
      tableContainer.innerHTML = '';
  
      const table = document.createElement("table");
      table.setAttribute("id", "booking-table");
      table.classList.add("content-table");
  
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const headers = ["Title", "Date", "Type", "Description", "Tax", "Total", "Children", "Products"];
  
      headers.forEach(headerText => {
        const th = document.createElement("th");
        th.innerText = headerText;
        headerRow.appendChild(th);
      });
  
      thead.appendChild(headerRow);
      table.appendChild(thead);
  
      const tbody = document.createElement("tbody");
      data.bookings.forEach(booking => {
        const row = document.createElement("tr");
  
        const childrenLabel = booking.children ? "No" : "Yes";
        const productList = booking.products.map(p => `${p.name} (${p.vendor})`).join(", ");
  
        const values = [
          booking.title,
          new Date(booking.date).toLocaleDateString(),
          booking.type,
          booking.description,
          booking.tax,
          booking.total,
          childrenLabel,
          productList
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
    } catch (error) {
      console.error("Error fetching bookings:", error);
      document.getElementById("bookingsContainer").innerText = "Error loading bookings.";
    }
  });
  