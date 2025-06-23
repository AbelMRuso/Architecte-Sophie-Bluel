//We capture the form-login element, listen for the submit event, and prevent its default behavior
const formSubmit = document.getElementById("form-login");

formSubmit.addEventListener("submit", (event) => {
    event.preventDefault();

    // take the value of email and password from the form
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;

    //options for form validation to be used in the fetch function
    const formOptionsLogin = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
        }),
    };

    //declaration of error message constant to avoid duplication code within the try/catch block
    const messageError = document.querySelector(".error-message");

    //function that retrieves the response from the api and returns it in json format
    async function loginForm() {
        try {
            const response = await fetch("http://localhost:5678/api/users/login", formOptionsLogin);
            const data = await response.json();
            if (response.ok) {
                const stockToken = data.token;
                localStorage.setItem("token", stockToken);
                location.replace("index.html");
            } else {
                messageError.classList.remove("hidden");
                messageError.textContent = "Erreur: email ou mot de passe incorrect";
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            messageError.textContent = "Erreur: Veuillez réessayer plus tard.";
            messageError.classList.remove("hidden");
        }
    }
    loginForm();
});

//mail: sophie.bluel@test.tld
//password: S0phie
