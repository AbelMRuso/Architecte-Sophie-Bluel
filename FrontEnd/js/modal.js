//DOM elements
const modalDiv = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const backButton = document.getElementById("back-button");
const modalButtons = document.querySelector(".modal-buttons");
const buttonModal = document.getElementById("button-modal");
const titleModal = document.querySelector(".title-modal h2");
const modalForm = document.getElementById("modal-form");
const modalImages = document.getElementById("modal-images");
const overlay = document.getElementById("overlay");
const inputTitle = document.getElementById("title");
const messageError = document.querySelector(".error-message");
const categoryFormModal = document.getElementById("category");
const inputFile = document.getElementById("div-photo");
const preview = document.getElementById("preview");
const iconImage = document.getElementById("icon-image");
const addPhotoBtn = document.getElementById("add-photo-btn");
const textAddImg = document.getElementById("text-add-img");
const formModal = document.getElementById("formModal");
const formTitle = document.getElementById("title");
const buttonSubmit = document.getElementById("button-valider");

//Modal views
let currentView = "gallery";

//variable para evitar que las categorias se recargen en la modal si el usuario clica varias veces sobre la flecha
let categoriesLoaded = false;

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

//close modal when click outside
overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        overlay.classList.add("hidden");
    }
});

//go to "ajout photo" inside modal by clicking the button "ajouter une photo"
buttonModal.addEventListener("click", () => {
    if (currentView === "gallery") {
        displayFormModal();
    } else {
        // ¿NO DEBERÍAMOS AÑADIR AQUÍ LA VALIDACIÓN DEL FORMULARIO?
    }
});

// go back with back-button
backButton.addEventListener("click", () => {
    displayGalleryModal();
    resetForm();
});

/* INTEGRACIÓN CATEGORIAS API EN FORMULARIO DE LA MODAL */
categoryFormModal.addEventListener("click", () => {
    if (!categoriesLoaded) {
        categoriesList();
        categoriesLoaded = true;
    }
});

//Función que conecta con la api
async function initModalForm(formOptionsModal) {
    const token = localStorage.getItem("token");

    formOptionsModal.headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch("http://localhost:5678/api/works", formOptionsModal);
    const data = await response.json();

    if (response.ok) {
        displayWorks(data);
        formModal.reset();
        resetForm();
    }
}

//MOSTRAR LA IMAGEN SELECCIONADA EN EL INPUT

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

//COMPORTAMIENTO DE LA PÁGINA AL HACER SUBMIT EN EL FORMULARIO
formModal.addEventListener("submit", (event) => {
    event.preventDefault();

    const formImg = document.getElementById("div-photo").files[0];
    const formTitleValue = document.getElementById("title").value;
    const categoryValue = document.getElementById("category").value;

    if (!formImg || formTitleValue.trim() === "" || !categoryValue) {
        messageError.classList.remove("hidden");
        messageError.innerText = "Veuillez remplir tous les champs du formulaire";
        return;
    }

    const formData = new FormData();

    formData.append("image", formImg);
    formData.append("title", formTitleValue);
    formData.append("category", categoryValue);

    //Objeto de configuración
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
    messageError.classList.add("hidden");
    preview.classList.add("hidden");
    iconImage.classList.remove("hidden");
    addPhotoBtn.classList.remove("hidden");
    textAddImg.classList.remove("hidden");
    buttonSubmit.classList.remove("valider-green");
    buttonSubmit.classList.add("valider");
}

//hacer que el boton del formulario haga submit y cambie de color cuando los 3 campos se han completado
formTitle.addEventListener("input", checkForm);
categoryFormModal.addEventListener("change", checkForm);
inputFile.addEventListener("change", checkForm);

function checkForm() {
    if (inputFile.files.length > 0 && formTitle.value.trim() !== "" && categoryFormModal.value !== "") {
        buttonSubmit.classList.remove("valider");
        buttonSubmit.classList.add("valider-green");
        messageError.classList.add("hidden");
    } else {
        buttonSubmit.classList.add("valider");
        buttonSubmit.classList.remove("valider-green");
    }
}
//********** FUNCTIONS ********/

//Función que recoge los datos de Works de la API, recorre su array y crea un elemento para cada uno de los objetos
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

//function that handles events when the gallery is displayed in the modal.
async function displayGalleryModal() {
    await modalWorks();
    overlay.classList.remove("hidden");
    modalButtons.classList.add("close-button");
    modalForm.classList.add("hidden");
    modalImages.classList.remove("hidden");
    backButton.classList.add("hidden");
    titleModal.innerText = "Galerie photo";
    buttonModal.classList.remove("hidden");
    buttonModal.classList.add("valider-green");
    buttonSubmit.classList.add("hidden");

    currentView = "gallery";
}

//function that handles events when the form is displayed in the modal.
async function displayFormModal() {
    modalImages.classList.add("hidden");
    modalForm.classList.remove("hidden");
    backButton.classList.remove("hidden");
    modalButtons.classList.remove("close-button");
    modalButtons.classList.add("separate-buttons");
    titleModal.innerText = "Ajout photo";
    buttonModal.classList.add("hidden");
    buttonSubmit.classList.remove("hidden");
    buttonSubmit.classList.add("valider");

    currentView = "form";
}

//Función que recoge las categorías de la API, y las inserta en el section de la modal en forma de option
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
