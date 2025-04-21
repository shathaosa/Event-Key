document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#form");
    const msg = document.createElement("div");
    msg.id = "msg";
    form.append(msg);
  
    form.addEventListener("submit", (e) => {
      let messages = [];
  
      messages = isTitleSelected("Title", messages, "Title is not selected");
      messages = isFilled("fname", messages, "First name is missing");
      messages = isFilled("lname", messages, "Last name is missing");
      messages = isFilled("DOB", messages, "Date of birth is missing");
      messages = isCountrySelected("country", messages, "Country is not selected");
      messages = isCountryCodeSelected("code", messages, "Country code is not selected");
      messages = isFilled("contact", messages, "Contact number is missing");
      messages = isMobile("contact", messages, "Contact must be a 9-digit number");
      messages = isFilled("email", messages, "Email is missing");
      messages = isEmail("email", messages, "Email format is wrong");
  
      if (messages.length > 0) {
        e.preventDefault();
        msg.style.color = "#C70039";
        msg.style.marginLeft = "70px";
        msg.style.marginTop = "10px";
        msg.innerHTML = "Issues found [" + messages.length + "]: " + messages.join(", ") + ".";
      } else {
        msg.innerHTML = "";
      }
    });
  
    function isFilled(name, messages, msg) {
      const value = document.getElementsByName(name)[0]?.value.trim();
      console.log(`[isFilled] ${name} = "${value}"`);
      if (!value) {
        messages.push(msg);
      }
      return messages;
    }
  
    function isEmail(name, messages, msg) {
      const value = document.getElementsByName(name)[0]?.value.trim();
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!pattern.test(value)) {
        messages.push(msg);
      }
      return messages;
    }
  
    function isMobile(name, messages, msg) {
      const value = document.getElementsByName(name)[0]?.value.trim();
      const pattern = /^[0-9]{9}$/;
      if (!pattern.test(value)) {
        messages.push(msg);
      }
      return messages;
    }
  
    function isCountrySelected(name, messages, msg) {
      const value = document.getElementsByName(name)[0]?.value.trim();
      console.log(`[isCountrySelected] ${name} = "${value}"`);
      if (value === "Select Country") {
        messages.push(msg);
      }
      return messages;
    }
  
    function isCountryCodeSelected(name, messages, msg) {
      const value = document.getElementsByName(name)[0]?.value.trim();
      console.log(`[isCountryCodeSelected] ${name} = "${value}"`);
      if (value === "Country Code") {
        messages.push(msg);
      }
      return messages;
    }
  
    function isTitleSelected(name, messages, msg) {
      const value = document.getElementsByName(name)[0]?.value.trim();
      console.log(`[isTitleSelected] ${name} = "${value}"`);
      if (value === "Title") {
        messages.push(msg);
      }
      return messages;
    }
  });
  