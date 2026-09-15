// =====================================
// DASHBOARD PAGE
// =====================================

console.log(
    "dashboard.js loaded successfully!"
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
        // LOAD DASHBOARD FOR THIS USER
        // =====================================

        await loadDashboard(
            user.uid
        );


        // =====================================
        // LOAD RECENT ACTIVITIES
        // =====================================

        await loadRecentActivities(
            user.uid
        );

    }
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


const today =
    getTodayDate();


// =====================================
// LOAD DASHBOARD
// =====================================

async function loadDashboard(
    userId
) {

    try {

        // =====================================
        // 1. GET USER PROFILE
        // =====================================

        const profileDoc =
            await db
                .collection(
                    "profiles"
                )
                .doc(
                    userId
                )
                .get();


        // =====================================
        // DEFAULT GOALS
        // =====================================

        let stepGoal =
            10000;


        let calorieGoal =
            600;


        let workoutGoal =
            60;


        let waterGoal =
            3;


        // =====================================
        // LOAD PROFILE
        // =====================================

        if (profileDoc.exists) {

            const profile =
                profileDoc.data();


            // Display user's name

            document.getElementById(
                "dashboardUserName"
            ).textContent =
                profile.name ||
                "User";


            // Get user's goals

            stepGoal =
                Number(
                    profile.stepGoal
                ) ||
                10000;


            calorieGoal =
                Number(
                    profile.calorieGoal
                ) ||
                600;


            workoutGoal =
                Number(
                    profile.workoutGoal
                ) ||
                60;


            waterGoal =
                Number(
                    profile.waterGoal
                ) ||
                3;

        } else {

            // No profile created yet

            document.getElementById(
                "dashboardUserName"
            ).textContent =
                "User";

        }


        // =====================================
        // 2. GET TODAY'S USER ACTIVITIES
        // =====================================

        const snapshot =
            await db
                .collection(
                    "activities"
                )
                .where(
                    "userId",
                    "==",
                    userId
                )
                .get();


        // =====================================
        // TOTALS
        // =====================================

        let totalSteps =
            0;


        let totalCalories =
            0;


        let totalWorkout =
            0;


        let totalWater =
            0;


        // =====================================
        // PROCESS USER ACTIVITIES
        // =====================================

        snapshot.forEach(
            function (doc) {

                const activity =
                    doc.data();


                // Only today's activities

                if (
                    activity.date ===
                    today
                ) {

                    totalSteps +=
                        Number(
                            activity.steps
                        ) || 0;


                    totalCalories +=
                        Number(
                            activity.calories
                        ) || 0;


                    totalWorkout +=
                        Number(
                            activity.duration
                        ) || 0;


                    totalWater +=
                        Number(
                            activity.water
                        ) || 0;

                }

            }
        );


        // =====================================
        // 3. DISPLAY TODAY'S TOTALS
        // =====================================

        document.getElementById(
            "dashboardSteps"
        ).textContent =
            totalSteps.toLocaleString();


        document.getElementById(
            "dashboardCalories"
        ).textContent =
            totalCalories.toLocaleString()
            + " kcal";


        document.getElementById(
            "dashboardWorkout"
        ).textContent =
            totalWorkout.toLocaleString()
            + " min";


        document.getElementById(
            "dashboardWater"
        ).textContent =
            totalWater.toFixed(1)
            + " L";


        // =====================================
        // 4. DISPLAY GOALS
        // =====================================

        document.getElementById(
            "dashboardStepGoal"
        ).textContent =
            "Goal: "
            +
            stepGoal.toLocaleString();


        document.getElementById(
            "dashboardCalorieGoal"
        ).textContent =
            "Goal: "
            +
            calorieGoal.toLocaleString()
            +
            " kcal";


        document.getElementById(
            "dashboardWorkoutGoal"
        ).textContent =
            "Goal: "
            +
            workoutGoal.toLocaleString()
            +
            " min";


        document.getElementById(
            "dashboardWaterGoal"
        ).textContent =
            "Goal: "
            +
            waterGoal.toFixed(1)
            +
            " L";


        // =====================================
        // 5. CALCULATE PERCENTAGES
        // =====================================

        const stepsPercent =
            calculatePercentage(
                totalSteps,
                stepGoal
            );


        const caloriesPercent =
            calculatePercentage(
                totalCalories,
                calorieGoal
            );


        const workoutPercent =
            calculatePercentage(
                totalWorkout,
                workoutGoal
            );


        const waterPercent =
            calculatePercentage(
                totalWater,
                waterGoal
            );


        // =====================================
        // 6. DISPLAY PERCENTAGES
        // =====================================

        document.getElementById(
            "stepsPercentage"
        ).textContent =
            stepsPercent +
            "%";


        document.getElementById(
            "caloriesPercentage"
        ).textContent =
            caloriesPercent +
            "%";


        document.getElementById(
            "workoutPercentage"
        ).textContent =
            workoutPercent +
            "%";


        document.getElementById(
            "waterPercentage"
        ).textContent =
            waterPercent +
            "%";


        // =====================================
        // 7. UPDATE PROGRESS BARS
        // =====================================

        document.getElementById(
            "stepsProgressBar"
        ).style.width =
            stepsPercent +
            "%";


        document.getElementById(
            "caloriesProgressBar"
        ).style.width =
            caloriesPercent +
            "%";


        document.getElementById(
            "workoutProgressBar"
        ).style.width =
            workoutPercent +
            "%";


        document.getElementById(
            "waterProgressBar"
        ).style.width =
            waterPercent +
            "%";


        console.log(
            "Dashboard loaded successfully!"
        );


        console.log(
            "Today's user data:",
            {
                date:
                    today,

                userId:
                    userId,

                steps:
                    totalSteps,

                calories:
                    totalCalories,

                workout:
                    totalWorkout,

                water:
                    totalWater
            }
        );


    } catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );

    }

}


// =====================================
// CALCULATE PERCENTAGE
// =====================================

function calculatePercentage(
    value,
    goal
) {

    if (
        goal <= 0
    ) {

        return 0;

    }


    const percentage =
        (
            value /
            goal
        ) *
        100;


    return Math.min(
        Math.round(
            percentage
        ),
        100
    );

}


// =====================================
// RECENT ACTIVITIES
// =====================================

async function loadRecentActivities(
    userId
) {

    const recentActivityBody =
        document.getElementById(
            "recentActivityBody"
        );


    const recentActivityMessage =
        document.getElementById(
            "recentActivityMessage"
        );


    try {

        // =====================================
        // GET THIS USER'S ACTIVITIES
        // =====================================

        const snapshot =
            await db
                .collection(
                    "activities"
                )
                .where(
                    "userId",
                    "==",
                    userId
                )
                .get();


        // =====================================
        // CLEAR TABLE
        // =====================================

        recentActivityBody.innerHTML =
            "";


        // =====================================
        // NO ACTIVITIES
        // =====================================

        if (
            snapshot.empty
        ) {

            recentActivityBody.innerHTML = `

                <tr>

                    <td colspan="4">

                        No activities recorded yet.

                    </td>

                </tr>

            `;


            recentActivityMessage.textContent =
                "No activities recorded yet.";

            return;

        }


        // =====================================
        // CONVERT TO ARRAY
        // =====================================

        const activities = [];


        snapshot.forEach(
            function (doc) {

                activities.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        // =====================================
        // SORT BY DATE
        // NEWEST FIRST
        // =====================================

        activities.sort(
            function (a, b) {

                return b.date.localeCompare(
                    a.date
                );

            }
        );


        // =====================================
        // GET ONLY 5 RECENT ACTIVITIES
        // =====================================

        const recentActivities =
            activities.slice(
                0,
                5
            );


        // =====================================
        // DISPLAY ACTIVITIES
        // =====================================

        recentActivities.forEach(
            function (activity) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${activity.date || "-"}
                    </td>


                    <td>
                        ${activity.exercise || "-"}
                    </td>


                    <td>
                        ${activity.duration || 0}
                        min
                    </td>


                    <td>
                        ${activity.calories || 0}
                        kcal
                    </td>

                `;


                recentActivityBody.appendChild(
                    row
                );

            }
        );


        // =====================================
        // MESSAGE
        // =====================================

        recentActivityMessage.textContent =
            `Showing ${recentActivities.length} recent activity record(s).`;


    } catch (error) {

        console.error(
            "Error loading recent activities:",
            error
        );


        recentActivityMessage.textContent =
            "Unable to load recent activities.";


        recentActivityMessage.style.color =
            "red";

    }

}