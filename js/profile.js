// =====================================
// PROFILE PAGE
// =====================================

const profileForm =
    document.getElementById("profileForm");

const profileMessage =
    document.getElementById("profileMessage");

console.log(
    "profile.js loaded successfully!"
);


// =====================================
// CHECK LOGIN STATUS
// =====================================

firebase.auth().onAuthStateChanged(
    async function (user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "Logged-in user:",
            user.email
        );


        // Load this user's profile

        await loadProfile(
            user.uid
        );

    }
);


// =====================================
// LOAD USER PROFILE
// =====================================

async function loadProfile(userId) {

    try {

        const doc =
            await db
                .collection("profiles")
                .doc(userId)
                .get();


        if (doc.exists) {

            const profile =
                doc.data();


            document.getElementById(
                "profileName"
            ).value =
                profile.name || "";


            document.getElementById(
                "profileEmail"
            ).value =
                profile.email || "";


            document.getElementById(
                "profileAge"
            ).value =
                profile.age || "";


            document.getElementById(
                "profileWeight"
            ).value =
                profile.weight || "";


            document.getElementById(
                "profileHeight"
            ).value =
                profile.height || "";


            document.getElementById(
                "stepGoal"
            ).value =
                profile.stepGoal || "";


            document.getElementById(
                "calorieGoal"
            ).value =
                profile.calorieGoal || "";


            document.getElementById(
                "workoutGoal"
            ).value =
                profile.workoutGoal || "";


            document.getElementById(
                "waterGoal"
            ).value =
                profile.waterGoal || "";


            console.log(
                "User profile loaded successfully!"
            );

        } else {

            // No profile exists for this user yet

            console.log(
                "No profile found for this user."
            );

        }


    } catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

        profileMessage.textContent =
            "Unable to load profile.";

        profileMessage.style.color =
            "red";

    }

}


// =====================================
// SAVE USER PROFILE
// =====================================

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Make sure user is logged in

        const user =
            firebase.auth().currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        // =====================================
        // GET VALUES
        // =====================================

        const age =
            Number(
                document.getElementById(
                    "profileAge"
                ).value
            );


        const weight =
            Number(
                document.getElementById(
                    "profileWeight"
                ).value
            );


        const height =
            Number(
                document.getElementById(
                    "profileHeight"
                ).value
            );


        const stepGoal =
            Number(
                document.getElementById(
                    "stepGoal"
                ).value
            );


        const calorieGoal =
            Number(
                document.getElementById(
                    "calorieGoal"
                ).value
            );


        const workoutGoal =
            Number(
                document.getElementById(
                    "workoutGoal"
                ).value
            );


        const waterGoal =
            Number(
                document.getElementById(
                    "waterGoal"
                ).value
            );


        // =====================================
        // VALIDATION
        // =====================================

        if (
            age < 1 ||
            age > 120
        ) {

            profileMessage.textContent =
                "Please enter a valid age between 1 and 120.";

            profileMessage.style.color =
                "red";

            return;

        }


        if (weight <= 0) {

            profileMessage.textContent =
                "Weight must be greater than 0.";

            profileMessage.style.color =
                "red";

            return;

        }


        if (height <= 0) {

            profileMessage.textContent =
                "Height must be greater than 0.";

            profileMessage.style.color =
                "red";

            return;

        }


        if (stepGoal <= 0) {

            profileMessage.textContent =
                "Step goal must be greater than 0.";

            profileMessage.style.color =
                "red";

            return;

        }


        if (calorieGoal <= 0) {

            profileMessage.textContent =
                "Calorie goal must be greater than 0.";

            profileMessage.style.color =
                "red";

            return;

        }


        if (workoutGoal <= 0) {

            profileMessage.textContent =
                "Workout goal must be greater than 0.";

            profileMessage.style.color =
                "red";

            return;

        }


        if (waterGoal <= 0) {

            profileMessage.textContent =
                "Water goal must be greater than 0.";

            profileMessage.style.color =
                "red";

            return;

        }


        // =====================================
        // CREATE PROFILE OBJECT
        // =====================================

        const profile = {

            name:
                document
                    .getElementById(
                        "profileName"
                    )
                    .value
                    .trim(),

            email:
                user.email,

            age:
                age,

            weight:
                weight,

            height:
                height,

            stepGoal:
                stepGoal,

            calorieGoal:
                calorieGoal,

            workoutGoal:
                workoutGoal,

            waterGoal:
                waterGoal,

            updatedAt:
                firebase.firestore.FieldValue
                    .serverTimestamp()

        };


        // =====================================
        // SAVE PROFILE
        // =====================================

        try {

            await db
                .collection("profiles")
                .doc(user.uid)
                .set(
                    profile
                );


            console.log(
                "User profile saved successfully!"
            );


            profileMessage.textContent =
                "Profile saved successfully!";

            profileMessage.style.color =
                "green";


        } catch (error) {

            console.error(
                "Error saving profile:",
                error
            );


            profileMessage.textContent =
                "Error saving profile. Please try again.";

            profileMessage.style.color =
                "red";

        }

    }
);