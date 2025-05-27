//Function to get "works" data from the local server
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    console.log(data);
    return data;
}

getWorks();

//Function to get "categories" data from the local server
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    console.log(data);
    return data;
}

getCategories();
