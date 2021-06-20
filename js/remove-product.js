let orden = 3;
let carrito = [];
let database = firebase.database();

function ordenTres(productsList) {
  let mainContainer = document.getElementById("select-product");
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
  let removeBtn = document.createElement("button");
  let updateBtn = document.createElement("button");

  //add class and asignations
  card.classList.add("card", "product-card", "m-auto");
  cardImg.classList.add("card-img-top", "img-product");
  cardImg.src = img;
  cardBody.classList.add("card-body");
  cardLink.classList.add("btn-product-title");
  cardLink.href = `./detail-product.html?id=${id}`;

  removeBtn.setAttribute("data-id", id);
  removeBtn.classList.add("btn", "btn-outline-danger", "removeBtn");
  removeBtn.innerText = "Eliminar";

  updateBtn.setAttribute("data-id", id);
  updateBtn.setAttribute("data-bs-toggle", "modal");
  updateBtn.setAttribute("data-bs-target", "#updateModal");
  updateBtn.classList.add("btn", "btn-outline-success", "mx-2", "updateBtn");
  updateBtn.innerText = "Actualizar";

  cardTitle.classList.add("card-title");
  cardTitle.innerText = title;
  cardText.innerText = description;
  //appendChild
  cardLink.appendChild(cardTitle);
  cardBody.appendChild(cardLink);
  cardBody.appendChild(cardText);
  cardBody.appendChild(updateBtn);
  cardBody.appendChild(removeBtn);

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
      newProduct(product, id, r);
    } else {
      c = 1;
      r++;
      newProduct(product, id, r);
    }
  });
  //REMOVE
  let btnRemobe = document.getElementsByClassName("removeBtn");
  let rid = 1;
  for (let btn of btnRemobe) {
    let id = "botton" + rid;
    btn.setAttribute("id", id);
    listenRemove(id);
    rid++;
  }
  //UPDATE
  let btnUpdates = document.getElementsByClassName("updateBtn");
  let uid = 1;
  for (let btn of btnUpdates) {
    let id = "botton" + uid;
    btn.setAttribute("id", id);
    listenUpdate(id);
    uid++;
  }
}

showAllProducts();
//REMOVE
function listenRemove(id) {
  let btnId = document.getElementById(id);
  btnId.addEventListener("click", (e) => {
    let id = btnId.dataset.id;
    removeProduct(id);
  });
}
async function removeProduct(id) {
  await database
    .ref()
    .child("products")
    .child(id)
    .remove()
    .then(() => {
      window.location.reload();
    });
}

//UPDATE
function listenUpdate(id) {
  let btnId = document.getElementById(id);
  btnId.addEventListener("click", (e) => {
    let id = btnId.dataset.id;
    listenUpdateModal(id);
  });
}

function getProductData() {
  let valueTitle = document.getElementById("product-title-update").value;
  let vauleDescription = document.getElementById(
    "product-description-update"
  ).value;
  let valueImg = document.getElementById("product-img-update").value;
  let data = {};

  if (valueTitle != "") {
    Object.assign(data, { title: valueTitle });
  }
  if (vauleDescription != "") {
    Object.assign(data, { description: vauleDescription });
  }
  if (valueImg != "") {
    Object.assign(data, { img: valueImg });
  }

  return data;
}

function listenUpdateModal(id) {
  let btnUpdate = document.getElementById("modalUpdate");
  btnUpdate.addEventListener("click", () => {
    let data = getProductData();
    if (data != null) {
      updateProduct(id, data);
    } else {
      console.log("data null");
    }
  });
}

async function updateProduct(id, data) {
  await database
    .ref()
    .child("products")
    .child(id)
    .update(data)
    .then(() => {
      window.location.reload();
    });
}

// ADD PRODUCT
function addProduct({ title, description, img }) {
  database
    .ref()
    .child("products")
    .push({
      title: title,
      description: description,
      img: img,
    })
    .then((result) => {
      console.log(result.key);
      window.location.reload();
    });
}

function getAddProductData() {
  let title = document.getElementById("product-title-input").value;
  let description = document.getElementById(
    "product-description-texxtarea"
  ).value;
  let img = document.getElementById("product-img-input").value;
  return {
    title: title,
    description: description,
    img: img,
  };
}

let saveButton = document.getElementById("btn-save");
saveButton.addEventListener("click", () => {
  let data = getAddProductData();
  addProduct(data);
});

function cancelAddProduct() {
  document.getElementById("product-title-input").value = "";
  document.getElementById("product-description-texxtarea").value = "";
  document.getElementById("product-img-input").value = "";
}
let cancelButton = document.getElementById("btn-cancel");
cancelButton.addEventListener("click", () => {
  cancelAddProduct();
});
