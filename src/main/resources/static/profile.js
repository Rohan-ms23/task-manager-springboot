const currentUser =
localStorage.getItem("currentUser");

const token =
localStorage.getItem("token");

if(!token){
    window.location.href =
    "login.html";
}

document.getElementById(
    "profileEmail"
).innerText = currentUser;

document.getElementById(
    "profileName"
).innerText =
currentUser.split("@")[0];

async function loadStats(){

    const response =
    await fetch(
        "http://localhost:8081/tasks/stats?userEmail="
        + currentUser
    );

    const stats =
    await response.json();

    document.getElementById(
        "totalTasks"
    ).innerText =
    stats.total;

    document.getElementById(
        "completedTasks"
    ).innerText =
    stats.completed;

    document.getElementById(
        "pendingTasks"
    ).innerText =
    stats.pending;
}

function logout(){

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
    "login.html";
}

loadStats();