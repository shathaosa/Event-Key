const form = document.querySelector("#form");
const msg = document.createElement("div");
msg.id = "msg";
form.append(msg);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let messages = [];

  resetValidation();

  const startValue = document.querySelector(".start-time").value.trim();
  const endValue = document.querySelector(".end-time").value.trim();

  if (!isFilled(".event-title")) {
    messages.push("Event Title is missing");
  }

  if (!isEventTypeSelected(".event-type")) {
    messages.push("Please select an Event Type");
  }

  if (!isFilled(".event-description")) {
    messages.push("Event Description is missing");
  }

  if (!isDateValid(".event-date")) {
    messages.push("Please select a future Event Date");
  }

  if (!isValidTimeFormat(startValue)) {
    messages.push("Start Time format is wrong. Example: 08:00 AM");
  }

  if (!isValidTimeFormat(endValue)) {
    messages.push("End Time format is wrong. Example: 10:00 AM");
  }

  if (!isFilled(".event-location")) {
    messages.push("Event Location is missing");
  }

  if (messages.length > 0) {
    showMessages(messages);
  } else {
    msg.innerHTML = "";
    window.location.href = '/HTML/Payment.html';
  }
});


function resetValidation() {
  const elements = document.querySelectorAll(".event-title, .event-type, .event-description, .event-date, .start-time, .end-time, .event-location");
  elements.forEach(el => el.setCustomValidity(""));
}

function isFilled(className) {
  const element = document.querySelector(className);
  return element && element.value.trim() !== "";
}

function isEventTypeSelected(className) {
  const element = document.querySelector(className);
  return element && element.value !== "Event Type";
}

function isDateValid(className) {
  const element = document.querySelector(className);
  if (!element || element.value.trim() === "") return false;

  const selectedDate = new Date(element.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate > today;
}

function isValidTimeFormat(timeStr) {
  const regex = /^([0][1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  return regex.test(timeStr);
}

function isStartBeforeEnd(startTime, endTime) {
  const startMinutes = convertToMinutes(startTime);
  const endMinutes = convertToMinutes(endTime);

  return startMinutes < endMinutes;
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

function showMessages(messages) {
  msg.style.color = "#C70039";
  msg.style.marginLeft = "75px";
  msg.style.marginTop = "10px";
  msg.innerHTML = "Issues found [" + messages.length + "]:<br>• " + messages.join("<br>• ");
}
