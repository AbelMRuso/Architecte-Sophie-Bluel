//File to manage category filters.
const categoriesContent = document.querySelector(".categories");

//funtion categorie-buttons
async function initCategories() {
    const categories = await getCategories();
    //creation "tous" button
    const tousButton = document.createElement("button");
    tousButton.innerText = "Tous";
    tousButton.dataset.categoryId = 0;
    categoriesContent.appendChild(tousButton);

    //loop to get categories from array
    for (let i = 0; i < categories.length; i++) {
        const categoriesValue = categories[i].name;

        const categoriesButton = document.createElement("button");
        categoriesButton.innerText = categoriesValue;
        categoriesButton.dataset.categoryId = categories[i].id;

        categoriesContent.appendChild(categoriesButton);
    }
    const categoryButtons = document.querySelectorAll(".categories button");
    for (i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].addEventListener("click", (event) => {
            const button = event.currentTarget;
            console.log(`has clicado en el boton con la categoria ${button.dataset.categoryId}`);
        });
    }
}

initCategories();

//Function categorie-filtres
