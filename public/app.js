// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;

    // Check which page we are on and attach event listeners
    if (currentPage.endsWith('register.html')) {
        document.getElementById('registerForm').addEventListener('submit', registerUser);
    } else if (currentPage.endsWith('index.html') || currentPage === '/') {
        document.getElementById('loginForm').addEventListener('submit', loginUser);
    } else if (currentPage.endsWith('dashboard.html')) {
        checkAuth();
        loadTasks();
        document.getElementById('logoutBtn').addEventListener('click', logoutUser);
        document.getElementById('taskForm').addEventListener('submit', createTask);
    }
});

// ✅ User Registration
async function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) {
        alert('All fields are required!');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Redirecting to login...');
            window.location.href = '/';
        } else {
            alert(data.message || 'Registration failed. Try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again.');
    }
}

// ✅ User Login
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Both fields are required!');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message || 'Login failed. Check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
}

// ✅ User Logout
function logoutUser() {
    localStorage.removeItem('token');
    alert('Logged out successfully.');
    window.location.href = '/';
}

// ✅ Authorization Check (Protect Dashboard)
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Unauthorized access. Please log in.');
        window.location.href = '/';
    }
}

// ✅ Load Tasks (Dashboard View)
async function loadTasks() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tasks', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const tasks = await response.json();

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p>No tasks available. Add a new task!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span>${task.title} - ${task.description}</span>
                <button onclick="deleteTask('${task._id}')">❌ Delete</button>
                <button onclick="toggleTaskCompletion('${task._id}', ${task.completed})">
                    ${task.completed ? '✔️ Completed' : 'Mark Complete'}
                </button>
            `;
            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
        alert('Unable to load tasks. Try again.');
    }
}

// ✅ Create a New Task
async function createTask(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();

    if (!title || !description) {
        alert('Task title and description are required!');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            alert('Task created successfully!');
            document.getElementById('taskForm').reset();
            loadTasks();
        } else {
            alert('Error creating task. Try again.');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        alert('An error occurred while adding the task.');
    }
}

// ✅ Delete a Task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Task deleted successfully!');
            loadTasks();
        } else {
            alert('Error deleting task.');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('An error occurred.');
    }
}
