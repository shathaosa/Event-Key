const form = document.querySelector("#form");
    const msg = document.createElement("div");
    msg.id = "msg";
    form.append(msg);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let messages = [];
    
      messages = isFilled("email", messages, "Email is required");
      messages = isFilled("contact", messages, "Phone Number is required");
      messages = isMobile("contact", messages, "Contact number must be a 9-digit number");
      messages = isEmail("email", messages, "Email format is wrong");
    
      if (messages.length > 0) {
        msg.style.color = "#C70039";
        msg.style.marginLeft = "75px";
        msg.style.marginTop = "10px";
        msg.innerHTML = "Issues found [" + messages.length + "]:<br>• " + messages.join("<br>• ");
      } else {
        msg.innerHTML = "";
    
        const formData = {
          contact: document.getElementsByName("contact")[0].value,
          email: document.getElementsByName("email")[0].value,
        };
    
        try {
          console.log("Saving form data to localStorage");
          localStorage.setItem('hostFormData', JSON.stringify(formData));
          window.location.href = '/HTML/pastBooking.html';
        } catch (error) {
          console.error("Error saving form data to localStorage:", error);
          msg.innerHTML = "Error: Unable to save form data. Please try again.";
        }
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
      if (!element.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
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
    