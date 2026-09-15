// =====================================
// PROGRESS PAGE
// =====================================

console.log(
    "progress.js loaded successfully!"
);


// =====================================
// GET ELEMENTS
// =====================================

const totalStepsElement =
    document.getElementById("totalSteps");

const totalCaloriesElement =
    document.getElementById("totalCalories");

const totalWorkoutElement =
    document.getElementById("totalWorkout");

const totalWaterElement =
    document.getElementById("totalWater");

const progressSummary =
    document.getElementById("progressSummary");


// =====================================
// GET DATE STRING
// =====================================

function getDateString(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


// =====================================
// GET LAST 7 DAYS
// =====================================

const today =
    new Date();


const startDate =
    new Date(today);


startDate.setDate(
    today.getDate() - 6
);


const startDateString =
    getDateString(
        startDate
    );


const endDateString =
    getDateString(
        today
    );


console.log(
    "Weekly period:",
    startDateString,
    "to",
    endDateString
);


// =====================================
// CREATE 7-DAY DATA
// =====================================

const last7Days = [];

const dailyWorkout = {};


// Create all 7 days first

for (
    let i = 0;
    i < 7;
    i++
) {

    const date =
        new Date(
            startDate
        );


    date.setDate(
        startDate.getDate() + i
    );


    const dateString =
        getDateString(
            date
        );


    last7Days.push(
        dateString
    );


    dailyWorkout[dateString] =
        0;

}


// =====================================
// LOAD PROFILE GOALS + ACTIVITIES
// =====================================

async function loadProgress(
    userId
) {

    try {

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
        // LOAD USER PROFILE
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


        if (
            profileDoc.exists
        ) {

            const profile =
                profileDoc.data();


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

        }


        console.log(
            "Profile goals loaded:",
            {
                steps:
                    stepGoal,

                calories:
                    calorieGoal,

                workout:
                    workoutGoal,

                water:
                    waterGoal
            }
        );


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
        // PROCESS ACTIVITIES
        // =====================================

        snapshot.forEach(
            function (doc) {

                const activity =
                    doc.data();


                const activityDate =
                    activity.date;


                // Only activities
                // from the last 7 days

                if (
                    activityDate >=
                    startDateString &&
                    activityDate <=
                    endDateString
                ) {

                    // Steps

                    totalSteps +=
                        Number(
                            activity.steps
                        ) ||
                        0;


                    // Calories

                    totalCalories +=
                        Number(
                            activity.calories
                        ) ||
                        0;


                    // Workout

                    totalWorkout +=
                        Number(
                            activity.duration
                        ) ||
                        0;


                    // Water

                    totalWater +=
                        Number(
                            activity.water
                        ) ||
                        0;


                    // Daily workout
                    // for graph

                    if (
                        dailyWorkout.hasOwnProperty(
                            activityDate
                        )
                    ) {

                        dailyWorkout[
                            activityDate
                        ] +=
                            Number(
                                activity.duration
                            ) ||
                            0;

                    }

                }

            }
        );


        // =====================================
        // DISPLAY TOTALS
        // =====================================

        totalStepsElement.textContent =
            totalSteps.toLocaleString();


        totalCaloriesElement.textContent =
            totalCalories.toLocaleString()
            +
            " kcal";


        totalWorkoutElement.textContent =
            totalWorkout.toLocaleString()
            +
            " min";


        totalWaterElement.textContent =
            totalWater.toFixed(1)
            +
            " L";


        // =====================================
        // CALCULATE GOAL PERCENTAGES
        // =====================================

        const stepsPercentage =
            calculatePercentage(
                totalSteps,
                stepGoal
            );


        const caloriesPercentage =
            calculatePercentage(
                totalCalories,
                calorieGoal
            );


        const workoutPercentage =
            calculatePercentage(
                totalWorkout,
                workoutGoal
            );


        const waterPercentage =
            calculatePercentage(
                totalWater,
                waterGoal
            );


        // =====================================
        // ACTIVE DAYS
        // =====================================

        let activeDays =
            0;


        last7Days.forEach(
            function (date) {

                if (
                    dailyWorkout[date] >
                    0
                ) {

                    activeDays++;

                }

            }
        );


        // =====================================
        // PROGRESS SUMMARY
        // =====================================

        if (
            totalSteps === 0 &&
            totalCalories === 0 &&
            totalWorkout === 0 &&
            totalWater === 0
        ) {

            progressSummary.innerHTML = `

                <div class="goal-progress-item">

                    <strong>
                        👣 Steps
                    </strong>

                    <span>
                        0 /
                        ${stepGoal.toLocaleString()}
                    </span>

                </div>


                <div class="goal-progress-item">

                    <strong>
                        🔥 Calories
                    </strong>

                    <span>
                        0 /
                        ${calorieGoal.toLocaleString()}
                        kcal
                    </span>

                </div>


                <div class="goal-progress-item">

                    <strong>
                        🏋️ Workout
                    </strong>

                    <span>
                        0 /
                        ${workoutGoal}
                        min
                    </span>

                </div>


                <div class="goal-progress-item">

                    <strong>
                        💧 Water
                    </strong>

                    <span>
                        0 /
                        ${waterGoal.toFixed(1)}
                        L
                    </span>

                </div>


                <p class="progress-summary-message">

                    No fitness activities recorded
                    in the last 7 days.

                </p>


                <p>

                    Start exercising and your
                    weekly progress will appear here! 💪

                </p>

            `;

        } else {

            progressSummary.innerHTML = `

                <div class="goal-progress-item">

                    <strong>
                        👣 Steps
                    </strong>

                    <span>
                        ${totalSteps.toLocaleString()}
                        /
                        ${stepGoal.toLocaleString()}
                        (${stepsPercentage}%)
                    </span>

                </div>


                <div class="goal-progress-item">

                    <strong>
                        🔥 Calories
                    </strong>

                    <span>
                        ${totalCalories.toLocaleString()}
                        /
                        ${calorieGoal.toLocaleString()}
                        kcal
                        (${caloriesPercentage}%)
                    </span>

                </div>


                <div class="goal-progress-item">

                    <strong>
                        🏋️ Workout
                    </strong>

                    <span>
                        ${totalWorkout}
                        /
                        ${workoutGoal}
                        min
                        (${workoutPercentage}%)
                    </span>

                </div>


                <div class="goal-progress-item">

                    <strong>
                        💧 Water
                    </strong>

                    <span>
                        ${totalWater.toFixed(1)}
                        /
                        ${waterGoal.toFixed(1)}
                        L
                        (${waterPercentage}%)
                    </span>

                </div>


                <p class="progress-summary-message">

                    You recorded
                    <strong>
                        ${snapshot.size}
                    </strong>
                    activity record(s)
                    in the last 7 days.

                </p>


                <p>

                    You were active on
                    <strong>
                        ${activeDays}
                    </strong>
                    day(s).

                </p>


                <p>

                    Keep exercising regularly
                    to improve your fitness! 💪

                </p>

            `;

        }


        // =====================================
        // CREATE CHART DATA
        // =====================================

        const chartLabels = [];

        const chartWorkoutData = [];


        last7Days.forEach(
            function (date) {

                const dateObject =
                    new Date(
                        date +
                        "T00:00:00"
                    );


                const month =
                    dateObject.toLocaleString(
                        "en-US",
                        {
                            month:
                                "short"
                        }
                    );


                const day =
                    dateObject.getDate();


                chartLabels.push(
                    `${month} ${day}`
                );


                chartWorkoutData.push(
                    dailyWorkout[date] ||
                    0
                );

            }
        );


        // =====================================
        // CREATE WORKOUT CHART
        // =====================================

        const chartCanvas =
            document.getElementById(
                "workoutChart"
            );


        new Chart(
            chartCanvas,
            {

                type:
                    "bar",


                data: {

                    labels:
                        chartLabels,


                    datasets: [

                        {

                            label:
                                "Workout Duration (minutes)",


                            data:
                                chartWorkoutData,


                            borderWidth:
                                1

                        }

                    ]

                },


                options: {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    scales: {

                        y: {

                            beginAtZero:
                                true,


                            title: {

                                display:
                                    true,


                                text:
                                    "Minutes"

                            }

                        },


                        x: {

                            title: {

                                display:
                                    true,


                                text:
                                    "Date"

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            display:
                                true

                        }

                    }

                }

            }
        );


        console.log(
            "Weekly progress loaded successfully!"
        );


        console.log(
            "Weekly totals:",
            {
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
            "Error loading progress:",
            error
        );


        progressSummary.textContent =
            "Unable to load progress data.";


        progressSummary.style.color =
            "red";

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
// START PROGRESS PAGE
// =====================================

firebase.auth().onAuthStateChanged(
    function (user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "Loading progress for:",
            user.email
        );


        loadProgress(
            user.uid
        );

    }
);