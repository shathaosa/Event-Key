window.items = []; 
window.total=0;
window.taxAmount=0;

window.onload = function () {
  const storedSelectedData = localStorage.getItem('products'); // Retrieve bookingData
  if (storedSelectedData) {
    const selectedData = JSON.parse(storedSelectedData);
    
    // Store booking data in an array called bookingInfo
    
    for (const key in selectedData) {
      if (selectedData.hasOwnProperty(key)) {
        items.push( selectedData[key]);
      }
    }
    console.log("Items", items); // Debugging output

    const detailsContainer = document.querySelector(".details");
    const sp = document.getElementById("separator");
    // detailsContainer.innerHTML = ""; // Clear existing content

    items.forEach((item) => {
      const categoryElement = document.createElement("p");
      categoryElement.className = "catagory";
      categoryElement.innerHTML = `${item.category}<span class="price"><span>${item.price}</span><img class="riyal" src="/Media/Riyal.png" alt="Riyal"></span>`;
      detailsContainer.insertBefore(categoryElement,sp);

      const choiceElement = document.createElement("p");
      choiceElement.className = "choice";
      choiceElement.innerText = item.vendor || "----";
      detailsContainer.insertBefore(choiceElement,sp);
    });

  const totalWithoutTax = calcTotal();
  taxAmount = calcTax(totalWithoutTax);
  total =calcFinalTotal();
  const t1 = document.getElementById("total-payment");
  t1.innerText=total;
  const t2 = document.getElementById("total");
  t2.innerText=total;
  const tax = document.getElementById("Tax");
  tax.innerText=taxAmount;
   
  }
};

function calcTotal() {
    let total = 0;
  
    for (let i = 0; i < items.length; i++) {
      let price = items[i].price;
  
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
      } else {
        price = parseFloat(price);
      }
  
      total += price;
    }
  
    return total.toFixed(2);
  }
  
  function calcTax(totalWithoutTax) {
    const totalWithoutTaxNum = parseFloat(totalWithoutTax);
    const taxAmount = totalWithoutTaxNum * 0.15;
    return taxAmount.toFixed(2);
  }
  
  function calcFinalTotal() {
    const totalWithoutTax = calcTotal();
    const taxAmount = calcTax(totalWithoutTax);
    const finalTotal = parseFloat(totalWithoutTax) + parseFloat(taxAmount); 
    return finalTotal.toFixed(2); 
  }


