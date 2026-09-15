// =====================================
// LOGIN / SIGNUP PAGE
// =====================================

console.log(
    "login.js loaded successfully!"
);


// =====================================
// GET ELEMENTS
// =====================================

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const loginMessage =
    document.getElementById("loginMessage");


// =====================================
// SHOW SIGNUP FORM
// =====================================

showSignupBtn.addEventListener(
    "click",
    function () {

        loginForm.style.display =
            "none";

        signupForm.style.display =
            "block";

        loginMessage.textContent =
            "";

    }
);


// =====================================
// SHOW LOGIN FORM
// =====================================

showLoginBtn.addEventListener(
    "click",
    function () {

        signupForm.style.display =
            "none";

        loginForm.style.display =
            "block";

        loginMessage.textContent =
            "";

    }
);


// =====================================
// LOGIN
// =====================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        loginMessage.textContent =
            "Logging in...";

        loginMessage.style.color =
            "#2563eb";


        try {

            await firebase
                .auth()
                .signInWithEmailAndPassword(
                    email,
                    password
                );


            console.log(
                "Login successful!"
            );


            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color =
                "green";


            // Go to dashboard

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                700
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            loginMessage.textContent =
                getFirebaseErrorMessage(
                    error
                );

            loginMessage.style.color =
                "red";

        }

    }
);


// =====================================
// SIGNUP
// =====================================

signupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("signupEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("signupPassword")
                .value;


        // Basic password validation

        if (password.length < 6) {

            loginMessage.textContent =
                "Password must be at least 6 characters.";

            loginMessage.style.color =
                "red";

            return;

        }


        loginMessage.textContent =
            "Creating account...";

        loginMessage.style.color =
            "#2563eb";


        try {

            const userCredential =
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        email,
                        password
                    );


            console.log(
                "Account created successfully!"
            );


            console.log(
                "User ID:",
                userCredential.user.uid
            );


            loginMessage.textContent =
                "Account created successfully!";

            loginMessage.style.color =
                "green";


            // Go to dashboard

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                700
            );


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


            loginMessage.textContent =
                getFirebaseErrorMessage(
                    error
                );

            loginMessage.style.color =
                "red";

        }

    }
);


// =====================================
// FIREBASE ERROR MESSAGES
// =====================================

function getFirebaseErrorMessage(
    error
) {

    switch (error.code) {


        case "auth/invalid-email":

            return "Please enter a valid email address.";


        case "auth/user-not-found":

            return "No account found with this email.";


        case "auth/wrong-password":

            return "Incorrect password.";


        case "auth/email-already-in-use":

            return "An account with this email already exists.";


        case "auth/weak-password":

            return "Password is too weak. Use at least 6 characters.";


        case "auth/too-many-requests":

            return "Too many attempts. Please try again later.";


        case "auth/network-request-failed":

            return "Network error. Please check your internet connection.";


        default:

            return (
                error.message ||
                "Something went wrong. Please try again."
            );

    }

}