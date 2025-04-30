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
