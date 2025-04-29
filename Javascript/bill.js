const items = []; 

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedData = urlParams.get("selected");
  if (selectedData) {
    const decodedData = decodeURIComponent(selectedData);
    items.push(...JSON.parse(decodedData));
    console.log("Items:", items);

    const venue = document.getElementById("venue-choice");
    venue.innerText = items[0].category;
    const venueprice = document.getElementById("venue-price");
    venueprice.innerText = items[0].price;

    const flowers = document.getElementById("flowers-choice");
    flowers.innerText = items[1].category;
    const flowersprice = document.getElementById("flowers-price");
    flowersprice.innerText = items[1].price;

    const photo = document.getElementById("photo-choice");
    photo.innerText = items[2].category;
    const photosprice = document.getElementById("photo-price");
    photosprice.innerText = items[2].price;

    const decor = document.getElementById("decor-choice");
    decor.innerText = items[3].category;
    const decorprice = document.getElementById("decor-price");
    decorprice.innerText = items[3].price;

    const music = document.getElementById("music-choice");
    music.innerText = items[4].category;
    const musicprice = document.getElementById("music-price");
    musicprice.innerText = items[4].price;

    const catering = document.getElementById("catering-choice");
    catering.innerText = items[5].category;
    const cateringprice = document.getElementById("catering-price");
    cateringprice.innerText = items[5].price;

    const totalWithoutTax = calcTotal();
    const taxAmount = calcTax(totalWithoutTax);

    const tax = document.getElementById("tax");
    tax.innerText = taxAmount;

    const total = document.getElementById("total");
    total.innerText = calcFinalTotal();

    const totalPayment = document.getElementById("total-payment");
    totalPayment.innerText = calcFinalTotal();
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
  
  
