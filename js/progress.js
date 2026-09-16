// =====================================
// PROGRESS PAGE
// =====================================

console.log("progress.js loaded successfully!");


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
// DATE HELPERS
// =====================================

function getDateString(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    const date = new Date(
        dateString + "T00:00:00"
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
// GET DATE RANGE
// =====================================

function getDateRange(period) {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    let start;
    let end;


    // THIS WEEK
    if (period === "thisWeek") {

        start = new Date(today);

        start.setDate(
            today.getDate() - 6
        );

        end = new Date(today);

    }


    // PREVIOUS WEEK
    else if (period === "previousWeek") {

        end = new Date(today);

        end.setDate(
            today.getDate() - 7
        );

        start = new Date(end);

        start.setDate(
            end.getDate() - 6
        );

    }


    // THIS MONTH
    else if (period === "thisMonth") {

        start = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        end = new Date(today);

    }


    // PREVIOUS MONTH
    else if (period === "previousMonth") {

        start = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
        );

        end = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );

    }


    // LAST 3 MONTHS
    else if (period === "last3Months") {

        start = new Date(
            today.getFullYear(),
            today.getMonth() - 2,
            1
        );

        end = new Date(today);

    }


    // LAST 6 MONTHS
    else if (period === "last6Months") {

        start = new Date(
            today.getFullYear(),
            today.getMonth() - 5,
            1
        );

        end = new Date(today);

    }


    // THIS YEAR
    else if (period === "thisYear") {

        start = new Date(
            today.getFullYear(),
            0,
            1
        );

        end = new Date(today);

    }


    // PREVIOUS YEAR
    else if (period === "previousYear") {

        start = new Date(
            today.getFullYear() - 1,
            0,
            1
        );

        end = new Date(
            today.getFullYear() - 1,
            11,
            31
        );

    }


    // ALL TIME
    else {

        return {
            start: null,
            end: null
        };

    }


    return {

        start:
            getDateString(start),

        end:
            getDateString(end)

    };

}


// =====================================
// GET PERIOD NAME
// =====================================

function getPeriodName(period) {

    const names = {

        thisWeek: "This Week",

        previousWeek: "Previous Week",

        thisMonth: "This Month",

        previousMonth: "Previous Month",

        last3Months: "Last 3 Months",

        last6Months: "Last 6 Months",

        thisYear: "This Year",

        previousYear: "Previous Year",

        allTime: "All Time"

    };

    return names[period] || "This Week";
}


// =====================================
// CREATE DAILY DATES
// =====================================

function createDates(
    startString,
    endString
) {

    const dates = [];

    if (
        !startString ||
        !endString
    ) {

        return dates;

    }


    let current =
        new Date(
            startString + "T00:00:00"
        );

    const end =
        new Date(
            endString + "T00:00:00"
        );


    while (
        current <= end
    ) {

        dates.push(
            getDateString(current)
        );

        current.setDate(
            current.getDate() + 1
        );

    }


    return dates;
}


// =====================================
// LOAD PROGRESS
// =====================================

async function loadProgress(
    userId,
    period
) {

    console.log(
        "Loading progress...",
        period
    );


    try {

        // =====================================
        // DATE RANGE
        // =====================================

        const range =
            getDateRange(period);

        const periodName =
            getPeriodName(period);


        // =====================================
        // PROFILE
        // =====================================

        let stepGoal = 10000;
        let calorieGoal = 600;
        let workoutGoal = 60;
        let waterGoal = 3;


        const profileSnapshot =
            await db
                .collection("profiles")
                .doc(userId)
                .get();


        if (
            profileSnapshot.exists
        ) {

            const profile =
                profileSnapshot.data();


            stepGoal =
                Number(profile.stepGoal) ||
                10000;

            calorieGoal =
                Number(profile.calorieGoal) ||
                600;

            workoutGoal =
                Number(profile.workoutGoal) ||
                60;

            waterGoal =
                Number(profile.waterGoal) ||
                3;

        }


        // =====================================
        // GET ACTIVITIES
        // =====================================

        const snapshot =
            await db
                .collection("activities")
                .where(
                    "userId",
                    "==",
                    userId
                )
                .get();


        console.log(
            "Activities found:",
            snapshot.size
        );


        // =====================================
        // TOTALS
        // =====================================

        let totalSteps = 0;
        let totalCalories = 0;
        let totalWorkout = 0;
        let totalWater = 0;
        let activityCount = 0;


        // =====================================
        // ACTIVITY ARRAY
        // =====================================

        const activities = [];


        snapshot.forEach(
            function(doc) {

                const activity =
                    doc.data();


                const date =
                    activity.date;


                if (!date) {
                    return;
                }


                // ALL TIME
                if (
                    period === "allTime"
                ) {

                    activities.push(
                        activity
                    );

                    return;

                }


                // SELECTED RANGE
                if (
                    date >= range.start &&
                    date <= range.end
                ) {

                    activities.push(
                        activity
                    );

                }

            }
        );


        // =====================================
        // CALCULATE TOTALS
        // =====================================

        activities.forEach(
            function(activity) {

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


                activityCount++;

            }
        );


        console.log(
            "Total steps:",
            totalSteps
        );

        console.log(
            "Total calories:",
            totalCalories
        );

        console.log(
            "Total workout:",
            totalWorkout
        );

        console.log(
            "Total water:",
            totalWater
        );


        // =====================================
        // DISPLAY TOTALS
        // =====================================

        totalStepsElement.textContent =
            totalSteps.toLocaleString();


        totalCaloriesElement.textContent =
            totalCalories.toLocaleString()
            + " kcal";


        totalWorkoutElement.textContent =
            totalWorkout.toLocaleString()
            + " min";


        totalWaterElement.textContent =
            totalWater.toFixed(1)
            + " L";


        // =====================================
        // PERIOD TEXT
        // =====================================

        if (
            period === "allTime"
        ) {

            progressPeriodText.textContent =
                "Track all your recorded fitness activities.";

        } else {

            progressPeriodText.textContent =
                `Track your fitness performance from ${formatDate(range.start)} to ${formatDate(range.end)}.`;

        }


        // =====================================
        // CHART DATA
        // =====================================

        let labels = [];
        let workoutData = [];


        // =====================================
        // DAILY CHART
        // =====================================

        if (
            period === "thisWeek" ||
            period === "previousWeek" ||
            period === "thisMonth" ||
            period === "previousMonth"
        ) {

            const dates =
                createDates(
                    range.start,
                    range.end
                );


            const dailyWorkout = {};


            dates.forEach(
                function(date) {

                    dailyWorkout[date] = 0;

                }
            );


            activities.forEach(
                function(activity) {

                    if (
                        dailyWorkout[
                            activity.date
                        ] !== undefined
                    ) {

                        dailyWorkout[
                            activity.date
                        ] +=
                            Number(
                                activity.duration
                            ) || 0;

                    }

                }
            );


            dates.forEach(
                function(date) {

                    const dateObject =
                        new Date(
                            date +
                            "T00:00:00"
                        );


                    const label =
                        dateObject.toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric"
                            }
                        );


                    labels.push(
                        label
                    );


                    workoutData.push(
                        dailyWorkout[date]
                    );

                }
            );


            chartDescription.textContent =
                "Workout duration for each day of the selected period.";

        }


        // =====================================
        // MONTHLY CHART
        // =====================================

        else {

            const monthlyWorkout = {};


            activities.forEach(
                function(activity) {

                    const month =
                        activity.date.substring(
                            0,
                            7
                        );


                    if (
                        !monthlyWorkout[month]
                    ) {

                        monthlyWorkout[month] =
                            0;

                    }


                    monthlyWorkout[month] +=
                        Number(
                            activity.duration
                        ) || 0;

                }
            );


            let months =
                Object.keys(
                    monthlyWorkout
                ).sort();


            // For selected multi-month periods,
            // make sure empty months are also shown.

            if (
                period !== "allTime"
            ) {

                const startDate =
                    new Date(
                        range.start +
                        "T00:00:00"
                    );

                const endDate =
                    new Date(
                        range.end +
                        "T00:00:00"
                    );


                let current =
                    new Date(
                        startDate.getFullYear(),
                        startDate.getMonth(),
                        1
                    );


                months = [];


                while (
                    current <= endDate
                ) {

                    const monthKey =
                        `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;


                    months.push(
                        monthKey
                    );


                    current.setMonth(
                        current.getMonth() + 1
                    );

                }

            }


            months.forEach(
                function(monthKey) {

                    const parts =
                        monthKey.split("-");


                    const monthDate =
                        new Date(
                            Number(parts[0]),
                            Number(parts[1]) - 1,
                            1
                        );


                    const label =
                        monthDate.toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                year: "numeric"
                            }
                        );


                    labels.push(
                        label
                    );


                    workoutData.push(
                        monthlyWorkout[
                            monthKey
                        ] || 0
                    );

                }
            );


            chartDescription.textContent =
                "Total workout duration for each month.";

        }


        // =====================================
        // DESTROY OLD CHART
        // =====================================

        if (
            workoutChart
        ) {

            workoutChart.destroy();

            workoutChart = null;

        }


        // =====================================
        // GET CANVAS
        // =====================================

        const canvas =
            document.getElementById(
                "workoutChart"
            );


        if (!canvas) {

            console.error(
                "Workout chart canvas not found!"
            );

            return;

        }


        // =====================================
        // CHECK CHART.JS
        // =====================================

        if (
            typeof Chart === "undefined"
        ) {

            console.error(
                "Chart.js is not loaded!"
            );

            progressSummary.innerHTML =
                "<p style='color:red;'>Chart.js could not be loaded.</p>";

            return;

        }


        // =====================================
        // CREATE CHART
        // =====================================

        workoutChart =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Workout Duration (minutes)",

                                data:
                                    workoutData,

                                borderWidth:
                                    1

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                title: {

                                    display: true,

                                    text: "Minutes"

                                }

                            },

                            x: {

                                title: {

                                    display: true,

                                    text: "Date / Month"

                                }

                            }

                        }

                    }

                }
            );


        // =====================================
        // PROGRESS SUMMARY
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


        if (
            activityCount === 0
        ) {

            progressSummary.innerHTML = `

                <p>
                    No fitness activities recorded
                    for ${periodName.toLowerCase()}.
                </p>

                <p>
                    Add an activity to see your
                    progress here! 💪
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


                <p>

                    You recorded
                    <strong>
                        ${activityCount}
                    </strong>
                    activity record(s)
                    for ${periodName.toLowerCase()}.

                </p>

            `;

        }


        console.log(
            "Progress loaded successfully!"
        );

    }


    catch (error) {

        console.error(
            "Progress loading error:",
            error
        );


        progressSummary.innerHTML = `

            <p style="color:red;">
                Unable to load progress data.
            </p>

            <p>
                Please check the browser console
                for the error.
            </p>

        `;

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
        !goal ||
        goal <= 0
    ) {

        return 0;

    }


    return Math.min(
        Math.round(
            (value / goal) * 100
        ),
        100
    );

}


// =====================================
// PERIOD CHANGE
// =====================================

periodSelector.addEventListener(
    "change",
    function() {

        const user =
            firebase
                .auth()
                .currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        loadProgress(
            user.uid,
            periodSelector.value
        );

    }
);


// =====================================
// AUTH CHECK
// =====================================

firebase
    .auth()
    .onAuthStateChanged(
        function(user) {

            if (!user) {

                window.location.href =
                    "login.html";

                return;

            }


            console.log(
                "Logged in user:",
                user.email
            );


            periodSelector.value =
                "thisWeek";


            loadProgress(
                user.uid,
                "thisWeek"
            );

        }
    );
