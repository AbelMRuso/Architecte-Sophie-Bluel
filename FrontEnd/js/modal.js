//function to display images

async function modalWorks() {
    //array con todos los trabajos
    let allWorks = await getWorks();
    const modalContent = document.getElementById("modal-images");
    modalContent.innerHTML = "";

    for (let i = 0; i < allWorks.length; i++) {
        const imgModal = allWorks[i].imageUrl;
        const worksContent = document.createElement("figure");
        const imgContent = document.createElement("img");
        const deleteImg = document.createElement("button");
        deleteImg.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        imgContent.src = imgModal;
        worksContent.appendChild(imgContent);
        modalContent.appendChild(worksContent);
        worksContent.appendChild(deleteImg);
    }
}

//retrieving DOM elements to work on events
const modalDiv = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const backButton = document.getElementById("back-button");
const modalButtons = document.querySelector(".modal-buttons");
const buttonModal = document.getElementById("button-modal");
const titleModal = document.querySelector(".title-modal h2");
const formPhoto = document.getElementById("modal-form");
const modalImages = document.getElementById("modal-images");
const overlay = document.getElementById("overlay");

//modal is hidden by default
overlay.classList.add("hidden");

//show modal when click to modify
const modifyButton = document.getElementById("modify-button");
modifyButton.addEventListener("click", () => {
    displayGalleryModal();
});

//close modal when click to "x"
closeModal.addEventListener("click", () => {
    overlay.classList.add("hidden");
});

// VER CON GREGORY COMO HACER QUE SE CIERRE LA MODAL AL CLICAR FUERA DE ELLA ??????????????????????

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        overlay.classList.add("hidden");
    }
});

//Modal views
let currentView = "gallery";

//go to "ajout photo" inside modal by clicking the button "ajouter une photo"
buttonModal.addEventListener("click", () => {
    if (currentView === "gallery") {
        displayFormModal();
    } else {
        // AÑADIREMOS ESTA VALIDACIÓN MÁS ADELANTE
    }
});

//function that handles events when the gallery is displayed in the modal.
async function displayGalleryModal() {
    await modalWorks();
    overlay.classList.remove("hidden");
    modalButtons.classList.add("close-button");
    formPhoto.classList.add("hidden");
    modalImages.classList.remove("hidden");
    backButton.classList.add("hidden");
    titleModal.innerText = "Galerie photo";
    buttonModal.classList.remove("valider");
    buttonModal.classList.add("ajouter");
    buttonModal.setAttribute("type", "button");
    buttonModal.removeAttribute("form");
    buttonModal.innerText = "Ajouter une photo";

    currentView = "gallery";
}

//function that handles events when the form is displayed in the modal.
async function displayFormModal() {
    modalImages.classList.add("hidden");
    formPhoto.classList.remove("hidden");
    backButton.classList.remove("hidden");
    modalButtons.classList.remove("close-button");
    modalButtons.classList.add("separate-buttons");
    titleModal.innerText = "Ajout photo";
    buttonModal.classList.remove("ajouter");
    buttonModal.classList.add("valider");
    buttonModal.setAttribute("type", "submit");
    buttonModal.setAttribute("form", "modal-form");

    buttonModal.innerText = "Valider";

    currentView = "form";
}

// go back with back-button
backButton.addEventListener("click", () => {
    displayGalleryModal();
});

/* INTEGRACIÓN CATEGORIAS API EN FORMULARIO DE LA MODAL */

const modalForm = document.getElementById("modal-form");
const titleFormModal = document.getElementById("title");
const categoryFormModal = document.getElementById("category");
let categoriesLoaded = false;

categoryFormModal.addEventListener("click", () => {
    if (!categoriesLoaded) {
        categoriesList();
        categoriesLoaded = true;
    }
});

async function categoriesList() {
    const categoriesForm = await getCategories();
    for (let i = 0; i < categoriesForm.length; i++) {
        const categoriesOption = categoriesForm[i].name;
        const categoriesId = categoriesForm[i].id;

        const categoryContent = document.createElement("option");
        categoryContent.setAttribute("value", categoriesId);
        categoryContent.textContent = categoriesOption;

        categoryFormModal.appendChild(categoryContent);
    }
}

//creamos variable para aplicar un mensaje de error en la validación del formulario
const messageError = document.querySelector(".error-message");

//Función que conecta con la api
async function initModalForm() {
    const response = await fetch("http://localhost:5678/api/works", formOptionsModal);
    const data = await response.json();

    if (response.ok) {
        displayWorks();
        modalForm.reset();
        messageError.classList.remove("message-error");
        messageError.classList.add("confirmation-message");
        messageError.classList.remove("hidden");
        messageError.innerText = "Votre projet est enregistré correctement";
    }
}

//MOSTRAR LA IMAGEN SELECCIONADA EN EL INPUT
const inputFile = document.getElementById("div-photo");
const showImg = document.getElementById("select-file");
const preview = document.getElementById("preview");
const iconImage = document.getElementById("icon-image");
const addPhotoBtn = document.getElementById("add-photo-btn");
const textAddImg = document.getElementById("text-add-img");

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    iconImage.classList.add("hidden");
    addPhotoBtn.classList.add("hidden");
    textAddImg.classList.add("hidden");

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result; // Cargamos la imagen en el <img>
            preview.classList.remove("hidden"); // Mostramos el div
        };

        reader.readAsDataURL(file); // Leemos el archivo como URL de imagen
    }
});

//COMPORTAMIENTO DE LA PÁGINA AL HACER SUBMIT EN EL FORMULARIO
modalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formImg = document.getElementById("div-photo").files[0];
    const formTitle = document.getElementById("title").value;
    const categoryValue = categoryFormModal.value;

    const formData = new FormData();

    formData.append("image", formImg);
    formData.append("title", formTitle);
    formData.append("category", categoryValue);

    const formOptionsModal = {
        method: "post",
        body: formData,
    };

    if (!formImg || !formTitle.trim() === "" || !categoryValue) {
        messageError.classList.remove("hidden");
        messageError.innerText = "veuillez remplir tous les champs du formulaire";
    } else {
        messageError.classList.add("hidden");
        initModalForm();
    }
});
