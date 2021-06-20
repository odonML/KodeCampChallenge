const database = firebase.database();
let valores = window.location.search;
let urlParams = new URLSearchParams(valores);
let id = urlParams.get("id");

function printDetails({ title, description, img }) {
  // let zise_img = "1320x450";
  let detailProduct = document.getElementById("detail-product");
  let card = document.createElement("div");
  let cardImg = document.createElement("img");
  let cardBody = document.createElement("div");
  let cardTitle = document.createElement("h2");
  let cardText = document.createElement("p");

  card.classList.add("col-5","card", "detail-product", "m-auto", "p-4");
  cardImg.classList.add("card-img-top", "img-product-detail");
  cardImg.src = img ;
  cardBody.classList.add("card-body");
  cardTitle.classList.add("card-title");
  cardTitle.innerText = title;
  cardText.innerText = description;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  card.appendChild(cardImg);
  card.appendChild(cardBody);
  detailProduct.appendChild(card);

  // console.log(title);
}

async function getProductById(id) {
  await database
    .ref()
    .child("products")
    .child(id)
    .get()
    .then((result) => {
      if (result.exists()) {
        products = result.val();
        printDetails(products);
      } else {
        console.log("item not found");
      }
    });
}

getProductById(id);
