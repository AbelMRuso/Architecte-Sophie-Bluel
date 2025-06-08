//*****behaviour of the modal window */

//function to display images inside the modal

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

//closes the modal by clicking on the button
const modalDiv = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");

closeModal.addEventListener("click", () => {
    modalDiv.classList.add("hidden");
});

//modal is hidden
modalDiv.classList.add("hidden");

//hide the back-button from modal
const backButton = document.getElementById("back-button");
backButton.classList.add("hidden");

//Apply the correct class to modal-buttons when backButton is hidden
const modalButtons = document.querySelector(".modal-buttons");
if (backButton.classList.contains("hidden")) {
    modalButtons.classList.add("back-close-buttons");
}

//go to "ajout photo" inside modal by clicking the button "ajouter une photo"
const buttonModal = document.getElementById("button-modal");
const titleModal = document.querySelector(".title-modal h2");
const formPhoto = document.getElementById("modal-form");
const modalImages = document.getElementById("modal-images");

buttonModal.addEventListener("click", () => {
    if (currentView === "gallery") {
        displayFormModal();
    } else {
        // AÑADIREMOS ESTA VALIDACIÓN MÁS ADELANTE
    }
});

//CORRECCIÓN MODAL

let currentView = "gallery";

//Funciones según la vista

async function displayGalleryModal() {
    await modalWorks();
    modalDiv.classList.remove("hidden");
    formPhoto.classList.add("hidden");
    modalImages.classList.remove("hidden");
    backButton.classList.add("hidden");
    titleModal.innerText = "Galerie photo";
    buttonModal.classList.remove("valider");
    buttonModal.classList.add("ajouter");
    buttonModal.innerText = "Ajouter une photo";

    currentView = "gallery";
}

async function displayFormModal() {
    modalImages.classList.add("hidden");
    formPhoto.classList.remove("hidden");
    backButton.classList.remove("hidden");
    modalButtons.classList.add("separate-buttons");
    titleModal.innerText = "Ajout photo";
    buttonModal.classList.remove("ajouter");
    buttonModal.classList.add("valider");
    buttonModal.innerText = "valider";

    currentView = "form";
}

//show modal when click to modify
const modifyButton = document.getElementById("modify-button");
modifyButton.addEventListener("click", () => {
    displayGalleryModal();
});

// go back with back-button
backButton.addEventListener("click", () => {
    displayGalleryModal();
});
