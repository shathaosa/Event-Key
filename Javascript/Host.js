const form = document.querySelector("#form");
    const msg = document.createElement("div");
    msg.id = "msg";
    form.append(msg);

    const items = []; // Array to store data passed from checkoutbtn

    // Retrieve data from URL and store in items array
    window.onload = function () {
      const urlParams = new URLSearchParams(window.location.search);
      const selectedData = urlParams.get("selected");
      if (selectedData) {
        const decodedData = decodeURIComponent(selectedData);
        items.push(...JSON.parse(decodedData));
        console.log("Items:", items); // Log the items array
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let messages = [];
  
      messages = isTitleSelected("Title", messages, "Title is not selected");
      messages = isFilled("fname", messages, "First name is missing");
      messages = isFilled("lname", messages, "Last name is missing");
      messages = isFilled("DOB", messages, "Date of birth is missing");
      messages = isCountrySelected("country", messages, "Country is not selected");
      messages = isCountryCodeSelected("code", messages, "Country code is not selected");
      messages = isFilled("contact", messages, "Contact number is missing");
      messages = isMobile("contact", messages, "Contact number must be a 9-digit number");
      messages = isFilled("email", messages, "Email is missing");
      messages = isEmail("email", messages, "Email format is wrong");
      messages = isElegible("DOB", messages, "<br>Please note: Event planning is restricted to individuals 18 years or older");

      if (messages.length > 0) {
        msg.style.color = "#C70039";
        msg.style.marginLeft = "75px";
        msg.style.marginTop = "10px";
        msg.innerHTML = "Issues found [" + messages.length + "]: " + messages.join(", ") + ".";
      } else {
        msg.innerHTML = "";
        window.location.href = '/HTML/BookingInfo.html';

      }

    });
  
    function isFilled(name,messages,msg){
      const element = document.getElementsByName(name)[0].value.trim();
      if(element.length<1){
        messages.push(msg);
      }
      return messages;
    }
  
    function isEmail(name,messages,msg){
      const element = document.getElementsByName(name)[0].value.trim();
      if(!element.match("[a-z0-9]+@[a-z]+\.[a-z]{2,4}")){
        messages.push(msg);
      }
      return messages;
    }
    
    function isMobile(name,messages,msg){
      const element = document.getElementsByName(name)[0].value.trim();
      if(!element.match("[0-9]{9}")){
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


