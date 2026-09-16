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

const weekSelector =
    document.getElementById("weekSelector");

const progressPeriodText =
    document.getElementById("progressPeriodText");

const chartDescription =
    document.getElementById("chartDescription");


// =====================================
// CHART VARIABLE
// =====================================

let workoutChart = null;


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
// GET DATE RANGE
// =====================================

function getDateRange(period) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    let startDate =
        new Date(today);

    let endDate =
        new Date(today);


    // =================================
    // THIS WEEK
    // =================================

    if (period === "current") {

        // Last 7 days including today

        startDate.setDate(
            today.getDate() - 6
        );

    }


    // =================================
    // PREVIOUS WEEK
    // =================================

    else {

        // Previous 7 days

        endDate.setDate(
            today.getDate() - 7
        );

        startDate.setDate(
            today.getDate() - 13
        );

    }


    return {

        startDate:
            getDateString(
                startDate
            ),

        endDate:
            getDateString(
                endDate
            )

    };

}


// =====================================
// FORMAT DISPLAY DATE
// =====================================

function formatDisplayDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}


// =====================================
// LOAD PROFILE GOALS + ACTIVITIES
// =====================================

async function loadProgress(
    userId,
    period
) {

    try {

        // =====================================
        // GET SELECTED DATE RANGE
        // =====================================

        const dateRange =
            getDateRange(
                period
            );


        const startDateString =
            dateRange.startDate;

        const endDateString =
            dateRange.endDate;


        console.log(
            "Selected period:",
            startDateString,
            "to",
            endDateString
        );


        // =====================================
        // UPDATE PAGE TEXT
        // =====================================

        if (
            period === "current"
        ) {

            progressPeriodText.textContent =
                `Track your fitness performance from ${formatDisplayDate(startDateString)} to ${formatDisplayDate(endDateString)}.`;

            chartDescription.textContent =
                "Your workout duration for each day of this week.";

        } else {

            progressPeriodText.textContent =
                `Track your fitness performance from ${formatDisplayDate(startDateString)} to ${formatDisplayDate(endDateString)}.`;

            chartDescription.textContent =
                "Your workout duration for each day of the previous week.";

        }


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
        // CREATE SELECTED 7-DAY DATA
        // =====================================

        const selectedDays = [];

        const dailyWorkout = {};


        const startDate =
            new Date(
                startDateString +
                "T00:00:00"
            );


        // Create all 7 days

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
                startDate.getDate() +
                i
            );


            const dateString =
                getDateString(
                    date
                );


            selectedDays.push(
                dateString
            );


            dailyWorkout[
                dateString
            ] = 0;

        }


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

        let activityCount =
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


                // Only selected period

                if (
                    activityDate >=
                    startDateString &&

                    activityDate <=
                    endDateString
                ) {

                    activityCount++;


                    // =========================
                    // STEPS
                    // =========================

                    totalSteps +=
                        Number(
                            activity.steps
                        ) ||
                        0;


                    // =========================
                    // CALORIES
                    // =========================

                    totalCalories +=
                        Number(
                            activity.calories
                        ) ||
                        0;


                    // =========================
                    // WORKOUT
                    // =========================

                    totalWorkout +=
                        Number(
                            activity.duration
                        ) ||
                        0;


                    // =========================
                    // WATER
                    // =========================

                    totalWater +=
                        Number(
                            activity.water
                        ) ||
                        0;


                    // =========================
                    // DAILY WORKOUT
                    // =========================

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


        selectedDays.forEach(
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
            activityCount === 0
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
                    for this period.

                </p>


                <p>

                    Start exercising and your
                    progress will appear here! 💪

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
                        ${activityCount}
                    </strong>
                    activity record(s)
                    during this period.

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


        selectedDays.forEach(
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
        // CREATE / UPDATE WORKOUT CHART
        // =====================================

        const chartCanvas =
            document.getElementById(
                "workoutChart"
            );


        // Destroy old chart

        if (
            workoutChart !== null
        ) {

            workoutChart.destroy();

        }


        workoutChart =
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


        // =====================================
        // LOG SUCCESS
        // =====================================

        console.log(
            "Progress loaded successfully!"
        );


        console.log(
            "Selected period:",
            startDateString,
            "to",
            endDateString
        );


        console.log(
            "Period totals:",
            {
                steps:
                    totalSteps,

                calories:
                    totalCalories,

                workout:
                    totalWorkout,

                water:
                    totalWater,

                activities:
                    activityCount
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
// WEEK SELECTOR
// =====================================

weekSelector.addEventListener(
    "change",
    function () {

        const selectedPeriod =
            weekSelector.value;


        firebase
            .auth()
            .currentUser;


        const user =
            firebase
                .auth()
                .currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        // Load selected week

        loadProgress(
            user.uid,
            selectedPeriod
        );

    }
);


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


        // Default = This Week

        loadProgress(
            user.uid,
            "current"
        );

    }
);
