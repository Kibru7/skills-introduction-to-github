let tasks = [];

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const scheduleTime = document.getElementById('scheduleTime');
    
    const description = taskInput.value.trim();
    const time = scheduleTime.value;
    
    if (!description) {
        alert('Please enter a task description');
        return;
    }
    
    if (!time) {
        alert('Please select a schedule time');
        return;
    }
    
    const task = {
        id: Date.now(),
        description: description,
        scheduleTime: time,
        completed: false
    };
    
    tasks.push(task);
    tasks.sort((a, b) => new Date(a.scheduleTime) - new Date(b.scheduleTime));
    
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    scheduleTime.value = '';
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
}

function renderTasks() {
    const tasksContainer = document.getElementById('tasks');
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="no-tasks">No tasks scheduled. Add one above!</div>';
        return;
    }
    
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-info">
                <div class="task-description">${escapeHtml(task.description)}</div>
                <div class="task-time">📅 ${formatDateTime(task.scheduleTime)}</div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${task.id})">
                    ${task.completed ? '↩️ Undo' : '✓ Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

window.addEventListener('DOMContentLoaded', loadTasks);
