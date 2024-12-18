document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Fetch existing tasks from the server
    fetchTasks();

    // Add new task
    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value.trim();
        if (task) {
            addTask(task);
            taskInput.value = '';
        }
    });

    // Fetch tasks from server
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    addTaskToUI(task);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Add task to UI
    function addTaskToUI(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${task.name}
            <button class="delete-btn" onclick="deleteTask(${task.id})">Удалить</button>
        `;
        taskList.appendChild(li);
    }

    // Delete task
    window.deleteTask = function(id) {
        fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetchTasks();
                } else {
                    console.error('Error deleting task');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Add new task to server
    function addTask(task) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: task }),
        })
            .then(response => {
                if (response.ok) {
                    fetchTasks();
                } else {
                    console.error('Error adding task');
                }
            })
            .catch(error => console.error('Error:', error));
    }
});