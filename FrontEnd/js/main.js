const galleryContent = document.querySelector(".gallery");

//Function that will add the "works" elements to the DOM.
function displayWorks(works) {
    //Clear the DOM elements so that when we use the filters, only the elements we need are displayed.
    galleryContent.innerHTML = "";

    //Loop to retrieve the image and title values from the works collection.
    for (let i = 0; i < works.length; i++) {
        const img = works[i].imageUrl;
        const title = works[i].title;

        const worksContent = document.createElement("figure");
        const imgContent = document.createElement("img");
        const titleContent = document.createElement("figcaption");

        //Retrieval of the src of the images and the text of each work.
        imgContent.src = img;
        titleContent.innerText = title;

        worksContent.appendChild(imgContent);
        worksContent.appendChild(titleContent);

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

//without token, the .edition-mode div and the modify button that will open the modal are not shown.
window.addEventListener("DOMContentLoaded", () => {
    const getEditionMode = document.querySelector(".edition-mode");
    const getModifyButton = document.getElementById("modify-button");

    if (!localStorage.getItem("token")) {
        getEditionMode.classList.add("hidden");
        getModifyButton.classList.add("hidden");
    }
});
