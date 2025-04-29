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
  messages = isFutureDate("event-date", messages, "Please select a future Event Date");
  messages = isValidTime("start-time", messages, "Start Time format is wrong. Example: 08:00 AM");
  messages = isValidTime("end-time", messages, "End Time format is wrong. Example: 10:00 AM");

  if (messages.length > 0) {
    msg.style.color = "#C70039";
    msg.style.marginLeft = "75px";
    msg.style.marginTop = "10px";
    msg.innerHTML = "Issues found [" + messages.length + "]:<br>• " + messages.join("<br>• ");
  } else {
    msg.innerHTML = "";

    const formData = {
      eventTitle: document.getElementsByClassName("event-title")[0].value.trim(),
      eventType: document.getElementsByClassName("event-type")[0].value.trim(),
      eventDescription: document.getElementsByClassName("event-description")[0].value.trim(),
      eventDate: document.getElementsByClassName("event-date")[0].value.trim(),
      startTime: document.getElementsByClassName("start-time")[0].value.trim(),
      endTime: document.getElementsByClassName("end-time")[0].value.trim(),
      hideGuestList: document.querySelectorAll(".toggle")[0]?.checked || false,
      noChildren: document.querySelectorAll(".toggle")[1]?.checked || false
    };

    console.log("Form Data:", formData);

    try {
      const response = await fetch('/submit-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = '/HTML/PaymentMethod.html';
      } else {
        msg.innerHTML = "Server error: " + result.message;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      msg.innerHTML = "Server error: Please try again later.";
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

function isFutureDate(className, messages, errorMsg) {
  const element = document.getElementsByClassName(className)[0];
  if (!element) {
    messages.push(errorMsg);
    return messages;
  }
  const selectedDate = new Date(element.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate <= today) {
    messages.push(errorMsg);
  }
  return messages;
}

function isValidTime(className, messages, errorMsg) {
  const element = document.getElementsByClassName(className)[0];
  const timeStr = element?.value.trim() || "";
  const regex = /^([0][1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  if (!regex.test(timeStr)) {
    messages.push(errorMsg);
  }
  return messages;
}


function convertToMinutes(timeStr) {
  if (!timeStr.includes(' ')) return 0;

  const [time, modifier] = timeStr.split(' ');
  let [hour, minute] = time.split(':').map(Number);

  if (modifier.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  return (hour * 60) + minute;
}
