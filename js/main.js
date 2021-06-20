let carrito = [];
let orden = 3;
let database = firebase.database();

function ordenTres(productsList) {
  let mainContainer = document.getElementById("main-container");
  let numberRow = productsList.length / orden;
  for (let i = 0; i < numberRow; i++) {
    let row = document.createElement("div");
    row.classList.add("row", "trios", "my-5");
    mainContainer.appendChild(row);
  }
}

function newProduct({ title, description, img }, id, r) {
  //Get and Create Elements
  let row = document.getElementsByClassName("trios");
  let card = document.createElement("div");
  let cardImg = document.createElement("img");
  let cardBody = document.createElement("div");
  let cardLink = document.createElement("a");
  let cardTitle = document.createElement("h4");
  let cardText = document.createElement("p");
  let addButton = document.createElement("button");

  //add class and asignations
  card.classList.add("card", "product-card", "m-auto");
  cardImg.classList.add("card-img-top", "img-product");
  cardImg.src = img;
  cardBody.classList.add("card-body");
  cardLink.classList.add("btn-product-title");
  cardLink.href = `./detail-product.html?id=${id}`;

  addButton.setAttribute("data-id", id);
  addButton.classList.add("btn", "btn-outline-primary", "addButton");

  addButton.innerText = "Agregar al Carrito";
  cardTitle.classList.add("card-title");
  cardTitle.innerText = title;
  cardText.innerText = description;
  //appendChild
  cardLink.appendChild(cardTitle);
  cardBody.appendChild(cardLink);
  cardBody.appendChild(cardText);
  cardBody.appendChild(addButton);
  card.appendChild(cardImg);
  card.appendChild(cardBody);
  row[r].appendChild(card);
}

async function retrieveAllProducts() {
  let products = {};
  await database
    .ref()
    .child("products")
    .get()
    .then((result) => {
      if (result.exists()) {
        products = result.val();
      } else {
        console.log("item not found");
      }
    });
  return products;
}

async function showAllProducts() {
  let allProducts = await retrieveAllProducts();
  let listOfIds = Object.keys(allProducts);
  ordenTres(listOfIds);

  let c = 0;
  let r = 0;
  listOfIds.forEach((id) => {
    let product = allProducts[id];

    if (c < orden) {
      c++;
      // console.log(c, r);
      newProduct(product, id, r);
    } else {
      c = 1;
      r++;
      // console.log(c, r);
      newProduct(product, id, r);
    }
  });
  let buttons = document.getElementsByClassName("addButton");
  let cid = 1;
  for (let btn of buttons) {
    let id = "botton" + cid;
    btn.setAttribute("id", id);
    addToCarrito(id);
    cid++;
  }
}

function addToCarrito(id) {
  let btnId = document.getElementById(id); // del elemento
  btnId.addEventListener("click", (e) => {
    let id = btnId.dataset.id; //id del producto
    carrito.push(id);
    // console.log(carrito);
  });
}

showAllProducts();

let itemC = document.getElementById("carrito");
itemC.addEventListener("click", () => {
  let modal = document.getElementById("modal-body");

  if (carrito.length == 0) {
    let mensaje = document.createElement("p");
    mensaje.innerHTML = "No Hay Productos Seleccionados";
    modal.appendChild(mensaje);
  } else {
    modal.innerHTML = "";
    carrito.forEach((id) => {
      getProductById(id);
    });
  }
});

async function getProductById(id) {
  await database
    .ref()
    .child("products")
    .child(id)
    .get()
    .then((result) => {
      if (result.exists()) {
        products = result.val();
        console.log(products);
        printModal(products);
      } else {
        console.log("item not found");
      }
    });
}

function printModal({ title, description, img }) {
  let modal = document.getElementById("modal-body");
  let card = document.createElement("div");
  let cardImg = document.createElement("img");
  let cardBody = document.createElement("div");
  let cardTitle = document.createElement("h2");
  let cardText = document.createElement("p");

  card.classList.add("col-8", "card", "modal-product", "m-auto", "p-4");
  cardImg.classList.add("card-img-top", "img-modal");
  cardImg.src = img;
  cardBody.classList.add("card-body");
  cardTitle.classList.add("card-title");
  cardTitle.innerText = title;
  cardText.innerText = description;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  card.appendChild(cardImg);
  card.appendChild(cardBody);
  modal.appendChild(card);
}
