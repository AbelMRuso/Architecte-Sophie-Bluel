//File to manage category filters.
const categoriesContent = document.querySelector(".categories");

//funtion categorie-buttons
async function filterCategories() {
    const categories = await getCategories();
    //add "tous" data to array categories
    categories.unshift({ id: 0, name: "Tous" });

    //loop to get categories from array
    for (let i = 0; i < categories.length; i++) {
        const categoriesValue = categories[i].name;
        const categoriesId = categories[i].id;

        const categoriesButton = document.createElement("button");
        categoriesButton.innerText = categoriesValue;
        categoriesButton.dataset.categoryId = categoriesId; //add id category for each button, it will be usefull to filter works
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
    displayWorks(allWorks); // this line show the works in index.html

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

filterCategories();
