document.getElementById("sign-in-button").addEventListener("click", async (event) => {
    event.preventDefault();
    
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if (!role) {
        alert("Please select a role.");
        return;
    }

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
        alert(`Login successful as ${data.role}`);
        localStorage.setItem("token", data.token); // Store JWT for future authentication
    } else {
        alert(data.message);
    }
});
