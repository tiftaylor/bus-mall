'use strict';

// ======= Global Variables ======= //
var productArray = [];
var productHTMLList = document.getElementById('productUL');
var totalPageClicks = 0;


// ======= Constructor ======= //
function Product(productName, src) {
  this.numClicksOfProduct = 0;
  this.numTimesShown = 0;
  this.productName = productName;
  this.imgSource = src;

  productArray.push(this);
};


// ======= Algorithm to randomly generate 3 unique images ======= //
function generateDisplayProduct() {
  // Fisher Yates Shuffle algorithm, resource on README
  var i = productArray.length;
  var j = 0;
  var swapIndexValue;
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    swapIndexValue = productArray[i];
    productArray[i] = productArray[j];
    productArray[j] = swapIndexValue;
  }

  var newProduct1 = productArray[0];
  var newProduct2 = productArray[1];
  var newProduct3 = productArray[2];

  productHTMLList.innerHTML = '';
  newProduct1.renderProductAsHTML();
  newProduct2.renderProductAsHTML();
  newProduct3.renderProductAsHTML();
}


// ======= Display & Add Images to HTML productUL ======= // 
Product.prototype.renderProductAsHTML = function() {
  var productLI = document.createElement('li');

  var productImg = document.createElement('img');
  productImg.src = this.imgSource;
  productImg.alt = this.productName;
  productLI.appendChild(productImg);

  productHTMLList.appendChild(productLI);

  this.numTimesShown++;
}


// ======= Click Event Listener ======= //
productHTMLList.addEventListener('click', clickOnProductEvent);


// ======= Click Event Handler ======= //
function clickOnProductEvent(event) {
  console.log(event.target);
  if (event.target.tagName === 'IMG') {
    totalPageClicks++;

    for (var prodIndex = 0; prodIndex < productArray.length; prodIndex++){
      if (productArray[prodIndex].imgSource === event.target.getAttribute('src')) {
        productArray[prodIndex].numClicksOfProduct++;
      }
    }
  }

  generateDisplayProduct();

  if(totalPageClicks === 25){
    productHTMLList.removeEventListener('click', clickOnProductEvent);
    displayResultsToHTML();
  }
}


// ======= Display & Add Full productArray to HTML resultsUL ====== //
function displayResultsToHTML () {
  var resultUL = document.getElementById('resultUL');

  for (var i = 0; i < productArray.length; i++) {
    var resultLI = document.createElement('li');
    resultLI.innerHTML = 
      productArray[i].productName + ' had ' 
      + productArray[i].numClicksOfProduct + ' vote(s) and was shown '
      +  productArray[i].numTimesShown + ' times'
      resultUL.appendChild(resultLI);
  }
}
 

// ======== TEST DATA ===== //
new Product('Star Wars Luggage', 'img/bag.jpg');
new Product('Banana Slicer', 'img/banana.jpg');
new Product('Toiletainment', 'img/bathroom.jpg');
new Product('Pointless Boots', 'img/boots.jpg');
new Product('Breakfast All-in-One', 'img/breakfast.jpg');
new Product('Meatball Bubble Gum', 'img/bubblegum.jpg');
new Product('Dumb Chair', 'img/chair.jpg');
new Product('Green Monster', 'img/cthulhu.jpg');
new Product('Abused Dog', 'img/dog-duck.jpg');
new Product('Dragon Meat', 'img/dragon.jpg');
new Product('Pen', 'img/pen.jpg');
new Product('Pet Sweeper Slippers', 'img/pet-sweep.jpg');
new Product('Pizza Scissors', 'img/scissors.jpg');
new Product('Sleeping Bag #1', 'img/shark.jpg');
new Product('Baby Sweeper', 'img/sweep.png');
new Product('Sleeping Bag #2', 'img/tauntaun.jpg');
new Product('Unicorn Meat', 'img/unicorn.jpg');
new Product('Weird USB', 'img/usb.gif');
new Product('Bad Watering Can', 'img/water-can.jpg');
new Product('Sad Wine Glass', 'img/wine-glass.jpg');

generateDisplayProduct();