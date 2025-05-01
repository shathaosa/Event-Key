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
  document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const errorMessage = document.getElementById('errorMessage');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const submitBtn = document.querySelector('.submit-btn');
    const loadingIcon = document.querySelector('.loading-icon');

    // Load existing reviews
    showExistingReviews();

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.classList.add('loading');
        loadingIcon.style.display = 'inline-block';

        const formData = {
            rating: document.querySelector('input[name="rating"]:checked')?.value,
            reviewText: document.getElementById('reviewText').value,
            likedFeatures: [...document.querySelectorAll('input[name="liked_features"]:checked')]
                          .map(input => input.value),
            recommendation: document.querySelector('input[name="would_recommend"]:checked').value,
            timestamp: new Date().toISOString()
        };

        if (!formData.rating) {
            showError('Please select a rating');
            return;
        }

        try {
            // Save to localStorage
            const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];
            existingReviews.push(formData);
            localStorage.setItem('reviews', JSON.stringify(existingReviews));

            // Show confirmation
            reviewForm.reset();
            reviewForm.style.display = 'none';
            thankYouMessage.style.display = 'block';
            showExistingReviews();
        } catch (error) {
            showError('Error submitting review. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            loadingIcon.style.display = 'none';
        }
    });

    function showExistingReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviewsContainer.innerHTML = '';

        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const date = new Date(review.timestamp).toLocaleDateString();
            
            reviewCard.innerHTML = `
                <div class="review-meta">
                    <span>${date}</span>
                    <div class="review-rating">${stars}</div>
                </div>
                ${review.reviewText ? `<p class="review-text">${review.reviewText}</p>` : ''}
                ${review.likedFeatures.length ? `
                    <p class="review-features">
                        Liked: ${review.likedFeatures.join(', ')}
                    </p>` : ''}
                <p class="review-recommendation">Recommendation: ${review.recommendation}</p>
            `;

            reviewsContainer.appendChild(reviewCard);
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

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
});
