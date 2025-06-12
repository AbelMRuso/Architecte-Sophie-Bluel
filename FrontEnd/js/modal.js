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
const inputTitle = document.getElementById("title");
//creamos variable para aplicar un mensaje de error en la validación del formulario
const messageError = document.querySelector(".error-message");

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
    resetForm();
});

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
    buttonModal.setAttribute("form", "formModal");
    buttonModal.innerText = "Valider";
    messageError.classList.add("hidden");
    messageError.innerText = "";

    currentView = "form";
}

// go back with back-button
backButton.addEventListener("click", () => {
    displayGalleryModal();
    resetForm();
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

//Función que conecta con la api

async function initModalForm(formOptionsModal) {
    const token = localStorage.getItem("token");

    formOptionsModal.headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch("http://localhost:5678/api/works", formOptionsModal);
    const data = await response.json();

    if (response.ok) {
        displayWorks();
        formModal.reset();
        resetForm();
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

    if (!file) return;

    iconImage.classList.add("hidden");
    addPhotoBtn.classList.add("hidden");
    textAddImg.classList.add("hidden");

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result; // Cargamos la imagen en el <img>
        preview.classList.remove("hidden"); // Mostramos el div
    };

    reader.readAsDataURL(file); // Leemos el archivo como URL de imagen
});

const formModal = document.getElementById("formModal");

//COMPORTAMIENTO DE LA PÁGINA AL HACER SUBMIT EN EL FORMULARIO
formModal.addEventListener("submit", (event) => {
    event.preventDefault();

    const formImg = document.getElementById("div-photo").files[0];
    const formTitleValue = document.getElementById("title").value;
    const categoryValue = document.getElementById("category").value;

    if (!formImg || formTitleValue.trim() === "" || !categoryValue) {
        messageError.classList.remove("hidden");
        messageError.innerText = "veuillez remplir tous les champs du formulaire";
        return;
    }

    messageError.classList.add("hidden");

    const formData = new FormData();

    formData.append("image", formImg);
    formData.append("title", formTitleValue);
    formData.append("category", categoryValue);

    const formOptionsModal = {
        method: "post",
        body: formData,
    };
    initModalForm(formOptionsModal);
});

//función para reiniciar el formulario

function resetForm() {
    preview.src = "";
    inputTitle.value = "";
    categoryFormModal.value = "";
    preview.classList.add("hidden");
    iconImage.classList.remove("hidden");
    addPhotoBtn.classList.remove("hidden");
    textAddImg.classList.remove("hidden");
    messageError.classList.add("hidden");
    messageError.innerText = "";
}

//PELEA MAXIMA PARA QUE EL BOTON DEL FORMULARIO PUEDA VALIDARLO Y CAMBIE DE COLOR
const formTitle = document.getElementById("title");

formTitle.addEventListener("input", checkForm);
categoryFormModal.addEventListener("change", checkForm);
inputFile.addEventListener("change", checkForm);

function checkForm() {
    if (inputFile.files.length > 0 && formTitle.value.trim() !== "" && categoryFormModal.value !== "") {
        buttonModal.classList.remove("valider");
        buttonModal.classList.add("valider-green");
        buttonModal.disabled = false;
    } else {
        buttonModal.classList.remove("valider-green");
        buttonModal.classList.add("valider");
        buttonModal.disabled = true;
    }
}
