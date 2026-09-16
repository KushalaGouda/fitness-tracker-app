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

const periodSelector =
    document.getElementById("periodSelector");

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


    // =====================================
    // THIS WEEK
    // =====================================

    if (
        period === "thisWeek"
    ) {

        startDate.setDate(
            today.getDate() - 6
        );

    }


    // =====================================
    // PREVIOUS WEEK
    // =====================================

    else if (
        period === "previousWeek"
    ) {

        endDate.setDate(
            today.getDate() - 7
        );

        startDate.setDate(
            today.getDate() - 13
        );

    }


    // =====================================
    // THIS MONTH
    // =====================================

    else if (
        period === "thisMonth"
    ) {

        startDate =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

    }


    // =====================================
    // PREVIOUS MONTH
    // =====================================

    else if (
        period === "previousMonth"
    ) {

        startDate =
            new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );

        endDate =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

    }


    // =====================================
    // LAST 3 MONTHS
    // =====================================

    else if (
        period === "last3Months"
    ) {

        startDate =
            new Date(
                today.getFullYear(),
                today.getMonth() - 2,
                1
            );

    }


    // =====================================
    // LAST 6 MONTHS
    // =====================================

    else if (
        period === "last6Months"
    ) {

        startDate =
            new Date(
                today.getFullYear(),
                today.getMonth() - 5,
                1
            );

    }


    // =====================================
    // THIS YEAR
    // =====================================

    else if (
        period === "thisYear"
    ) {

        startDate =
            new Date(
                today.getFullYear(),
                0,
                1
            );

    }


    // =====================================
    // PREVIOUS YEAR
    // =====================================

    else if (
        period === "previousYear"
    ) {

        startDate =
            new Date(
                today.getFullYear() - 1,
                0,
                1
            );

        endDate =
            new Date(
                today.getFullYear() - 1,
                11,
                31
            );

    }


    // =====================================
    // ALL TIME
    // =====================================

    else if (
        period === "allTime"
    ) {

        return {
            startDate: null,
            endDate: null
        };

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
// FORMAT DATE
// =====================================

function formatDisplayDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =====================================
// GET PERIOD NAME
// =====================================

function getPeriodName(period) {

    switch (period) {

        case "thisWeek":
            return "This Week";

        case "previousWeek":
            return "Previous Week";

        case "thisMonth":
            return "This Month";

        case "previousMonth":
            return "Previous Month";

        case "last3Months":
            return "Last 3 Months";

        case "last6Months":
            return "Last 6 Months";

        case "thisYear":
            return "This Year";

        case "previousYear":
            return "Previous Year";

        case "allTime":
            return "All Time";

        default:
            return "This Week";

    }

}


// =====================================
// CREATE DATE LIST
// =====================================

function createDateList(
    startDateString,
    endDateString
) {

    const dates = [];


    if (
        !startDateString ||
        !endDateString
    ) {

        return dates;

    }


    let currentDate =
        new Date(
            startDateString +
            "T00:00:00"
        );


    const endDate =
        new Date(
            endDateString +
            "T00:00:00"
        );


    while (
        currentDate <= endDate
    ) {

        dates.push(
            getDateString(
                currentDate
            )
        );


        currentDate.setDate(
            currentDate.getDate() + 1
        );

    }


    return dates;

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
        // GET DATE RANGE
        // =====================================

        const dateRange =
            getDateRange(
                period
            );


        const startDateString =
            dateRange.startDate;

        const endDateString =
            dateRange.endDate;


        const periodName =
            getPeriodName(
                period
            );


        console.log(
            "Selected period:",
            periodName,
            startDateString,
            endDateString
        );


        // =====================================
        // PAGE DESCRIPTION
        // =====================================

        if (
            period === "allTime"
        ) {

            progressPeriodText.textContent =
                "Track all your recorded fitness activities.";

        } else {

            progressPeriodText.textContent =
                `Track your fitness performance from ${formatDisplayDate(startDateString)} to ${formatDisplayDate(endDateString)}.`;

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


        // =====================================
        // GET USER ACTIVITIES
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
        // DAILY DATA
        // =====================================

        const dailyWorkout = {};

        const selectedDays =
            createDateList(
                startDateString,
                endDateString
            );


        selectedDays.forEach(
            function (date) {

                dailyWorkout[date] =
                    0;

            }
        );


        // =====================================
        // PROCESS ACTIVITIES
        // =====================================

        snapshot.forEach(
            function (doc) {

                const activity =
                    doc.data();


                const activityDate =
                    activity.date;


                let includeActivity =
                    false;


                // =================================
                // ALL TIME
                // =================================

                if (
                    period === "allTime"
                ) {

                    includeActivity =
                        true;

                }


                // =================================
                // DATE RANGE
                // =================================

                else if (
                    activityDate >=
                    startDateString &&

                    activityDate <=
                    endDateString
                ) {

                    includeActivity =
                        true;

                }


                // =================================
                // ADD DATA
                // =================================

                if (
                    includeActivity
                ) {

                    activityCount++;


                    totalSteps +=
                        Number(
                            activity.steps
                        ) ||
                        0;


                    totalCalories +=
                        Number(
                            activity.calories
                        ) ||
                        0;


                    totalWorkout +=
                        Number(
                            activity.duration
                        ) ||
                        0;


                    totalWater +=
                        Number(
                            activity.water
                        ) ||
                        0;


                    // Daily workout

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
        // GOAL PERCENTAGES
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


        Object.keys(
            dailyWorkout
        ).forEach(
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
                    for ${periodName.toLowerCase()}.

                </p>


                <p>

                    Add fitness activities to see
                    your progress here! 💪

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
                    for ${periodName.toLowerCase()}.

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
        // CREATE CHART
        // =====================================

        let chartLabels = [];

        let chartWorkoutData = [];


        // =====================================
        // DAILY CHART
        // =====================================

        if (
            period === "thisWeek" ||
            period === "previousWeek" ||
            period === "thisMonth" ||
            period === "previousMonth"
        ) {

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


            chartDescription.textContent =
                "Workout duration for each day of the selected period.";

        }


        // =====================================
        // MONTHLY CHART
        // =====================================

        else if (
            period === "last3Months" ||
            period === "last6Months" ||
            period === "thisYear" ||
            period === "previousYear"
        ) {

            const monthlyWorkout = {};

            const monthlyLabels = {};


            snapshot.forEach(
                function (doc) {

                    const activity =
                        doc.data();


                    const activityDate =
                        activity.date;


                    let includeActivity =
                        false;


                    if (
                        period === "previousYear"
                    ) {

                        includeActivity =
                            activityDate >=
                            startDateString &&
                            activityDate <=
                            endDateString;

                    } else {

                        includeActivity =
                            activityDate >=
                            startDateString &&
                            activityDate <=
                            endDateString;

                    }


                    if (
                        includeActivity
                    ) {

                        const monthKey =
                            activityDate.substring(
                                0,
                                7
                            );


                        if (
                            !monthlyWorkout[
                                monthKey
                            ]
                        ) {

                            monthlyWorkout[
                                monthKey
                            ] = 0;

                        }


                        monthlyWorkout[
                            monthKey
                        ] +=
                            Number(
                                activity.duration
                            ) ||
                            0;

                    }

                }
            );


            const startMonth =
                new Date(
                    startDateString +
                    "T00:00:00"
                );


            const endMonth =
                new Date(
                    endDateString +
                    "T00:00:00"
                );


            let currentMonth =
                new Date(
                    startMonth.getFullYear(),
                    startMonth.getMonth(),
                    1
                );


            while (
                currentMonth <= endMonth
            ) {

                const monthKey =
                    `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;


                const monthLabel =
                    currentMonth.toLocaleString(
                        "en-US",
                        {
                            month:
                                "short",
                            year:
                                "numeric"
                        }
                    );


                chartLabels.push(
                    monthLabel
                );


                chartWorkoutData.push(
                    monthlyWorkout[
                        monthKey
                    ] ||
                    0
                );


                currentMonth.setMonth(
                    currentMonth.getMonth() + 1
                );

            }


            chartDescription.textContent =
                "Total workout duration for each month.";

        }


        // =====================================
        // ALL TIME CHART
        // =====================================

        else if (
            period === "allTime"
        ) {

            const monthlyWorkout = {};


            snapshot.forEach(
                function (doc) {

                    const activity =
                        doc.data();


                    const activityDate =
                        activity.date;


                    if (
                        activityDate
                    ) {

                        const monthKey =
                            activityDate.substring(
                                0,
                                7
                            );


                        if (
                            !monthlyWorkout[
                                monthKey
                            ]
                        ) {

                            monthlyWorkout[
                                monthKey
                            ] = 0;

                        }


                        monthlyWorkout[
                            monthKey
                        ] +=
                            Number(
                                activity.duration
                            ) ||
                            0;

                    }

                }
            );


            const monthKeys =
                Object.keys(
                    monthlyWorkout
                ).sort();


            monthKeys.forEach(
                function (monthKey) {

                    const parts =
                        monthKey.split(
                            "-"
                        );


                    const date =
                        new Date(
                            Number(parts[0]),
                            Number(parts[1]) - 1,
                            1
                        );


                    const label =
                        date.toLocaleString(
                            "en-US",
                            {
                                month:
                                    "short",
                                year:
                                    "numeric"
                            }
                        );


                    chartLabels.push(
                        label
                    );


                    chartWorkoutData.push(
                        monthlyWorkout[
                            monthKey
                        ]
                    );

                }
            );


            chartDescription.textContent =
                "Total workout duration for each month.";

        }


        // =====================================
        // CREATE / UPDATE CHART
        // =====================================

        const chartCanvas =
            document.getElementById(
                "workoutChart"
            );


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
                                        "Date / Month"

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
        // SUCCESS LOG
        // =====================================

        console.log(
            "Progress loaded successfully!"
        );


        console.log(
            "Period totals:",
            {
                period:
                    periodName,

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
// PERIOD SELECTOR
// =====================================

periodSelector.addEventListener(
    "change",
    function () {

        const user =
            firebase
                .auth()
                .currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        const selectedPeriod =
            periodSelector.value;


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


        // Default selection

        periodSelector.value =
            "thisWeek";


        loadProgress(
            user.uid,
            "thisWeek"
        );

    }
);
