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

    //fragment that hides the buttons by categories when the user has logged in
    if (localStorage.getItem("token")) {
        const categoryButtons = document.querySelectorAll(".categories button");
        categoryButtons.forEach((button) => {
            button.classList.add("hidden");
        });
    }

    //Creation of the array to store the works.
    let allWorks = await getWorks();
    displayWorks(allWorks);

    //Selection of the buttons inside .categories and forEach to create a click event for each of them.
    const categoryButtons = document.querySelectorAll(".categories button");
    categoryButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            //We create a variable that takes a numeric value coming from button.dataset.categoryId
            const categoryId = parseInt(button.dataset.categoryId);

            //If categoryId is equal to 0, we show all the works.
            if (categoryId === 0) {
                displayWorks(allWorks);
                //In any other case, we show the filtered works by comparing work.categoryId with categoryId.
            } else {
                const filteredWorks = allWorks.filter((work) => work.categoryId === categoryId);
                displayWorks(filteredWorks);
            }
        });
    });
}

initCategories();
