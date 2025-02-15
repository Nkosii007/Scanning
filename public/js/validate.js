const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    
    const email = document.getElementById("email-input").value;
    const pass = document.getElementById("password-input").value;


    let isValid = true;

    document.getElementById("email-error").textContent = "";
    document.getElementById("password-error").textContent = "";


    const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
        document.getElementById("email-error").textContent = 
            "Invalid email address.";
        isValid = false;
    }
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    if (!passRegex.test(pass)) {
        document.getElementById("password-error").textContent = 
            "Incorrect Password";
        isValid = false;
    }

    if (isValid) {
        alert("Form submitted successfully!");
    }
});