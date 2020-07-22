'use strict';

// ======= Global Variables ======= //
Product.productArray = [];
var productHTMLList = document.getElementById('productUL');
var totalPageClicks = 0;
var productIndexsCurrentlyOnPage = [];

// ======= Constructor ======= //
function Product(productName, src) {
  this.numClicksOfProduct = 0;
  this.numTimesShown = 0;
  this.productName = productName;
  this.imgSource = src;

  Product.productArray.push(this);
}


// ======= Algorithm to randomly generate 3 unique images ======= //
  function generateDisplayProduct() {
  // Fisher Yates Shuffle algorithm, resource on README
  var i = Product.productArray.length;
  var j = 0;
  var swapIndexValue;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    swapIndexValue = Product.productArray[i];
    Product.productArray[i] = Product.productArray[j];
    Product.productArray[j] = swapIndexValue;
  }

  // evaluate if can use item
  var postToPageArray = [];

  for(var k = 0; k < Product.productArray.length; k++){
    if (Product.productArray[k] !== productIndexsCurrentlyOnPage[0] && 
      Product.productArray[k] !== productIndexsCurrentlyOnPage[1] && 
      Product.productArray[k] !== productIndexsCurrentlyOnPage[2]) {
        postToPageArray.push(Product.productArray[k]);
        if (postToPageArray.length === 3) {
          break;
        }
      }
  }
  console.log('postToPageArray: ', postToPageArray);
  // push  to current array to use as comparison for what's on the page
  productIndexsCurrentlyOnPage = [];
  productIndexsCurrentlyOnPage.push(postToPageArray[0]);
  productIndexsCurrentlyOnPage.push(postToPageArray[1]);
  productIndexsCurrentlyOnPage.push(postToPageArray[2]);
  
  console.log('productIndexsCurrentlyOnPage: ', productIndexsCurrentlyOnPage);

  productHTMLList.innerHTML = '';
  postToPageArray[0].renderProductAsHTML();
  postToPageArray[1].renderProductAsHTML();
  postToPageArray[2].renderProductAsHTML();
};


// ======= Display & Add Images to HTML productUL ======= // 
Product.prototype.renderProductAsHTML = function() {
  var productLI = document.createElement('li');

  var productImg = document.createElement('img');
  productImg.src = this.imgSource;
  productImg.alt = this.productName;
  productLI.appendChild(productImg);

  productHTMLList.appendChild(productLI);

  this.numTimesShown++;
};


// ======= Click Event Listener ======= //
productHTMLList.addEventListener('click', clickOnProductEvent);



// ======= Click Event Handler ======= //
function clickOnProductEvent(event) {
  console.log(event.target);
  if (event.target.tagName === 'IMG') {
    totalPageClicks++;

    for (var prodIndex = 0; prodIndex < Product.productArray.length; prodIndex++){
      if (Product.productArray[prodIndex].imgSource === event.target.getAttribute('src')) {
        Product.productArray[prodIndex].numClicksOfProduct++;
        console.log('numclicks: ', Product.productArray[prodIndex].numClicksOfProduct);
      }
    }
  };
  
  generateDisplayProduct();

  // let the user select something 25 times then stop
  if(totalPageClicks === 5){
    productHTMLList.removeEventListener('click', clickOnProductEvent);
    displayResultsToHTML();
    makeChart();
  }

  // convert data to string to local storage
  var stringyArr = JSON.stringify(Product.productArray);
  localStorage.setItem('products', stringyArr);
  
};


// ======= Display & Add Full Product.productArray to HTML resultsUL ====== //
function displayResultsToHTML () {
  var resultUL = document.getElementById('resultUL');

  // this is here so if you play the game again after a refresh the list doesn't duplicate
  resultUL.innerHTML = '';

  for (var i = 0; i < Product.productArray.length; i++) {
    var resultLI = document.createElement('li');
    resultLI.innerHTML = 
      Product.productArray[i].productName + ' had ' 
      + Product.productArray[i].numClicksOfProduct + ' vote(s) and was shown '
      +  Product.productArray[i].numTimesShown + ' times'
      resultUL.appendChild(resultLI);
  }
};


// =============== CHART JS Code ================= //

function makeChart() {

  // product Name label array
  var productLabelArray = [];
  for (var i = 0; i < Product.productArray.length; i++) {
    productLabelArray.push(Product.productArray[i].productName);
  }

  // data # of times product clicked data array
  var timesClickedDataArray = [];
  for (var i = 0; i < Product.productArray.length; i++) {
    timesClickedDataArray.push(Product.productArray[i].numClicksOfProduct);
  }
  
  var colors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'];
  var repeatColors = [];
  for (var i = 0; i < timesClickedDataArray.length; i++){
    repeatColors.push(colors[i % colors.length]);
  }

  var viewsDataArray = [];
  for (var i = 0; i < Product.productArray.length; i++) {
    viewsDataArray.push(Product.productArray[i].numTimesShown);
  }

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: productLabelArray,
        datasets: [{
            label: '# of Votes',
            // insert vote totals per item
            data: timesClickedDataArray,
            backgroundColor: repeatColors,
        },
        {
          label: '# of Views',
          data: viewsDataArray,

          type: 'line'
        }],
    },
    options: {
      title: {
        display: true,
        text: 'Product Clicks & Times Viewed'
      },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    precision: 0,
                }
            }]
        }
    }
  });
};


// convert back to object for use
var productsFromLocalStorage = localStorage.getItem('products');
var parsedProducts = JSON.parse(productsFromLocalStorage);

if(parsedProducts !== null){
  for(var i = 0; i < parsedProducts.length; i++){
    var reconstitutedProduct = new Product(parsedProducts[i].productName, parsedProducts[i].imgSource);
    reconstitutedProduct.numClicksOfProduct = parsedProducts[i].numClicksOfProduct;
    reconstitutedProduct.numTimesShown = parsedProducts[i].numTimesShown;
  }
  displayResultsToHTML();
  makeChart();
} else {
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
}

generateDisplayProduct();
