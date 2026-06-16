// ==========================================
// AUTHENTICATION
// ==========================================

const currentUser = localStorage.getItem("currentUser");
const token = localStorage.getItem("token");

if (
    window.location.pathname.includes("dashboard.html")
    && (!currentUser || !token)
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
      tasks = tasks.filter(task => task.userEmail === currentUser);
  }

  displayTasks(tasks);
}

function displayTasks(tasks) {
  let html = "";

  tasks.forEach((task) => {
    // Note: I cleaned up the HTML structure here so it matches the perfect 
    // CSS grid alignment we set up in styles.css earlier!
    html += `
        <div>
            <span title="${task.title}"><b>${task.title}</b></span>
            <span title="${task.description}">${task.description}</span>
            <span>Status: ${task.status}</span>
            
            <button class="complete" onclick="completeTask(${task.id})">Complete</button>
            <button class="edit" onclick="editTask(${task.id}, '${task.title}', '${task.description}')">Edit</button>
            <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
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
    userEmail: currentUser // <-- CRITICAL: Tell the backend whose task this is!
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
    userEmail: currentUser // Keep the ownership when updating
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
      tasks = tasks.filter(task => task.userEmail === currentUser);
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
      tasks = tasks.filter(task => task.userEmail === currentUser);
  }

  displayTasks(tasks);
}

// Initial load
loadTasks();