// Get  the month and date
const today = new Date();
const month = today.toLocaleDateString("en-US", { month: "long" });
const day = today.toLocaleDateString("en-US", { day: "numeric" });

const Tasks = [];
const Hobbies = [
  {
    frequency: 2,
    importance: "high",
    text: "Readings",
    numberThisWeek: 0,
    lastDate: null,
  },
];

//Display it
document.querySelector(".time").textContent = `${month}, ${day}`;

fetch("../firebaseConfig.json")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();

    // Load user data and display on the dashboard
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        database
          .ref("users/" + userId)
          .once("value")
          .then((snapshot) => {
            const userData = snapshot.val();
            document.getElementById(
              "name"
            ).innerText = `${userData.name} ${userData.surname}`;

            loadUserData(userId);

            generateTimetable();
          });
      } else {
        // If user is not logged in, redirect to login page
        window.location.href = "../index.html";
      }
    });

    function loadUserData(userId) {
      // Load and display hobbies
      database.ref("users/" + userId + "/hobbies").on("value", (snapshot) => {
        const hobbies = snapshot.val();
        const hobbyList = document.querySelector(".messages");
        //hobbyList.innerHTML = '';
        if (hobbies) {
          Object.keys(hobbies).forEach((key) => {
            const hobby = hobbies[key];
            const div = document.createElement("div");
            div.className = "list-item";
            div.innerHTML = `${hobby.text} (Importance: ${
              hobby.importance
            }, Frequency: ${
              hobby.frequency
            }) <button class="edit" onclick="editItem('hobbies', '${key}', '${JSON.stringify(
              hobby
            )}')">Edit</button> <button onclick="deleteItem('hobbies', '${key}')">Delete</button>`;
            hobbyList.appendChild(div);

            // Declare a new task
            const newHobby = {
              text: hobby.text,
              frequency: hobby.frequency,
              importance: hobby.importance,
              numberThisWeek: 3,
              lastDate: null,
            };

            // Add the new task to the tasks array
            Hobbies.push(newHobby);
            generateTimetable();
            console.log(Hobbies);
          });
        }
      });

      database
        .ref("users/" + userId + "/obligations")
        .on("value", (snapshot) => {
          const obligations = snapshot.val();
          const hobbyList = document.querySelector(".messages");
          //hobbyList.innerHTML = '';
          if (obligations) {
            Object.keys(obligations).forEach((key) => {
              const obligation = obligations[key];
              const div = document.createElement("div");
              div.className = "list-item";
              div.innerHTML = `${obligation.text} (Importance: ${
                obligation.importance
              }, Frequency: ${
                obligation.frequency
              }) <button class="edit" onclick="editItem('hobbies', '${key}', '${JSON.stringify(
                hobby
              )}')">Edit</button> <button onclick="deleteItem('hobbies', '${key}')">Delete</button>`;
              hobbyList.appendChild(div);
            });
          }
        });

      // Load and display tasks
      database.ref("users/" + userId + "/tasks").on("value", (snapshot) => {
        const tasks = snapshot.val();
        const totalTasks = tasks ? Object.keys(tasks).length : 0;
        document.querySelector(".total-tasks").textContent = totalTasks;
        const taskList = document.querySelector(".project-boxes");
        taskList.innerHTML = "";
        Tasks.length = 0;
        if (tasks) {
          Object.keys(tasks).forEach((key) => {
            const task = tasks[key];
            // Create the main wrapper div
            const projectBoxWrapper = document.createElement("div");
            projectBoxWrapper.className = "project-box-wrapper";

            // Create the project box div
            const projectBox = document.createElement("div");
            projectBox.className = "project-box";
            projectBox.style.backgroundColor = "#d5deff";

            // Create the project box header div
            const projectBoxHeader = document.createElement("div");
            projectBoxHeader.className = "project-box-header";

            // Add the date span
            const dateSpan = document.createElement("span");
            dateSpan.textContent = task.startTime;

            // Create the more wrapper div
            const moreWrapper = document.createElement("div");
            moreWrapper.className = "more-wrapper";

            // Create the button with the more icon
            const moreButton = document.createElement("button");
            moreButton.className = "project-btn-more";

            const moreIcon = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            moreIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            moreIcon.setAttribute("width", "24");
            moreIcon.setAttribute("height", "24");
            moreIcon.setAttribute("viewBox", "0 0 24 24");
            moreIcon.setAttribute("fill", "none");
            moreIcon.setAttribute("stroke", "currentColor");
            moreIcon.setAttribute("stroke-width", "2");
            moreIcon.setAttribute("stroke-linecap", "round");
            moreIcon.setAttribute("stroke-linejoin", "round");
            moreIcon.classList.add("feather", "feather-more-vertical");

            const circles = [5, 12, 19].map((cy) => {
              const circle = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
              );
              circle.setAttribute("cx", "12");
              circle.setAttribute("cy", cy.toString());
              circle.setAttribute("r", "1");
              return circle;
            });
            circles.forEach((circle) => moreIcon.appendChild(circle));

            moreButton.appendChild(moreIcon);
            moreWrapper.appendChild(moreButton);

            const moreOptions = document.createElement("div");
            moreOptions.className = "more-options";
            moreOptions.style.display = "none";

            const editButton = document.createElement("button");
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {
              editItem("tasks", key, JSON.stringify(task));
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
              deleteItem("tasks", key);
            });

            moreOptions.appendChild(editButton);
            moreOptions.appendChild(deleteButton);
            moreWrapper.appendChild(moreOptions);

            // Append date and more wrapper to the header
            projectBoxHeader.appendChild(dateSpan);
            projectBoxHeader.appendChild(moreWrapper);

            // Create the project box content header
            const projectBoxContentHeader = document.createElement("div");
            projectBoxContentHeader.className = "project-box-content-header";

            const boxContentHeader = document.createElement("p");
            boxContentHeader.className = "box-content-header";
            boxContentHeader.textContent = task.text;

            const boxContentSubheader = document.createElement("p");
            boxContentSubheader.className = "box-content-subheader";
            boxContentSubheader.textContent = task.priority;

            projectBoxContentHeader.appendChild(boxContentHeader);
            projectBoxContentHeader.appendChild(boxContentSubheader);

            // Create the progress wrapper
            const boxProgressWrapper = document.createElement("div");
            boxProgressWrapper.className = "box-progress-wrapper";

            const boxProgressHeader = document.createElement("p");
            boxProgressHeader.className = "box-progress-header";
            boxProgressHeader.textContent = "Progress";

            const boxProgressBar = document.createElement("div");
            boxProgressBar.className = "box-progress-bar";

            const boxProgress = document.createElement("span");
            boxProgress.className = "box-progress";
            boxProgress.style.width = task.progress;
            boxProgress.style.backgroundColor = "#4067f9";

            boxProgressBar.appendChild(boxProgress);

            const boxProgressPercentage = document.createElement("p");
            boxProgressPercentage.className = "box-progress-percentage";
            boxProgressPercentage.textContent = `${task.progress}%`;

            boxProgressWrapper.appendChild(boxProgressHeader);
            boxProgressWrapper.appendChild(boxProgressBar);
            boxProgressWrapper.appendChild(boxProgressPercentage);

            // Create the project box footer
            const projectBoxFooter = document.createElement("div");
            projectBoxFooter.className = "project-box-footer";

            // Create participants div
            const participants = document.createElement("div");
            participants.className = "participants";

            const participant1 = document.createElement("img");
            participant1.src =
              "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2550&amp;q=80";
            participant1.alt = "participant";

            const participant2 = document.createElement("img");
            participant2.src =
              "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2555&amp;q=80";
            participant2.alt = "participant";

            const addParticipantButton = document.createElement("button");
            addParticipantButton.className = "add-participant";
            addParticipantButton.style.color = "#4067f9";

            const addParticipantIcon = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            addParticipantIcon.setAttribute(
              "xmlns",
              "http://www.w3.org/2000/svg"
            );
            addParticipantIcon.setAttribute("width", "12");
            addParticipantIcon.setAttribute("height", "12");
            addParticipantIcon.setAttribute("viewBox", "0 0 24 24");
            addParticipantIcon.setAttribute("fill", "none");
            addParticipantIcon.setAttribute("stroke", "currentColor");
            addParticipantIcon.setAttribute("stroke-width", "3");
            addParticipantIcon.setAttribute("stroke-linecap", "round");
            addParticipantIcon.setAttribute("stroke-linejoin", "round");
            addParticipantIcon.classList.add("feather", "feather-plus");

            const addParticipantPath1 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            addParticipantPath1.setAttribute("d", "M12 5v14");
            const addParticipantPath2 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            addParticipantPath2.setAttribute("d", "M5 12h14");

            addParticipantIcon.appendChild(addParticipantPath1);
            addParticipantIcon.appendChild(addParticipantPath2);

            addParticipantButton.appendChild(addParticipantIcon);

            participants.appendChild(participant1);
            participants.appendChild(participant2);
            participants.appendChild(addParticipantButton);

            // Create days left div
            const daysLeft = document.createElement("div");
            daysLeft.className = "days-left";
            daysLeft.style.color = "#4067f9";
            var numDaysLeft = calculateDaysLeft(task.deadline);
            if (numDaysLeft <= 2) {
              daysLeft.style.color = "#ef0000";
            }
            daysLeft.textContent = `${calculateDaysLeft(
              task.deadline
            )} Days Left`;

            // Append participants and days left to the footer
            projectBoxFooter.appendChild(participants);
            projectBoxFooter.appendChild(daysLeft);

            // Assemble the project box
            projectBox.appendChild(projectBoxHeader);
            projectBox.appendChild(projectBoxContentHeader);
            projectBox.appendChild(boxProgressWrapper);
            projectBox.appendChild(projectBoxFooter);

            // Append the project box to the wrapper
            projectBoxWrapper.appendChild(projectBox);

            taskList.appendChild(projectBoxWrapper);

            updateMoreOptions();

            // Declare a new task
            const newTask = {
              text: task.text,
              type: taskList.type,
              completed: task.completed,
              deadline: task.deadline,
              priority: task.priority,
              progress: task.progress,
              startTime: task.startTime,
            };

            // Add the new task to the tasks array
            Tasks.push(newTask);
            generateTimetable();
          });
        }
      });
    }

    function calculateDaysLeft(targetDateStr) {
      // Convert the target date string to a Date object
      const targetDate = new Date(targetDateStr);

      // Get the current date
      const currentDate = new Date();

      // Calculate the difference in time (in milliseconds)
      const differenceInTime = targetDate - currentDate;

      // Convert the difference in time to days
      const daysLeft = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

      return daysLeft;
    }

    function editItem(type, key, value) {
      const newValue = prompt("Edit item:", value);
      if (newValue !== null) {
        const userId = auth.currentUser.uid;
        database
          .ref("users/" + userId + "/" + type + "/" + key)
          .set(JSON.parse(newValue));
      }
    }

    function deleteItem(type, key) {
      const userId = auth.currentUser.uid;
      database.ref("users/" + userId + "/" + type + "/" + key).remove();
    }
  })
  .catch((error) => {
    console.error("Error loading Firebase configuration:", error);
  });
