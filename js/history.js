// =====================================
// HISTORY PAGE
// =====================================

console.log(
    "history.js loaded successfully!"
);


// =====================================
// GET ELEMENTS
// =====================================

const historyTableBody =
    document.getElementById(
        "historyTableBody"
    );


const historyMessage =
    document.getElementById(
        "historyMessage"
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


        // Load only this user's activities

        await loadHistory(
            user.uid
        );

    }
);


// =====================================
// LOAD USER ACTIVITIES
// =====================================

async function loadHistory(
    userId
) {

    try {

        // =====================================
        // GET ACTIVITIES
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

        historyTableBody.innerHTML =
            "";


        // =====================================
        // NO ACTIVITIES
        // =====================================

        if (snapshot.empty) {

            historyTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        style="text-align:center;"
                    >

                        No activities recorded yet.

                    </td>

                </tr>

            `;


            historyMessage.textContent =
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
        // DISPLAY ACTIVITIES
        // =====================================

        activities.forEach(
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
                        ${activity.steps || 0}
                    </td>


                    <td>
                        ${activity.calories || 0}
                        kcal
                    </td>


                    <td>
                        ${activity.water || 0}
                        L
                    </td>


                    <td>
                        ${activity.notes || "-"}
                    </td>


                    <td>

                        <button
                            class="edit-button"
                            onclick="editActivity('${activity.id}')"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-button"
                            onclick="deleteActivity('${activity.id}')"
                        >
                            Delete
                        </button>

                    </td>

                `;


                historyTableBody.appendChild(
                    row
                );

            }
        );


        // =====================================
        // MESSAGE
        // =====================================

        historyMessage.textContent =
            `Showing ${activities.length} activity record(s).`;


    } catch (error) {

        console.error(
            "Error loading activities:",
            error
        );


        historyMessage.textContent =
            "Unable to load activities.";

        historyMessage.style.color =
            "red";

    }

}


// =====================================
// DELETE ACTIVITY
// =====================================

async function deleteActivity(
    activityId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this activity?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        // =====================================
        // GET LOGGED-IN USER
        // =====================================

        const user =
            firebase.auth().currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        // =====================================
        // GET ACTIVITY
        // =====================================

        const activityDoc =
            await db
                .collection(
                    "activities"
                )
                .doc(
                    activityId
                )
                .get();


        if (!activityDoc.exists) {

            alert(
                "Activity not found."
            );

            return;

        }


        const activity =
            activityDoc.data();


        // =====================================
        // CHECK OWNERSHIP
        // =====================================

        if (
            activity.userId &&
            activity.userId !== user.uid
        ) {

            alert(
                "You cannot delete another user's activity."
            );

            return;

        }


        // =====================================
        // DELETE
        // =====================================

        await db
            .collection(
                "activities"
            )
            .doc(
                activityId
            )
            .delete();


        alert(
            "Activity deleted successfully!"
        );


        // Reload history

        await loadHistory(
            user.uid
        );


    } catch (error) {

        console.error(
            "Error deleting activity:",
            error
        );


        alert(
            "Unable to delete activity. Please try again."
        );

    }

}


// =====================================
// EDIT ACTIVITY
// =====================================

function editActivity(
    activityId
) {

    console.log(
        "Editing activity:",
        activityId
    );


    window.location.href =
        "add-activity.html?edit=" +
        activityId;

}