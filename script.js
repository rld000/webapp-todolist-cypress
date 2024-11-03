const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.querySelector('.task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.classList.add("spaced");
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.classList.add("spaced");
    if (task.completed) {
      taskText.classList.add('completed');
    }

    const createdAt = document.createElement('span');
    createdAt.classList.add("spaced");
    createdAt.textContent = formatDate(task.createdAt);

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
    taskElement.appendChild(deleteBtn);

    taskList.appendChild(taskElement);
  });
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

    return date.toLocaleDateString('pl-PL', options);
  }

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', () => {
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

renderTasks();