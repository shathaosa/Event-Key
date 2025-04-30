const form = document.querySelector("#form");
    const msg = document.createElement("div");
    msg.id = "msg";
    form.append(msg);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let messages = [];
    
      messages = isFilled("email", messages, "Email is required");
      messages = isEmail("email", messages, "Email format is wrong");
    
      if (messages.length > 0) {
        msg.style.color = "#C70039";
        msg.style.marginLeft = "75px";
        msg.style.marginTop = "10px";
        msg.innerHTML = "Issues found [" + messages.length + "]:<br>• " + messages.join("<br>• ");
      } else {
        msg.innerHTML = "";
    
        const formData = {
          email: document.getElementsByName("email")[0].value
        };
    
        try {
            const response = await fetch("http://localhost:3000/getUserBookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }

            const result = await response.json();
            if (result.success) {
                const bookings = result.bookings;
                console.log("Bookings retrieved:", bookings);
                // Store bookings in localStorage or handle as needed
                localStorage.setItem("bookings", JSON.stringify(bookings));
                console.log("Bookings stored in localStorage:", bookings);
                window.location.href = '/HTML/pastBookings.html';
            } else {
                msg.style.color = "#C70039";
                msg.innerHTML = result.message;
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
            msg.style.color = "#C70039";
            msg.innerHTML = "An error occurred while fetching bookings.";
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
    
    // function isMobile(name,messages,msg){
    //   const element = document.getElementsByName(name)[0].value.trim();
    //   if(!element.match("[0-9]{9}")){
    //     messages.push(msg);
    //   }
    //   return messages;
    // }
