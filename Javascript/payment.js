const form = document.querySelector("#form");
const btn = document.getElementById("smt");
const msg = document.createElement("div");
msg.id = "msg";
form.append(msg);
hostInfo = {};
bookingInfo = {};


document.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('hostFormData'); // Retrieve hostFormData

  if (storedData) {
    const formData = JSON.parse(storedData);

    // Store data in an object called hostInfo
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        hostInfo[key] = formData[key]; // Assign value directly to the object
      }
    }
    console.log("Host Info:", hostInfo); // Debugging output
  }

  const storedBookingData = localStorage.getItem('bookingData'); // Retrieve bookingData
  if (storedBookingData) {
    const bookingData = JSON.parse(storedBookingData);

    // Store booking data in an object called bookingInfo
    for (const key in bookingData) {
      if (bookingData.hasOwnProperty(key)) {
        bookingInfo[key] = bookingData[key]; // Assign value directly to the object
      }
    }
    console.log("Booking Info:", bookingInfo); // Debugging output
  }

});

// Attach the event listener to the form, not the button
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.disabled = true; // Disable the button to prevent multiple submissions
  btn.classList.remove("confirm-button"); // Remove the original class
  btn.classList.add("disabled"); // Add the disabled class



  let messages = [];
  console.log("Items", items); // Debugging output
  messages = isFilled("holderName", messages, "Card holder's name is missing");
  messages = isFilled("cardNumber", messages, "Card number is missing");
  messages = isCard("cardNumber", messages, "Invalid Card number");
  messages = isFilled("expiry", messages, "Expiry Date is missing");
  messages = isFilled("cvc", messages, "CVC is missing");
  messages = isCVC("cvc", messages, "Invalid CVC");
  messages = isFutureDate("expiry", messages, "This card is expired");

  if (messages.length > 0) {
    msg.style.color = "#C70039";
    msg.style.marginLeft = "55px";
    msg.style.marginTop = "10px";
    msg.innerHTML = "Issues found [" + messages.length + "]: " + messages.join("<br>");
  } else {
    msg.innerHTML = "";

    const formData = {
      title: document.getElementsByName("holderName")[0].value,
      fname: document.getElementsByName("cardNumber")[0].value,
      lname: document.getElementsByName("expiry")[0].value,
      dob: document.getElementsByName("cvc")[0].value,
      country: document.getElementsByName("expiry")[0].value,
    };
    bookingInfo.total = total;
    bookingInfo.tax = taxAmount;
    try {
      console.log("Sending data to server:", { hostInfo, bookingInfo, items });

      // Call the server-side API endpoint
      const response = await fetch("http://localhost:3000/insertUserEventProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostInfo, bookingInfo, items }),
      });

      const result = await response.json();


      if (result.success) {
        localStorage.setItem('eventId', result.eventId);
        window.location.href = '/HTML/Confirm.html';
      } else {
        msg.innerHTML = "Server error: " + result.message;
        btn.disabled = false; // Re-enable the button if the server returns an error
        btn.classList.remove("disabled"); // Remove the disabled class
        btn.classList.add("confirm-button");
        return;
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      msg.innerHTML = "Server error: Please try again later.";
      btn.disabled = false; // Re-enable the button if there is a network error
      btn.classList.remove("disabled"); // Remove the disabled class
      btn.classList.remove("confirm-button");
    }
  }
});

function isFilled(name, messages, msg) {
  const element = document.getElementsByName(name)[0].value.trim();
  if (element.length < 1) {
    messages.push(msg);
  }
  return messages;
}

function isCard(name, messages, msg) {
  const element = document.getElementsByName(name)[0].value.trim();
  if (!element.match("[0-9]{16}")) {
    messages.push(msg);
  }
  return messages;
}
function isCVC(name, messages, msg) {
  const element = document.getElementsByName(name)[0].value.trim();
  if (!element.match("[0-9]{3}")) {
    messages.push(msg);
  }
  return messages;
}
function isFutureDate(name, messages, errorMsg) {
  const element = document.getElementsByName(name)[0].value.trim();
  if (!element) {
    messages.push(errorMsg);
    return messages;
  }

  const selectedDate = new Date(element + "-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate <= today) {
    messages.push(errorMsg);
  }
  return messages;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. get the data from localstorage
  const hostData = JSON.parse(localStorage.getItem('hostFormData'));
  const bookingData = JSON.parse(localStorage.getItem('bookingData'));
  const items = JSON.parse(localStorage.getItem('items')) || []; // المنتجات إذا وجدت

  // 2. Store the data in an obj called confirmationData
  const confirmationData = {
    host: hostData,
    booking: bookingData,
    products: items
  };

  // 3.  save it at localStorage
  localStorage.setItem('confirmationData', JSON.stringify(confirmationData));


});