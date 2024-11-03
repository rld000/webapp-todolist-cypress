const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.querySelector('.task-list');
const sortSelect = document.getElementById('sortSelect');
const filterSelect = document.getElementById('filterSelect');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  sortTasks();
  taskList.innerHTML = '';

  const filterOption = filterSelect.value;
  const filteredTasks = tasks.filter(task => {
    if (filterOption === 'done') return task.completed;
    if (filterOption === 'undone') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');

    // checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    //checkbox.classList.add("spaced");
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    // text
    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.classList.add("spaced");
    if (task.completed) {
      taskText.classList.add('completed');
    }

    // data
    const createdAt = document.createElement('span');
    createdAt.classList.add("spaced", "task-date");
    createdAt.textContent = formatDate(task.createdAt);

    // edit
    const editBtn = document.createElement('button');
    editBtn.classList.add("spaced");
    editBtn.textContent = 'Edytuj';
    editBtn.addEventListener('click', () => editTask(index, taskElement));

    // usuwanie
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add("spaced");
    deleteBtn.textContent = 'Usuń';
    deleteBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });

    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(createdAt);
    taskElement.appendChild(editBtn);
    taskElement.appendChild(deleteBtn);

    taskList.appendChild(taskElement);
  });
}

filterSelect.addEventListener('change', renderTasks);

function editTask(index, taskElement) {
  const task = tasks[index];
  taskElement.innerHTML = '';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.classList.add('spaced');
  editInput.value = task.text;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Zapisz';
  saveBtn.classList.add('spaced');
  saveBtn.addEventListener('click', () => {
    task.text = editInput.value;
    saveTasks();
    renderTasks();
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Anuluj';
  cancelBtn.classList.add('spaced');
  cancelBtn.addEventListener('click', renderTasks);

  taskElement.appendChild(editInput);
  taskElement.appendChild(saveBtn);
  taskElement.appendChild(cancelBtn);
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = 
    { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric' 
    };

    return date.toLocaleDateString(undefined, options);
  }

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', () => {
  if(!taskInput.value) return;
  const newTask = {
    text: taskInput.value,  
    completed: false,
    createdAt: new Date().getTime()
  };

  tasks.push(newTask);
  saveTasks();
  taskInput.value = '';
  renderTasks();
});

function sortTasks(){
  const sortOption = sortSelect.value;
  if (sortOption === 'atoz') {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
  }
  else if (sortOption === 'ztoa') {
    tasks.sort((a, b) => b.text.localeCompare(a.text));
  }
  else if (sortOption === 'newestdate') {
    tasks.sort((a, b) => b.createdAt - a.createdAt);
  }
  else if (sortOption === 'oldestdate') {
    tasks.sort((a, b) => a.createdAt - b.createdAt);
  }
}

sortSelect.addEventListener('change', renderTasks);

renderTasks();