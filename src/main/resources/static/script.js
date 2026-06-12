const API_URL = "http://localhost:8081/tasks";

async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {

    let html = "";

    tasks.forEach((task) => {

        html += `
        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Status: ${task.status}</p>

            <button onclick="completeTask(${task.id})">
                Complete
            </button>

            <button onclick="editTask(${task.id}, \`${task.title}\`, \`${task.description}\`)">
                Edit
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
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
        status: "Pending"
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    loadTasks();
}

async function deleteTask(id) {

    await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });

    loadTasks();
}

async function completeTask(id) {

    await fetch(API_URL + "/" + id + "/complete", {
        method: "PUT"
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
        description: description
    };

    await fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    loadTasks();
}

async function searchTask() {

    const title =
        document.getElementById("searchBox").value;

    console.log("Searching:", title);

    const response =
        await fetch(API_URL + "/search?title=" + title);

    const tasks =
        await response.json();

    console.log(tasks);

    displayTasks(tasks);
} 

loadTasks();

async function filterTasks() {

    const status =
        document.getElementById("statusFilter").value;

    if(status === "All"){
        loadTasks();
        return;
    }

    const response = await fetch(
        API_URL + "/status?status=" + status
    );

    const tasks = await response.json();

    let html = "";

    tasks.forEach((task) => {

        html += `
        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Status: ${task.status}</p>

            <button onclick="completeTask(${task.id})">
                Complete
            </button>

            <button onclick="editTask(${task.id},
            '${task.title}',
            '${task.description}')">
                Edit
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
        </div>
        `;
    });

    document.getElementById("taskList").innerHTML = html;
}