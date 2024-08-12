function generateTimetable() {
    const timetable = document.getElementById("timetable");
    timetable.innerHTML = ""
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay(); // Get the start of the week (Sunday)
    const weekStartDate = new Date(today.setDate(startOfWeek));
    const weekStartISO = weekStartDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Create an array for 24 hours
    const hours = Array(24).fill(null);

    // Assign tasks and obligations to specific hours
    Tasks.forEach(task => {
        console.log(task)
        if (task.completed == false) {
            // The input string
            const dateTimeStr = task.startTime;

            // Extract the date and time parts
            const [datePart, timePart] = dateTimeStr.split('T');

            // Convert the extracted date to a Date object
            const dateObj = new Date(datePart);

            // Get today's date in the same format
            const today = new Date();
            const todayDateStr = today.toISOString().split('T')[0];

            // Check if the extracted date is today
            if (datePart === todayDateStr) {
                // Extract the hour from the time part
                const hour = parseInt(timePart.split(':')[0], 10);
                console.log("Hour:", hour); // Outputs the hour if the date is today
                hours[hour] = task;
            } else {
                console.log("The date is not today.");
            }

        }
    });

    // Assign hobbies to free hours based on importance and frequency
    Hobbies.forEach(hobby => {
        let assignedCount = 0;
        for (let i = 0; i < hours.length; i++) {
            if (hours[i] === null && hobby.importance === "high" && assignedCount < hobby.frequency) {
                hours[i] = { text: hobby.text, type: "hobby", importance: hobby.importance, frequency: hobby.frequency };
                assignedCount++;
                hobby.numberThisWeek++;
                hobby.lastDate = weekStartISO; // Update lastDate to the start of the current week
            }
        }
    });

    // Generate the timetable UI
    hours.forEach((activity, hour) => {
        const hourBlock = document.createElement("div");
        hourBlock.className = "hour-block";

        const hourLabel = document.createElement("div");
        hourLabel.className = "hour";
        hourLabel.textContent = `${String(hour).padStart(2, "0")}:00`;

        const activityLabel = document.createElement("div");
        activityLabel.className = "activity";
        activityLabel.textContent = activity ? activity.text : "";

        hourBlock.appendChild(hourLabel);
        hourBlock.appendChild(activityLabel);

        // Display additional activity details
        if (activity && activity.type !== "hobby") {
            const activityDetails = document.createElement("div");
            activityDetails.className = "activity-details";
            activityDetails.innerHTML = `
                <div>Priority: ${activity.priority}</div>
                <div>Progress: ${activity.progress}%</div>
                <div>Deadline: ${activity.deadline}</div>
                <div>Completed: ${activity.completed ? "Yes" : "No"}</div>
            `;
            hourBlock.appendChild(activityDetails);
        } else if (activity && activity.type === "hobby") {
            const activityDetails = document.createElement("div");
            activityDetails.className = "activity-details";
            const hobby = Hobbies.find(h => h.text === activity.text); // Find the hobby object
            activityDetails.innerHTML = `
                <div>Importance: ${activity.importance}</div>
                <div>Frequency: ${hobby.frequency}</div>
                <div>Number This Week: ${hobby.numberThisWeek}</div>
                <div>Last Date: ${hobby.lastDate}</div>
            `;
            hourBlock.appendChild(activityDetails);
        }

        timetable.appendChild(hourBlock);
    });
}

