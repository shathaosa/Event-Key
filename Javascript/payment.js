const form = document.querySelector("#form");
const btn = document.getElementById("smt");
const msg = document.createElement("div");
msg.id = "msg";
form.append(msg);
hostInfo = {};
bookingInfo = {};

// document.addEventListener('DOMContentLoaded', () => {
//   const storedData = localStorage.getItem('hostFormData'); // Retrieve hostFormData
//   if (storedData) {
//     const formData = JSON.parse(storedData);

//     // Store data in an array called hostInfo
//     for (const key in formData) {
//       if (formData.hasOwnProperty(key)) {
//         hostInfo.push({ key: key, value: formData[key] });
//       }
//     }
//     console.log("Host Info:", hostInfo); // Debugging output
//   }

//   const storedBookingData = localStorage.getItem('bookingData'); // Retrieve bookingData
//   if (storedBookingData) {
//     const bookingData = JSON.parse(storedBookingData);

//     // Store booking data in an array called bookingInfo
//     for (const key in bookingData) {
//       if (bookingData.hasOwnProperty(key)) {
//         bookingInfo.push({ key: key, value: bookingData[key] });
//       }
//     }
//     console.log("Booking Info:", bookingInfo); // Debugging output
//   }
// });


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
    msg.style.marginLeft = "75px";
    msg.style.marginTop = "10px";
    msg.innerHTML = "Issues found [" + messages.length + "]:<br>• " + messages.join("<br>• ");
  } else {
    msg.innerHTML = "";

    const formData = {
      title: document.getElementsByName("holderName")[0].value,
      fname: document.getElementsByName("cardNumber")[0].value,
      lname: document.getElementsByName("expiry")[0].value,
      dob: document.getElementsByName("cvc")[0].value,
      country: document.getElementsByName("expiry")[0].value,
    };
    bookingInfo.total= total;
    bookingInfo.tax= taxAmount;
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
      console.log("Result from server:", result);

      if (result.success) {
        console.log("Form Data:", items);
        window.location.href = '/HTML/BookingInfo.html';
      } else {
        msg.innerHTML = "Server error: " + result.message;
        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      msg.innerHTML = "Server error: Please try again later.";
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




