import { priorityList, statusList, recurrenceList, categoryList } from './data.js';

let showCompleted = false;
let taskList = [];

function loadTasks() {
    let storedData = localStorage.getItem("taskList");
    taskList = storedData ? JSON.parse(storedData) : [];
}

function getPriorityIcon(id) {
    const item = priorityList.find(p => p.idPriority === id);
    if (!item) return '';
    switch(item.priority) {
        case "Highest priority": return "🔴";
        case "High priority": return "🟠";
        case "Medium priority": return "🟡";
        case "Low priority": return "🟢";
        case "Lowest priority": return "🔵";
        default: return "⚪";
    }
}

function getStatusIcon(id) {
    const item = statusList.find(s => s.idStatus === id);
    if (!item) return '';
    switch(item.status) {
        case "Waiting": return "⏳";
        case "In Progress": return "🔧";
        case "Completed": return "✅";
        case "Paused": return "⏸️";
        default: return "⚪";
    }
}

function displayTasks() {
    const tbody = document.getElementById("taskTableBody");
    tbody.innerHTML = "";

    taskList
        .filter(task => showCompleted ? true : Number(task.idStatus) !== 3)
        .forEach(task => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${task.idTask}</td>
                <td>${task.title}</td>
                <td class="desc-cell"><pre>${task.description || ""}</pre></td>
                <td>${task.startDate}</td>
                <td>${task.dueDate}</td>
                <td>${getPriorityIcon(task.idPriority)} ${priorityList.find(p => p.idPriority===task.idPriority)?.priority}</td>
                <td>${recurrenceList.find(r => r.idRecurrence===task.idRecurrence)?.recurrence || ""}</td>
                <td>${categoryList.filter(c => task.idCategory?.includes(c.idCategory)).map(c => `${c.category}`).join(", ")}</td>
            `;

            let tdStatus = document.createElement("td");
            tdStatus.appendChild(generateStatusButtons(task));
            tr.appendChild(tdStatus);

            tbody.appendChild(tr);
        });
}

function updateStatus(taskId, newStatusId) {
    let task = taskList.find(t => t.idTask === taskId);
    if (!task) return;

    task.idStatus = newStatusId;

    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks();
}

function generateStatusButtons(task) {
    const container = document.createElement("div");

    statusList.forEach(status => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = `${getStatusIcon(status.idStatus)} ${status.status}`;
        btn.title = `Set status to ${status.status}`;

        if (task.idStatus === status.idStatus) {
            btn.disabled = true;
            btn.classList.add("active-status");
        }

        btn.addEventListener("click", () => updateStatus(task.idTask, status.idStatus));
        container.appendChild(btn);
    });

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "🗑️ Delete";
    delBtn.title = "Delete this task";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => deleteTask(task.idTask));
    container.appendChild(delBtn);

    return container;
}

function deleteTask(taskId) {
    taskList = taskList.filter(t => t.idTask !== taskId);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks();
}

loadTasks();
displayTasks();

document.getElementById("toggleCompleted").addEventListener("change", function () {
    showCompleted = this.checked;
    displayTasks();
});
