// ***** Function to retrieve the "work" elements from the server and insert them into the DOM.

const galleryContent = document.querySelector(".gallery");

//Function that will add the "works" elements to the DOM.
function displayWorks(works) {
    //Clear the DOM elements so that when we use the filters, only the elements we need are displayed.
    galleryContent.innerHTML = "";

    //Loop to retrieve the image and title values from the works collection.
    for (let i = 0; i < works.length; i++) {
        const img = works[i].imageUrl;
        const title = works[i].title;

        //Creation of the figure elements which will contain the following elements: img and figcaption.
        const worksContent = document.createElement("figure");
        const imgContent = document.createElement("img");
        const titleContent = document.createElement("figcaption");

        //Retrieval of the src of the images and the text of each work.
        imgContent.src = img;
        titleContent.innerText = title;

        //Integration of the images and titles into their parent container "worksContent" (figure).
        worksContent.appendChild(imgContent);
        worksContent.appendChild(titleContent);

        //Integration of worksContent into its parent element "galleryContent" (div gallery).
        galleryContent.appendChild(worksContent);
    }
}

// **** behaviour of the index.html tab depending on whether the user is logged in or logged out

//Show logout if localStorage contents "token"
const logButton = document.getElementById("auth-button");
if (localStorage.getItem("token")) {
    logButton.innerText = "logout";
}

//if we have a token and click on logout, we delete the token, redirect to index.html and show login, if we click on login we redirect to login.html
logButton.addEventListener("click", (event) => {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        logButton.innerText = "login";
        location.replace("http://127.0.0.1:5500/FrontEnd/index.html");
    } else {
        location.assign("http://127.0.0.1:5500/FrontEnd/login.html");
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const getEditionMode = document.querySelector(".edition-mode");
    const getModifyButton = document.getElementById("modify-button");

    if (!localStorage.getItem("token")) {
        getEditionMode.classList.add("hidden");
        getModifyButton.classList.add("hidden");
    }
});

//*****behaviour of the modal window */

async function modalWorks() {
    //array con todos los trabajos
    let allWorks = await getWorks();

    //contenedor padre + contenedoes para imágen + creación de imágenes
    const modalContent = document.getElementById("modal-images");

    for (let i = 0; i < allWorks.length; i++) {
        const imgModal = allWorks[i].imageUrl;
        const worksContent = document.createElement("figure");
        const imgContent = document.createElement("img");

        imgContent.src = imgModal;
        worksContent.appendChild(imgContent);
        modalContent.appendChild(worksContent);
    }
}

modalWorks();
