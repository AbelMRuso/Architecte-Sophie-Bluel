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

// Prevents categories form reloading in the modal if the user clicks the arrow multiple times
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
    }
});

// go back with back-button
backButton.addEventListener("click", () => {
    displayGalleryModal();
    resetForm();
});

/* // Category API integration in the modal form */
categoryFormModal.addEventListener("click", () => {
    if (!categoriesLoaded) {
        categoriesList();
        categoriesLoaded = true;
    }
});

//Show image at form when is selected and loaded

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];

    if (!file) return;

    iconImage.classList.add("hidden");
    addPhotoBtn.classList.add("hidden");
    textAddImg.classList.add("hidden");

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result; // load image at <img> id = preview
        preview.classList.remove("hidden");
    };

    reader.readAsDataURL(file); // file reading as a URL
});

//Page behaviour when submitting te form
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

    //create a formData with the data we want to retrieve from the form to add it to the body of the configuration object
    const formData = new FormData();

    formData.append("image", formImg);
    formData.append("title", formTitleValue);
    formData.append("category", categoryValue);

    //Configuration object
    const formOptionsModal = {
        method: "post",
        body: formData,
    };
    submitNewWork(formOptionsModal);
});

//function to form reset
function resetForm() {
    preview.src = "";
    inputTitle.value = "";
    inputFile.value = "";
    categoryFormModal.value = "";
    messageError.classList.add("hidden");
    preview.classList.add("hidden");
    iconImage.classList.remove("hidden");
    addPhotoBtn.classList.remove("hidden");
    textAddImg.classList.remove("hidden");
    buttonSubmit.classList.remove("valider-green");
    buttonSubmit.classList.add("valider");
}

//update the button style depending on whether the fields have been completed.
formTitle.addEventListener("input", checkForm);
categoryFormModal.addEventListener("change", checkForm);
inputFile.addEventListener("change", checkForm);

//********** FUNCTIONS ********/

function checkForm() {
    if (inputFile.files.length > 0 && formTitle.value.trim() !== "" && ["1", "2", "3"].includes(categoryFormModal.value)) {
        buttonSubmit.classList.remove("valider");
        buttonSubmit.classList.add("valider-green");
        messageError.classList.add("hidden");
    } else {
        buttonSubmit.classList.add("valider");
        buttonSubmit.classList.remove("valider-green");
    }
}

//Function that collects the Works data from the API, traverses its array and creates an element for each of the objects.
async function modalWorks() {
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

        //event to delete img
        deleteImg.addEventListener("click", () => {
            const workId = allWorks[i].id;
            worksContent.dataset.id = workId; //assign an id to each figure
            deleteWorks(workId);
            worksContent.remove();

            //confirmation message
            const deleteMessage = document.getElementById("message-delete-img");
            deleteMessage.innerText = "Le travail a été supprimé correctement";
            deleteMessage.classList.remove("hidden");
            deleteMessage.classList.add("confirmation-message");
            setTimeout(() => {
                deleteMessage.classList.add("hidden");
            }, 2000);
        });
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

    const selectCategory = document.createElement("option");
    selectCategory.innerText = "<-- Selectionnez une categorie -->";
    selectCategory.value = 0;
    selectCategory.selected = true;
    categoryFormModal.appendChild(selectCategory);

    for (let i = 0; i < categoriesForm.length; i++) {
        const categoriesOption = categoriesForm[i].name;
        const categoriesId = categoriesForm[i].id;

        const categoryContent = document.createElement("option");
        categoryContent.setAttribute("value", categoriesId);
        categoryContent.textContent = categoriesOption;

        categoryFormModal.appendChild(categoryContent);
    }
}

// Fetches updated works from the API with token validation.
// If the response is successful, updates the UI using displayWorks().
async function submitNewWork(formOptionsModal) {
    const token = localStorage.getItem("token");

    formOptionsModal.headers = {
        Authorization: `Bearer ${token}`,
    };
    try {
        const response = await fetch("http://localhost:5678/api/works", formOptionsModal);
        const data = await response.json();

        if (response.ok) {
            displayWorks(data);
            /* setTimeout(() => {
            location.reload();
        }, 2000); */ //reload page to show update displayWorks
            formModal.reset();
            resetForm();
            messageError.classList.remove("hidden");
            messageError.classList.add("confirmation-message");
            messageError.innerText = "Le travail a été enregistré correctement";
            setTimeout(() => {
                messageError.classList.add("hidden");
            }, 3000);
        } else {
            messageError.innerText = "Erreur lors de l'envoi du formulaire.";
            messageError.classList.remove("hidden");
            setTimeout(() => {
                messageError.classList.add("hidden");
            }, 3000);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire :", error);
        messageError.classList.remove("hidden");
        messageError.innerText = "Une erreur est survenue. Veuillez réessayer.";
        setTimeout(() => {
            messageError.classList.add("hidden");
        }, 3000);
    }
}

//Function to delete works

async function deleteWorks(id) {
    const token = localStorage.getItem("token");

    const deleteOptions = {
        method: `DELETE`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`http://localhost:5678/api/works/${id}`, deleteOptions);
}
