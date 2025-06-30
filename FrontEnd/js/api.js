//Function to get "works" data from the local server
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        return data; //returns the json data when calling the function
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error);
        return [];
    }
}

//Function to get "categories" data from the local server
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        return data; //returns the json data when calling the function
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return [];
    }
}
