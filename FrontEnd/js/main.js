// "File dedicated to retrieving elements from the server and integrating them into the DOM."

// Function to retrieve the "work" elements from the server and insert them into the DOM.

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
