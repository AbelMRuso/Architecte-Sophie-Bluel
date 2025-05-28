// "File dedicated to retrieving elements from the server and integrating them into the DOM."

// Function to retrieve the "work" elements from the server and insert them into the DOM.

const galleryContent = document.querySelector(".gallery");

const works = await getWorks();
console.log(works);
