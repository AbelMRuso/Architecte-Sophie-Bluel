//form data recovery

//We capture the form-login element, listen for the submit event, and prevent its default behavior
const formSubmit = document.getElementById("form-login");
formSubmit.addEventListener("submit", (event) => {
    event.preventDefault();

    // take the value of email and password from the form
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;

    //options for form validation to be used in the fetch function
    const formOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
        }),
    };

    //function that retrieves the response from the api and returns it in json format
    async function loginForm() {
        const response = await fetch("http://localhost:5678/api/users/login", formOptions);
        const data = await response.json();
        if (response.ok) {
            const stockToken = data.token;
            localStorage.setItem("token", stockToken);
            location.replace("http://127.0.0.1:5500/FrontEnd/index.html");
        } else {
            const messageError = document.querySelector(".error-message");
            messageError.classList.remove("hidden");
            messageError.textContent = "Erreur: email ou mot de passe incorrect";
        }
    }
    loginForm();
});

//|sophie.bluel@test.tld|S0phie|
