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
    
        window.location.href = '/HTML/pastBookings.html';
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
