document.addEventListener("DOMContentLoaded", () => {
  // جلب البيانات من localStorage
  const host = JSON.parse(localStorage.getItem("hostFormData"));
  const booking = JSON.parse(localStorage.getItem("bookingData"));
  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (!host || !booking) {
      alert("Missing host or booking data.");
      return;
  }

  // show the data of host
  document.getElementById("host-title").textContent = host.title || "-";
  document.getElementById("host-name").textContent = `${host.fname || ""} ${host.lname || ""}`.trim() || "-";
  document.getElementById("host-dob").textContent = host.dob || "-";
  document.getElementById("host-country").textContent = host.code || "-";
  document.getElementById("host-contact").textContent = host.contact || "-";
  document.getElementById("host-email").textContent = host.email || "-";

  // show the data of booking
  document.getElementById("event-title").textContent = booking.eventTitle || "-";
  document.getElementById("booking-type").textContent = booking.eventType || "-";
  document.getElementById("booking-description").textContent = booking.eventDescription || "-";
  document.getElementById("booking-children").textContent = booking.noChildren === "true" ? "Yes" : "No";

  // show the data of products  
  const productsContainer = document.getElementById("booked-products");
  if (products.length === 0) {
      productsContainer.innerHTML = "<p class='no-products'>No products booked</p>";
  } else {
      let subtotal = 0;
      let html = "";
      
      products.forEach(product => {
          subtotal += product.price;
          
          // format the dtae
          const eventDate = new Date(product.date);
          const formattedDate = eventDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
          });
          
          html += `
          <div class="product-card">
              <img src="${product.image.replace(/\\/g, '/')}" alt="${product.vendor}" class="product-image">
              <div class="product-details">
                  <h3>${product.vendor}</h3>
                  <p class="product-category">${product.category}</p>
                  <div class="date-location">
                      <p><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                      <p><i class="fas fa-map-marker-alt"></i> ${product.location}</p>
                  </div>
                  <p class="product-price">${product.price.toLocaleString()} SAR</p>
              </div>
          </div>
          `;
      });

      productsContainer.innerHTML = html;
      
      // calucate the subtotal and tax and the total
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      
      document.getElementById("subtotal").textContent = `${subtotal.toLocaleString()} SAR`;
      document.getElementById("tax").textContent = `${tax.toLocaleString()} SAR`;
      document.getElementById("total").textContent = `${total.toLocaleString()} SAR`;
  }
});
    
    function moveButterfly() {
      const randomX = Math.random() * (window.innerWidth - 100);
      const randomY = Math.random() * (window.innerHeight - 100);
      
      butterfly.style.transition = 'all 4s cubic-bezier(0.4, 0, 0.2, 1)';
      butterfly.style.left = `${randomX}px`;
      butterfly.style.top = `${randomY}px`;
      
      setTimeout(() => {
        butterfly.style.transition = 'none';
      }, 4000);
    }
    
    // color change every 3 sec
    setInterval(changeColors, 3000);
    
    // the butterfly moves every 8sec
    setInterval(moveButterfly, 8000);
    
    
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      
      butterfly.style.transform = `
        translate(${x * 30}px, ${y * 30}px)
        rotate(${x * 10}deg)
      `;
    });
  