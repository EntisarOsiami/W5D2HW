document.addEventListener("DOMContentLoaded", function () {
  let currentUserData = localStorage.getItem("currentUser");
  let currentUser = currentUserData ? JSON.parse(currentUserData) : null;

  if (!currentUser || !currentUser.email) {
    window.location.href = "login.html";
    return;
  }

  let userWelcome = document.getElementById("userWelcome");
  if (userWelcome && currentUser) {
    userWelcome.textContent = `مرحباً ${currentUser.name}`;
  }

  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }

  let tasks = [];
  let editingTaskId = null;

  function renderTasks() {
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }

    if (tasks.length === 0) {
      let emptyState = document.createElement("li");
      emptyState.className = "empty-state";

      let icon = document.createElement("i");
      icon.className = "fas fa-clipboard fa-2x mb-3";

      let text = document.createElement("p");
      text.textContent = "لا توجد مهام حالياً. أضف مهمة جديدة للبدء!";

      emptyState.appendChild(icon);
      emptyState.appendChild(text);
      taskList.appendChild(emptyState);
    } else {
      tasks.forEach((task) => {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.style.border = "2px solid #333";
        li.dataset.id = task.id;

        let completeBtn = document.createElement("button");
        completeBtn.className = "btn-complete";
        completeBtn.setAttribute("data-action", "complete");
        completeBtn.title = task.completed ? "غير مكتمل" : "إكمال";
        let completeIcon = document.createElement("i");
        completeIcon.className = `fas ${task.completed ? "fa-check-square" : "fa-square"
          }`;
        completeBtn.appendChild(completeIcon);

        let taskTextDiv = document.createElement("div");
        taskTextDiv.className = task.completed
          ? "task-text task-complete"
          : "task-text";
        taskTextDiv.textContent = task.text;

        let actionsDiv = document.createElement("div");
        actionsDiv.className = "action-btns d-flex";

        let editBtn = document.createElement("button");
        editBtn.className = "btn-edit";
        editBtn.setAttribute("data-action", "edit");
        editBtn.title = "تعديل";
        let editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit";
        editBtn.appendChild(editIcon);

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete";
        deleteBtn.setAttribute("data-action", "delete");
        deleteBtn.title = "حذف";
        let deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash-alt";
        deleteBtn.appendChild(deleteIcon);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(completeBtn);
        li.appendChild(taskTextDiv);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);
      });
    }

    let taskCountElement = document.getElementById("taskCount");
    let remainingTasks = tasks.filter((task) => !task.completed).length;
    taskCountElement.textContent = remainingTasks;
    if (editingTaskId === null) {
      while (addTaskBtn.firstChild) {
        addTaskBtn.removeChild(addTaskBtn.firstChild);
      }
      let addIcon = document.createElement("i");
      addIcon.className = "fas fa-plus";
      addTaskBtn.appendChild(addIcon);
      addTaskBtn.appendChild(document.createTextNode(" إضافة"));

      addTaskBtn.classList.remove("btn-update");
      addTaskBtn.classList.add("btn-add");
    }
  }

  function loadTasks() {
    const userEmail = currentUser.email;
    const savedTasks = localStorage.getItem("tasks_" + userEmail);
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    renderTasks();
  }

  let taskList = document.getElementById("taskList");
  taskList.addEventListener("click", function (e) {
    let listItem = e.target.closest(".list-group-item");
    if (!listItem) return;

    let taskId = parseInt(listItem.dataset.id);

    let actionButton = e.target.closest("[data-action]");
    if (actionButton) {
      let action = actionButton.dataset.action;

      switch (action) {
        case "complete":
          toggleTaskCompletion(taskId);
          break;
        case "edit":
          editTask(taskId);
          break;
        case "delete":
          deleteTask(taskId);
          break;
      }
    }
  });

  function addTask() {
    let taskText = taskInput.value.trim();
    if (!taskText) {
      return;
    }

    if (editingTaskId !== null) {
      let taskIndex = tasks.findIndex((task) => task.id === editingTaskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].text = taskText;
        editingTaskId = null;
      }
    } else {
      let newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date(),
      };
      tasks.push(newTask);
    }

    taskInput.value = "";
    taskInput.focus();
    saveTasks();
  }

  let addTaskBtn = document.getElementById("addTask");
  addTaskBtn.addEventListener("click", addTask);

  let taskInput = document.getElementById("taskInput");
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function deleteTask(taskId) {
    if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      tasks = tasks.filter((task) => task.id !== taskId);
      saveTasks();
    }
  }

  function saveTasks() {
    const userEmail = currentUser.email;
    localStorage.setItem("tasks_" + userEmail, JSON.stringify(tasks));
    renderTasks();
  }

  function toggleTaskCompletion(taskId) {
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks();
    }
  }

  function clearAllTasks() {
    if (tasks.length === 0) {
      return;
    }

    if (confirm("هل انت متأكد من حذف جميع المهام؟")) {
      tasks = [];
      saveTasks();
    }
  }

  let clearAllBtn = document.getElementById("clearAllBtn");
  clearAllBtn.addEventListener("click", clearAllTasks);

  function editTask(taskId) {
    let task = tasks.find((task) => task.id === taskId);
    if (task) {
      taskInput.value = task.text;
      taskInput.focus();
      editingTaskId = taskId;

      while (addTaskBtn.firstChild) {
        addTaskBtn.removeChild(addTaskBtn.firstChild);
      }

      let saveIcon = document.createElement("i");
      saveIcon.className = "fas fa-save";
      addTaskBtn.appendChild(saveIcon);
      addTaskBtn.appendChild(document.createTextNode(" تحديث"));

      addTaskBtn.classList.add("btn-update");
      addTaskBtn.classList.remove("btn-add");
    }
  }

  loadTasks();
});
