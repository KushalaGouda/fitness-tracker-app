// =====================================
// ACTIVITY PAGE
// =====================================

console.log(
    "activity.js loaded successfully!"
);


// =====================================
// CHECK LOGIN STATUS
// =====================================

firebase.auth().onAuthStateChanged(
    async function (user) {

        if (!user) {

            // User is not logged in

            window.location.href =
                "login.html";

            return;
        }


        console.log(
            "Logged-in user:",
            user.email
        );


        // =====================================
        // START ACTIVITY PAGE
        // =====================================

        startActivityPage(user);

    }
);


// =====================================
// CHECK FOR EDIT MODE
// =====================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const editActivityId =
    urlParams.get("edit");


console.log(
    "Edit Activity ID:",
    editActivityId
);


// =====================================
// GET TODAY'S DATE
// =====================================

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


const todayDate =
    getTodayDate();


// =====================================
// SET DATE FIELD
// =====================================

document.getElementById(
    "activityDate"
).value =
    todayDate;


document.getElementById(
    "activityDate"
).max =
    todayDate;


// =====================================
// GET FORM ELEMENTS
// =====================================

const activityForm =
    document.getElementById(
        "activityForm"
    );


const message =
    document.getElementById(
        "activityMessage"
    );


const saveButton =
    document.getElementById(
        "saveActivityBtn"
    );


const exerciseType =
    document.getElementById(
        "exerciseType"
    );


const durationInput =
    document.getElementById(
        "duration"
    );


const weightInput =
    document.getElementById(
        "weight"
    );


const caloriesInput =
    document.getElementById(
        "calories"
    );


const calorieMessage =
    document.getElementById(
        "calorieMessage"
    );


console.log(
    "Activity form elements loaded!"
);


// =====================================
// CHANGE BUTTON FOR EDIT MODE
// =====================================

if (editActivityId) {

    saveButton.textContent =
        "Update Activity";

}


// =====================================
// CALORIE ESTIMATION
// =====================================

// Approximate MET values.
// These are estimates and can vary
// depending on intensity and individual factors.

const exerciseMET = {

    "Walking": 3.5,

    "Running": 9.8,

    "Cycling": 7.5,

    "Swimming": 8.0,

    "Gym": 6.0,

    "Yoga": 3.0,

    "Other": 5.0

};


// =====================================
// CALCULATE ESTIMATED CALORIES
// =====================================

function calculateCalories() {

    const exercise =
        exerciseType.value;


    const duration =
        Number(
            durationInput.value
        );


    const weight =
        Number(
            weightInput.value
        );


    // If information is missing

    if (
        !exercise ||
        duration <= 0 ||
        weight <= 0
    ) {

        caloriesInput.value =
            "";


        calorieMessage.textContent =
            "Select an exercise and enter duration and weight.";


        calorieMessage.style.color =
            "#64748b";


        return;

    }


    // Get MET value

    const met =
        exerciseMET[exercise] || 5.0;


    // Standard MET calorie formula:
    //
    // Calories =
    // MET × body weight × time in hours

    const calories =
        met *
        weight *
        (duration / 60);


    const roundedCalories =
        Math.round(
            calories
        );


    // Display calculated calories

    caloriesInput.value =
        roundedCalories;


    calorieMessage.textContent =
        `Estimated calories for ${exercise}: approximately ${roundedCalories} kcal.`;


    calorieMessage.style.color =
        "green";


    console.log(
        "Estimated calories:",
        roundedCalories
    );

}


// =====================================
// CALCULATE WHEN EXERCISE CHANGES
// =====================================

exerciseType.addEventListener(
    "change",
    calculateCalories
);


// =====================================
// CALCULATE WHEN DURATION CHANGES
// =====================================

durationInput.addEventListener(
    "input",
    calculateCalories
);


// =====================================
// CALCULATE WHEN WEIGHT CHANGES
// =====================================

weightInput.addEventListener(
    "input",
    calculateCalories
);


// =====================================
// START ACTIVITY PAGE
// =====================================

function startActivityPage(user) {

    console.log(
        "Starting activity page for:",
        user.email
    );


    // =====================================
    // SUBMIT ACTIVITY
    // =====================================

    activityForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =====================================
            // GET FORM VALUES
            // =====================================

            const date =
                document.getElementById(
                    "activityDate"
                ).value;


            const exercise =
                document.getElementById(
                    "exerciseType"
                ).value.trim();


            const duration =
                Number(
                    document.getElementById(
                        "duration"
                    ).value
                );


            const weight =
                Number(
                    document.getElementById(
                        "weight"
                    ).value
                );


            const steps =
                Number(
                    document.getElementById(
                        "steps"
                    ).value
                );


            const calories =
                Number(
                    document.getElementById(
                        "calories"
                    ).value
                );


            const water =
                Number(
                    document.getElementById(
                        "water"
                    ).value
                );


            const notes =
                document.getElementById(
                    "notes"
                ).value.trim();


            // =====================================
            // VALIDATION
            // =====================================

            if (!date) {

                message.textContent =
                    "Please select a date.";

                message.style.color =
                    "red";

                return;

            }


            if (!exercise) {

                message.textContent =
                    "Please select an exercise type.";

                message.style.color =
                    "red";

                return;

            }


            if (duration <= 0) {

                message.textContent =
                    "Workout duration must be greater than 0.";

                message.style.color =
                    "red";

                return;

            }


            if (weight <= 0) {

                message.textContent =
                    "Please enter your body weight.";

                message.style.color =
                    "red";

                return;

            }


            if (steps < 0) {

                message.textContent =
                    "Steps cannot be negative.";

                message.style.color =
                    "red";

                return;

            }


            if (calories <= 0) {

                message.textContent =
                    "Calories could not be calculated. Please check exercise, duration and weight.";

                message.style.color =
                    "red";

                return;

            }


            if (water < 0) {

                message.textContent =
                    "Water intake cannot be negative.";

                message.style.color =
                    "red";

                return;

            }


            // =====================================
            // CREATE ACTIVITY OBJECT
            // =====================================

            const activity = {

                userId:
                    user.uid,

                date:
                    date,

                exercise:
                    exercise,

                duration:
                    duration,

                weight:
                    weight,

                steps:
                    steps,

                calories:
                    calories,

                water:
                    water,

                notes:
                    notes,

                updatedAt:
                    firebase.firestore.FieldValue
                        .serverTimestamp()

            };


            // =====================================
            // SAVE / UPDATE
            // =====================================

            try {

                if (editActivityId) {

                    // =====================================
                    // GET EXISTING ACTIVITY
                    // =====================================

                    const existingDoc =
                        await db
                            .collection(
                                "activities"
                            )
                            .doc(
                                editActivityId
                            )
                            .get();


                    if (!existingDoc.exists) {

                        alert(
                            "Activity not found."
                        );


                        window.location.href =
                            "history.html";


                        return;

                    }


                    const existingActivity =
                        existingDoc.data();


                    // =====================================
                    // SECURITY CHECK
                    // =====================================

                    if (
                        existingActivity.userId &&
                        existingActivity.userId !==
                        user.uid
                    ) {

                        alert(
                            "You cannot edit another user's activity."
                        );


                        window.location.href =
                            "history.html";


                        return;

                    }


                    // =====================================
                    // UPDATE ACTIVITY
                    // =====================================

                    await db
                        .collection(
                            "activities"
                        )
                        .doc(
                            editActivityId
                        )
                        .update(
                            activity
                        );


                    console.log(
                        "Activity updated successfully!"
                    );


                    message.textContent =
                        "Activity updated successfully!";

                    message.style.color =
                        "green";


                    // Return to History

                    setTimeout(
                        function () {

                            window.location.href =
                                "history.html";

                        },
                        1000
                    );


                } else {

                    // =====================================
                    // CREATE NEW ACTIVITY
                    // =====================================

                    activity.createdAt =
                        firebase.firestore.FieldValue
                            .serverTimestamp();


                    await db
                        .collection(
                            "activities"
                        )
                        .add(
                            activity
                        );


                    console.log(
                        "Activity saved to Firestore!"
                    );


                    console.log(
                        activity
                    );


                    message.textContent =
                        "Activity saved successfully!";

                    message.style.color =
                        "green";


                    // =====================================
                    // CLEAR FORM
                    // =====================================

                    activityForm.reset();


                    // Put today's date back

                    document.getElementById(
                        "activityDate"
                    ).value =
                        todayDate;


                    document.getElementById(
                        "activityDate"
                    ).max =
                        todayDate;


                    // Reset calorie field

                    caloriesInput.value =
                        "";


                    calorieMessage.textContent =
                        "Select an exercise and enter duration and weight.";

                    calorieMessage.style.color =
                        "#64748b";

                }


            } catch (error) {

                console.error(
                    "Error saving activity:",
                    error
                );


                message.textContent =
                    "Error saving activity. Please try again.";

                message.style.color =
                    "red";

            }

        }
    );

}


// =====================================
// LOAD ACTIVITY FOR EDITING
// =====================================

async function loadActivityForEdit() {

    if (!editActivityId) {

        return;

    }


    // Wait until Firebase knows
    // which user is logged in

    firebase.auth().onAuthStateChanged(
        async function (user) {

            if (!user) {

                return;

            }


            try {

                // =====================================
                // GET ACTIVITY
                // =====================================

                const doc =
                    await db
                        .collection(
                            "activities"
                        )
                        .doc(
                            editActivityId
                        )
                        .get();


                if (!doc.exists) {

                    alert(
                        "Activity not found."
                    );


                    window.location.href =
                        "history.html";


                    return;

                }


                const activity =
                    doc.data();


                // =====================================
                // CHECK USER OWNERSHIP
                // =====================================

                if (
                    activity.userId &&
                    activity.userId !==
                    user.uid
                ) {

                    alert(
                        "You cannot edit another user's activity."
                    );


                    window.location.href =
                        "history.html";


                    return;

                }


                // =====================================
                // FILL FORM
                // =====================================

                document.getElementById(
                    "activityDate"
                ).value =
                    activity.date || "";


                document.getElementById(
                    "exerciseType"
                ).value =
                    activity.exercise || "";


                document.getElementById(
                    "duration"
                ).value =
                    activity.duration ?? "";


                document.getElementById(
                    "weight"
                ).value =
                    activity.weight ?? "";


                document.getElementById(
                    "steps"
                ).value =
                    activity.steps ?? 0;


                document.getElementById(
                    "calories"
                ).value =
                    activity.calories ?? "";


                document.getElementById(
                    "water"
                ).value =
                    activity.water ?? "";


                document.getElementById(
                    "notes"
                ).value =
                    activity.notes || "";


                // Recalculate calories if possible

                calculateCalories();


                console.log(
                    "Activity loaded for editing!"
                );


            } catch (error) {

                console.error(
                    "Error loading activity:",
                    error
                );


                alert(
                    "Unable to load activity."
                );

            }

        }
    );

}


// =====================================
// START EDIT LOADING
// =====================================

loadActivityForEdit();
