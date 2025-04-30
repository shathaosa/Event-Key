document.addEventListener("DOMContentLoaded", () => {
    const host = JSON.parse(localStorage.getItem("hostFormData"));
    const booking = JSON.parse(localStorage.getItem("bookingData"));

    if (!host || !booking) {
        alert("Missing host or booking data.");
        return;
    }

    // Display host data
    document.getElementById("host-title").textContent = host.title || "-";
    document.getElementById("host-name").textContent = `${host.fname || ""} ${host.lname || ""}`.trim() || "-";
    document.getElementById("host-dob").textContent = host.dob || "-";
    document.getElementById("host-country").textContent = host.code || "-";
    document.getElementById("host-contact").textContent = host.contact || "-";
    document.getElementById("host-email").textContent = host.email || "-";

    // Display booking data
    document.getElementById("event-title").textContent = booking.eventTitle || "-";
    document.getElementById("booking-type").textContent = booking.eventType || "-";
    document.getElementById("booking-description").textContent = booking.eventDescription || "-";
    document.getElementById("booking-children").textContent = booking.noChildren === "true" ? "Yes" : "No";
});



document.addEventListener('DOMContentLoaded', function() {
    const butterfly = document.querySelector('.butterfly');
    const colors = [
      { wing: ['#ff9a9e', '#fad0c4'], body: ['#5433FF', '#20BDFF'] },
      { wing: ['#a1c4fd', '#c2e9fb'], body: ['#FF5F6D', '#FFC371'] },
      { wing: ['#84fab0', '#8fd3f4'], body: ['#4776E6', '#8E54E9'] },
      { wing: ['#ffc3a0', '#ffafbd'], body: ['#614385', '#516395'] }
    ];
    
    let currentColor = 0;
    
    function changeColors() {
      const colorSet = colors[currentColor % colors.length];
      
      document.querySelectorAll('.left-wing, .right-wing').forEach(wing => {
        wing.style.background = `linear-gradient(135deg, ${colorSet.wing[0]}, ${colorSet.wing[1]})`;
      });
      
      document.querySelector('.body').style.background = 
        `linear-gradient(to bottom, ${colorSet.body[0]}, ${colorSet.body[1]})`;
      
      document.querySelectorAll('.antenna').forEach(antenna => {
        antenna.style.background = 
          `linear-gradient(to bottom, ${colorSet.body[0]}, ${colorSet.body[1]})`;
      });
      
      currentColor++;
    }
    
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
  });