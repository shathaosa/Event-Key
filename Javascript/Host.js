document.addEventListener("DOMContentLoaded", () => {
  const formId = "form"; 
  const form = document.querySelector(`#${formId}`);

  if (!form) {
    console.error(`Form with id="${formId}" not found.`);
    return;
  }

  const msg = document.createElement("div");
  msg.id = "msg";
  form.append(msg);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let messages = [];

    messages = isTitleSelected("Title", messages, "Title is not selected");
    messages = isFilled("fname", messages, "First name is missing");
    messages = isFilled("lname", messages, "Last name is missing");
    messages = isFilled("DOB", messages, "Date of birth is missing");
    messages = isCountryCodeSelected("code", messages, "Country code is not selected");
    messages = isFilled("contact", messages, "Contact number is missing");
    messages = isMobile("contact", messages, "Contact number must be a 9-digit number");
    messages = isFilled("email", messages, "Email is missing");
    messages = isEmail("email", messages, "Email format is wrong");
    messages = isElegible("DOB", messages, "Please note: Event planning is restricted to individuals 18 years or older");

    if (messages.length > 0) {
      msg.style.color = "#C70039";
      msg.style.marginLeft = "55px";
      msg.style.marginTop = "10px";
      msg.innerHTML = "Issues found [" + messages.length + "]: " + messages.join("<br>");
    } else {
      msg.innerHTML = "";

      const formData = {
        title: document.getElementsByName("Title")[0].value,
        fname: document.getElementsByName("fname")[0].value,
        lname: document.getElementsByName("lname")[0].value,
        dob: document.getElementsByName("DOB")[0].value,
        code: document.getElementsByName("code")[0].value,
        contact: document.getElementsByName("contact")[0].value,
        email: document.getElementsByName("email")[0].value,
      };

      try {
        console.log("✅ Saving host data to localStorage...");
        localStorage.setItem('hostFormData', JSON.stringify(formData));
        window.location.href = '/HTML/BookingInfo.html'; 
      } catch (error) {
        console.error("❌ Error saving form data to localStorage:", error);
        msg.innerHTML = "Error: Unable to save form data. Please try again.";
      }
    }
  });

  function isFilled(name, messages, msg) {
    const element = document.getElementsByName(name)[0]?.value.trim();
    if (!element) {
      messages.push(msg);
    }
    return messages;
  }

  function isEmail(name, messages, msg) {
    const element = document.getElementsByName(name)[0]?.value.trim();
    if (!element.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      messages.push(msg);
    }
    return messages;
  }

  function isMobile(name, messages, msg) {
    const element = document.getElementsByName(name)[0]?.value.trim();
    if (!element.match(/^[0-9]{9}$/)) {
      messages.push(msg);
    }
    return messages;
  }

  function isCountryCodeSelected(name, messages, msg) {
    const value = document.getElementsByName(name)[0]?.value.trim();
    if (value === "Country Code" || !value) {
      messages.push(msg);
    }
    return messages;
  }

  function isTitleSelected(name, messages, msg) {
    const value = document.getElementsByName(name)[0]?.value.trim();
    if (value === "Title" || !value) {
      messages.push(msg);
    }
    return messages;
  }

  function isElegible(name, messages, msg) {
    const value = document.getElementsByName(name)[0]?.value.trim();
    const birthDay = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDay.getFullYear();
    const monthDiff = today.getMonth() - birthDay.getMonth();
    const dayDiff = today.getDate() - birthDay.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      messages.push(msg);
    }

    return messages;
  }
});
