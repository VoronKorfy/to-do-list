import {categoryList, priorityList, recurrenceList, statusList} from './data.js';

priorityList.forEach(item => {
    let icon;
    switch(item.priority) {
        case "Highest priority": icon = "🔴"; break;
        case "High priority": icon = "🟠"; break;
        case "Medium priority": icon = "🟡"; break;
        case "Low priority": icon = "🟢"; break;
        case "Lowest priority": icon = "🔵"; break;
        default: icon = "⚪";
    }

    let optionHTML = `<option value="${item.idPriority}" title="Priority: ${item.priority}">${icon} ${item.priority}</option>`;
    document.getElementById("priority").insertAdjacentHTML("beforeend", optionHTML);
});

statusList.forEach((item, index) => {
    let icon;
    switch(item.status) {
        case "Waiting": icon = "⏳"; break;
        case "In Progress": icon = "🔧"; break;
        case "Completed": icon = "✅"; break;
        case "Paused": icon = "⏸️"; break;
        default: icon = "⚪";
    }

    let optionHTML = `<option value="${item.idStatus}" ${index === 0 ? "selected" : ""} title="Status: ${item.status}">${icon} ${item.status}</option>`;
    document.getElementById("status").insertAdjacentHTML("beforeend", optionHTML);
});

recurrenceList.forEach((item, index) => {
    let optionHTML = `<option value="${item.idRecurrence}" ${index === recurrenceList.length - 1 ? "selected" : ""} title="Recurrence: ${item.recurrence}">${item.recurrence}</option>`;
    document.getElementById("recurrence").insertAdjacentHTML("beforeend", optionHTML);
});

const startDateInput = document.getElementById("startDate");
startDateInput.value = new Date().toISOString().split("T")[0];

let selectedCategories = [];
const categoryContainer = document.getElementById("categoryButtons");
categoryList.forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    let icon = "💟";
    btn.innerHTML = `${icon} ${item.category}`;
    btn.title = `Category: ${item.category}`;
    btn.dataset.id = item.idCategory;

    btn.addEventListener("click", function () {
        const id = this.dataset.id;
        if (selectedCategories.includes(id)) {
            selectedCategories = selectedCategories.filter(c => c !== id);
            this.classList.remove("active");
        } else {
            selectedCategories.push(id);
            this.classList.add("active");
        }
    });

    categoryContainer.appendChild(btn);
});


function showSavedMessage() {
    const saveMessage = document.getElementById("savedMessage");
    saveMessage.classList.add("show");
    setTimeout(() => {
    saveMessage.classList.remove("show");
    }, 2000);
}

function saveTask() {
    const form = document.getElementById("taskForm");
    const dueDateInput = document.getElementById("dueDate");

    if (!form.checkValidity()) {
        alert("Please fill in all required fields!");
        form.reportValidity();
        return;
    }

    const startDate = new Date(startDateInput.value);
    const dueDate = new Date(dueDateInput.value);

    if (dueDate < startDate) {
        alert("Due date cannot be earlier than Start date");
        return;
    }

    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];

    let task = {
        idTask: taskList.length > 0 ? Math.max(...taskList.map(t => t.idTask)) + 1 : 1,
        title: document.getElementById("titleTask").value,
        description: document.getElementById("description").value,
        tags: document.getElementById("tags").value
            ? document.getElementById("tags").value.split(",").map(t => t.trim())
            : [],
        startDate: startDateInput.value,
        dueDate: dueDateInput.value,
        idPriority: document.getElementById("priority").value,
        idStatus: document.getElementById("status").value,
        idRecurrence: document.getElementById("recurrence").value,
        idCategory: [...selectedCategories]
    };
    taskList.push(task);
    localStorage.setItem("taskList", JSON.stringify(taskList));

    form.reset();
    selectedCategories = [];
    document
        .querySelectorAll("#categoryButtons button")
        .forEach(btn => btn.classList.remove("active"));
    showSavedMessage();
}

document.getElementById("saveBtn").addEventListener("click", saveTask);

document.getElementById("startDate").addEventListener("input", function() {
    document.getElementById("dueDate").min = this.value;
});
