// ==========================================
// AUTHENTICATION
// ==========================================

const currentUser = localStorage.getItem("currentUser");
const token = localStorage.getItem("token");

if (
  window.location.pathname.includes("dashboard.html") &&
  (!currentUser || !token)
) {
  window.location.href = "login.html";
}

if (currentUser && document.getElementById("userNameDisplay")) {
  document.getElementById("userNameDisplay").innerText =
    currentUser.split("@")[0];
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");

  window.location.href = "login.html";
}

// ==========================================
// 2. TASK MANAGEMENT API LOGIC
// ==========================================
const API_URL = "http://localhost:8081/tasks";

async function loadTasks() {
  const response = await fetch(API_URL);
  let tasks = await response.json();

  // FRONTEND FILTER: Only show tasks that belong to the logged-in user
  if (currentUser) {
    tasks = tasks.filter((task) => task.userEmail === currentUser);
  }

  displayTasks(tasks);
}

function displayTasks(tasks) {
  let html = "";

  const today = new Date();

  tasks.forEach((task) => {
    // Safely determine priority class (fallback to "low")
    const priorityClass = task.priority ? task.priority.toLowerCase() : "low";

    const overdue =
      task.dueDate &&
      new Date(task.dueDate) < today &&
      task.status !== "Completed";

    html += `
<div class="task-card ${overdue ? "overdue" : ""}">

    <div class="task-header">
        <h3>${task.title}</h3>
        <span class="priority-badge ${priorityClass}">
    ${task.priority}
</span>
    ${overdue ? '<span class="overdue-badge">⚠ Overdue</span>' : ""}
    </div>

    <p>${task.description}</p>

    <div class="task-info">
        <span>📅 ${task.dueDate || "No Due Date"}</span>
        <span>📌 ${task.status}</span>
    </div>

    <div class="task-actions">
        <button class="complete" onclick="completeTask(${task.id})">
            Complete
        </button>

        <button class="edit" onclick="editTask(${task.id}, '${task.title}', '${task.description}')">
            Edit
        </button>

        <button class="delete" onclick="deleteTask(${task.id})">
            Delete
        </button>
    </div>

</div>
`;
  });

  document.getElementById("taskList").innerHTML = html;
}
async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const task = {
    title: title,
    description: description,
    status: "Pending",
    priority: document.getElementById("priority").value,
    dueDate: document.getElementById("dueDate").value,
    userEmail: currentUser,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";

  loadTasks();
}

async function deleteTask(id) {
  await fetch(API_URL + "/" + id, {
    method: "DELETE",
  });
  loadTasks();
}

async function completeTask(id) {
  await fetch(API_URL + "/" + id + "/complete", {
    method: "PUT",
  });
  loadTasks();
}

async function editTask(id, oldTitle, oldDescription) {
  const title = prompt("Edit Title", oldTitle);
  if (title === null) return;

  const description = prompt("Edit Description", oldDescription);
  if (description === null) return;

  const task = {
    title: title,
    description: description,
    userEmail: currentUser, // Keep the ownership when updating
  };

  await fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  loadTasks();
}

async function searchTask() {
  const title = document.getElementById("searchBox").value;
  const response = await fetch(API_URL + "/search?title=" + title);
  let tasks = await response.json();

  // Filter search results for current user only
  if (currentUser) {
    tasks = tasks.filter((task) => task.userEmail === currentUser);
  }

  displayTasks(tasks);
}

async function filterTasks() {
  const status = document.getElementById("statusFilter").value;

  if (status === "All") {
    loadTasks();
    return;
  }

  const response = await fetch(API_URL + "/status?status=" + status);
  let tasks = await response.json();

  // Filter status results for current user only
  if (currentUser) {
    tasks = tasks.filter((task) => task.userEmail === currentUser);
  }

  displayTasks(tasks);
}

async function loadStats() {
  const response = await fetch(
    "http://localhost:8081/tasks/stats?userEmail=" + currentUser,
  );
  const stats = await response.json();

  document.getElementById("totalTasks").innerText = stats.total;

  document.getElementById("completedTasks").innerText = stats.completed;

  document.getElementById("pendingTasks").innerText = stats.pending;
}

// Initial load
loadTasks();
loadStats();
