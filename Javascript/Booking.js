const form = document.querySelector("#form");
const msg = document.createElement("div");
msg.id = "msg";
form.append(msg);



form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let messages = [];

  messages = isFilled("event-title", messages, "Event Title is missing");
  messages = isEventTypeSelected("event-type", messages, "Please select an Event Type");
  messages = isFilled("event-description", messages, "Event Description is missing");
  
  if (messages.length > 0) {
    msg.style.color = "#C70039";
    msg.style.marginLeft = "55px";
    msg.style.marginTop = "10px";
    msg.innerHTML = "Issues found [" + messages.length + "]: " + messages.join("<br>");
  } else {
    msg.innerHTML = "";

    const formData = {
      eventTitle: document.getElementsByClassName("event-title")[0].value.trim(),
      eventType: document.getElementsByClassName("event-type")[0].value.trim(),
      eventDescription: document.getElementsByClassName("event-description")[0].value.trim(),
      noChildren: document.querySelectorAll(".toggle")[0]?.checked || false
    };

    console.log("Form Data:", formData);

    try {
      console.log("Saving form data to localStorage");
      localStorage.setItem('bookingData', JSON.stringify(formData)); 
      window.location.href = '/HTML/PaymentMethod.html';
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
      msg.innerHTML = "Error: Unable to save form data. Please try again.";
    }
  }
});


function isFilled(className, messages, errorMsg) {
  const element = document.getElementsByClassName(className)[0];
  if (!element || element.value.trim() === "") {
    messages.push(errorMsg);
  }
  return messages;
}

function isEventTypeSelected(className, messages, errorMsg) {
  const element = document.getElementsByClassName(className)[0];
  if (!element || element.value.trim() === "Event Type") {
    messages.push(errorMsg);
  }
  return messages;
}