const form = document.querySelector("#form");
    const msg = document.createElement("div");
    msg.id = "msg";
    form.append(msg);
    
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let messages = [];
    
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
    
        try {
          const response = await fetch('/submit-host', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
    
          const result = await response.json();
    
          if (result.success) {
            window.location.href = '/HTML/Confirm.html'; 
          } else {
            msg.innerHTML = "Server error: " + result.message;
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          msg.innerHTML = "Server error: Please try again later.";
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
  
    function isCard(name,messages,msg){
        const element = document.getElementsByName(name)[0].value.trim();
        if(!element.match("[0-9]{16}")){
          messages.push(msg);
        }
        return messages;
      }
      function isCVC(name,messages,msg){
        const element = document.getElementsByName(name)[0].value.trim();
        if(!element.match("[0-9]{3}")){
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
    
    


