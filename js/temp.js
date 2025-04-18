//RegEx Expressions
const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-=+/])[A-Za-z\d!@#$%^&*\-=+/]{8,}$/;
const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const tNumberRegEx = /^T\d{8}$/;

document.addEventListener("DOMContentLoaded", function () {

    function showError(inputId, message) {
        let errorElement = document.getElementById(inputId + "Error");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }

    function clearErrors() {
        document.querySelectorAll(".error-text").forEach(el => el.style.display = "none");
    }

    document.getElementById("signUpForm").addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();
        let valid = true;

        let username = document.getElementById("signUpUsername").value.trim();
        let firstName = document.getElementById("signUpFirstName").value.trim();
        let lastName = document.getElementById("signUpLastName").value.trim();
        let tNumber = document.getElementById("signUpTNumber").value.trim();
        let email = document.getElementById("signUpEmail").value.trim();
        let password = document.getElementById("signUpPassword").value;
        let confirmPassword = document.getElementById("signUpConfirmPassword").value;

        if (username === "") {
            showError("signUpUsername", "Username is required.");
            valid = false;
        }
        if (firstName === "") {
            showError("signUpFirstName", "First name is required.");
            valid = false;
        }
        if (lastName === "") {
            showError("signUpLastName", "Last name is required.");
            valid = false;
        }
        if (!tNumberRegEx.test(tNumber)) {
            showError("signUpTNumber", "T-Number must start with 'T' followed by 8 digits.");
            valid = false;
        }
        if (!emailRegEx.test(email)) {
            showError("signUpEmail", "Enter a valid email address.");
            valid = false;
        }
        if (!passwordRegEx.test(password)) {
            showError("signUpPassword", "Password must be at least 8 characters, contain an uppercase letter, a number, and a special character.");
            valid = false;
        }
        if (password !== confirmPassword) {
            showError("signUpConfirmPassword", "Passwords must match.");
            valid = false;
        }

        if (!valid) {
            Swal.fire({ icon: "error", title: "Validation Error", text: "Please fix the errors." });
        } else {
            Swal.fire({ icon: "success", title: "Success", text: "Account created successfully!" });
        }
    });

    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        clearErrors();
        let valid = true;

        let username = document.getElementById("strLoginUsername").value.trim();
        let password = document.getElementById("strLoginPassword").value;

        if (username === "") {
            showError("loginUsername", "Username is required.");
            valid = false;
        }
        if (!passwordRegEx.test(password)) {
            showError("loginPassword", "Password must be at least 8 characters, contain an uppercase letter, a number, and a special character.");
            valid = false;
        }

        if (!valid) {
            Swal.fire({ icon: "error", title: "Login Failed", text: "Please enter valid credentials." });
        } else {
            await Swal.fire({ icon: "success", title: "Welcome Back!", text: "Login successful." });
            window.location.href = "dashboard.html";
        }
    });

    document.getElementById("btnShowSignUp").addEventListener("click", () => {
        document.getElementById("signUpCard").style.display = "block";
        document.getElementById("loginCard").style.display = "none";
        document.getElementById("mainCard").style.display = "none";
    });

    document.getElementById("btnShowLogin").addEventListener("click", () => {
        document.getElementById("loginCard").style.display = "block";
        document.getElementById("signUpCard").style.display = "none";
        document.getElementById("mainCard").style.display = "none";
    });

    document.getElementById("btnCloseSignUp").addEventListener("click", () => {
        document.getElementById("signUpCard").style.display = "none";
    });

    document.getElementById("btnCloseLogin").addEventListener("click", () => {
        document.getElementById("loginCard").style.display = "none";
    });

    // for the smaller buttons of the forms
    document.getElementById("btnSignBackToWeb").addEventListener("click", () => {
        document.getElementById("signUpCard").style.display = "none";
        document.getElementById("loginCard").style.display = "none";
        document.getElementById("mainCard").style.display = "block";
    });
    document.getElementById("btnLoginBackToWeb").addEventListener("click", () => {
        document.getElementById("signUpCard").style.display = "none";
        document.getElementById("loginCard").style.display = "none";
        document.getElementById("mainCard").style.display = "block";
    });

    document.getElementById("btnShowLogin1").addEventListener("click", () => {
        document.getElementById("signUpCard").style.display = "none";
        document.getElementById("loginCard").style.display = "block";
    });
    document.getElementById("btnShowSignUp1").addEventListener("click", () => {
        document.getElementById("signUpCard").style.display = "block";
        document.getElementById("loginCard").style.display = "none";
    });
});