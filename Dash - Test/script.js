
fetch("../firebaseConfig.json")
  .then((response) => response.json())
  .then((firebaseConfig) => {
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
            document.getElementById("userName").innerText = userData.name;
            document.getElementById("nameDisplay").innerText = userData.name;
            document.getElementById("surnameDisplay").innerText =
              userData.surname;

            loadUserData(userId);
            loadTodaysSchedule(userId);
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
        const hobbyList = document.getElementById("hobbyList");
        hobbyList.innerHTML = "";
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
          });
        }
      });

      // Load and display tasks
      database.ref("users/" + userId + "/tasks").on("value", (snapshot) => {
        const tasks = snapshot.val();
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";
        if (tasks) {
          Object.keys(tasks).forEach((key) => {
            const task = tasks[key];
            const div = document.createElement("div");
            div.className = "list-item";
            div.innerHTML = `${task.text} (Deadline: ${
              task.deadline
            }, Start Time: ${task.startTime}, Priority: ${
              task.priority
            }, Progress: ${
              task.progress
            }) <button class="edit" onclick="editItem('tasks', '${key}', '${JSON.stringify(
              task
            )}')">Edit</button> <button onclick="deleteItem('tasks', '${key}')">Delete</button>`;
            taskList.appendChild(div);
          });
        }
      });
    }

    function loadTodaysSchedule(userId) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const schedule = document.getElementById("schedule");
      schedule.innerHTML = "";

      database
        .ref("users/" + userId + "/tasks")
        .orderByChild("deadline")
        .equalTo(today)
        .on("value", (snapshot) => {
          const tasks = snapshot.val();
          if (tasks) {
            Object.keys(tasks).forEach((key) => {
              const task = tasks[key];
              const div = document.createElement("div");
              div.className = "schedule-item";
              div.innerText = `${task.text} (Deadline: ${task.deadline}, Start Time: ${task.startTime}, Priority: ${task.priority}, Progress: ${task.progress})`;
              schedule.appendChild(div);
            });
          } else {
            schedule.innerText = "No tasks for today.";
          }
        });
    }

    function addHobby() {
      const text = document.getElementById("hobbyInput").value;
      const importance = document.getElementById("importance").value;
      const frequency = document.getElementById("frequency").value;
      const userId = auth.currentUser.uid;

      if (text && importance && frequency) {
        database.ref("users/" + userId + "/hobbies").push({
          text: text,
          importance: importance,
          frequency: parseInt(frequency, 10),
        });
        document.getElementById("hobbyInput").value = "";
        document.getElementById("importance").value = "";
        document.getElementById("frequency").value = "";
      }
    }

    function addTask() {
      const text = document.getElementById("taskInput").value;
      const startTime = document.getElementById("startTimeInput").value;
      const deadline = document.getElementById("deadlineInput").value;
      const priority = document.getElementById("priority").value;
      const progress = document.getElementById("progressInput").value;
      const userId = auth.currentUser.uid;

      if (text && startTime && deadline && priority && progress) {
        database.ref("users/" + userId + "/tasks").push({
          text: text,
          startTime: startTime,
          deadline: deadline,
          priority: priority,
          progress: progress,
          completed: false,
        });
        document.getElementById("taskInput").value = "";
        document.getElementById("startTimeInput").value = "";
        document.getElementById("deadlineInput").value = "";
        document.getElementById("priority").value = "";
        document.getElementById("progressInput").value = "";
      }
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
