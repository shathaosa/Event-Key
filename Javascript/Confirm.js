document.addEventListener("DOMContentLoaded", () => {
  // localStorage
  const host = JSON.parse(localStorage.getItem("hostFormData"));
  const booking = JSON.parse(localStorage.getItem("bookingData"));
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  if (!host || !booking) {
    alert("Missing host or booking data.");
    return;
  }

  // host data
  document.getElementById("host-title").textContent = host.title || "-";
  document.getElementById("host-name").textContent = `${host.fname || ""} ${host.lname || ""}`.trim() || "-";
  document.getElementById("host-dob").textContent = host.dob || "-";
  document.getElementById("host-country").textContent = host.code || "-";
  document.getElementById("host-contact").textContent = host.contact || "-";
  document.getElementById("host-email").textContent = host.email || "-";

  // booking data
  document.getElementById("event-title").textContent = booking.eventTitle || "-";
  document.getElementById("booking-type").textContent = booking.eventType || "-";
  document.getElementById("booking-description").textContent = booking.eventDescription || "-";
  document.getElementById("booking-children").textContent = booking.noChildren === "true" ? "Yes" : "No";

  // products
  const productsContainer = document.getElementById("booked-products");
  if (products.length === 0) {
    productsContainer.innerHTML = "<p class='no-products'>No products booked</p>";
  } else {
    let subtotal = 0;
    let html = "";

    products.forEach(product => {
      subtotal += product.price;

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

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = `${subtotal.toLocaleString()} SAR`;
    document.getElementById("tax").textContent = `${tax.toLocaleString()} SAR`;
    document.getElementById("total").textContent = `${total.toLocaleString()} SAR`;
  }

  // reviews
  document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const booking = JSON.parse(localStorage.getItem("bookingData"));
    const event_id = booking.eventId; 
    

    const formData = {
      event_id: event_id,
        rating: document.querySelector('input[name="rating"]:checked')?.value,
        reviewText: document.getElementById('review').value,
        features: Array.from(document.querySelectorAll('input[name="features"]:checked'))
                    .map(cb => cb.value),
        recommendation: document.querySelector('input[name="recommend"]:checked')?.value
    };

    // before sendinng the data, validate it
    if (!formData.rating || !formData.recommendation) {
        alert('Please select a rating and recommendation');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/submit-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            alert('Review submitted successfully!');
            document.getElementById('reviewForm').reset();
        } else {
            alert(data.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please check your connection.');
    }
});



    // Animation trigger
    const checkmark = document.querySelector('.checkmark');
    setTimeout(() => {
        checkmark.classList.add('checkmark-animate');
    }, 100);
});

  // butterfly animation
  const butterfly = document.querySelector('.butterfly');

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

  // butterfly moves every 8 sec
  setInterval(moveButterfly, 8000);

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    butterfly.style.transform = `
      translate(${x * 30}px, ${y * 30}px)
      rotate(${x * 10}deg)
    `;
  });