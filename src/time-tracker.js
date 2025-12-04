// Time Tracker Class
class TimeTracker {
  constructor() {
    this.tasks = [];
    this.currentTaskId = null;
    this.timerInterval = null;
    this.startTime = null;
    this.isRunning = false;
    
    // DOM Elements
    this.timerDisplay = document.getElementById('timer-display');
    this.startStopBtn = document.getElementById('start-stop-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.taskInput = document.getElementById('task-input');
    this.addTaskBtn = document.getElementById('add-task-btn');
    this.tasksContainer = document.getElementById('tasks-container');
    
    // Initialize event listeners
    this.initializeEventListeners();
    
    // Load tasks from localStorage
    this.loadTasks();
    this.renderTasks();
  }

  // Format time in HH:MM:SS
  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Start/Stop button
    this.startStopBtn.addEventListener('click', () => this.toggleTimer());
    
    // Reset button
    this.resetBtn.addEventListener('click', () => this.resetTimer());
    
    // Add task button
    this.addTaskBtn.addEventListener('click', () => this.addTask());
    
    // Add task on Enter key
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTask();
      }
    });
    
    // Delegate task actions
    this.tasksContainer.addEventListener('click', (e) => {
      const taskElement = e.target.closest('.task-item');
      if (!taskElement) return;
      
      const taskId = parseInt(taskElement.dataset.taskId);
      
      // Play/Pause button
      if (e.target.closest('.task-play-btn')) {
        this.toggleTaskTimer(taskId);
      }
      
      // Delete button
      if (e.target.closest('.task-delete-btn')) {
        this.deleteTask(taskId);
      }
    });
  }

  // Toggle timer
  toggleTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  // Start the timer
  startTimer() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.startStopBtn.textContent = 'Stop';
    this.startStopBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');
    this.startStopBtn.classList.add('bg-red-500', 'hover:bg-red-600');
    
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  // Stop the timer
  stopTimer() {
    if (!this.isRunning) return;
    
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.startStopBtn.textContent = 'Start';
    this.startStopBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
    this.startStopBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
    this.startTime = null;
  }

  // Reset the timer
  resetTimer() {
    this.stopTimer();
    this.timerDisplay.textContent = '00:00:00';
  }

  // Update the timer display
  updateTimer() {
    if (!this.startTime) return;
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.timerDisplay.textContent = this.formatTime(elapsed);
  }

  // Add a new task
  addTask() {
    const taskName = this.taskInput.value.trim();
    if (!taskName) return;
    
    const newTask = {
      id: Date.now(),
      name: taskName,
      timeSpent: 0,
      isRunning: false
    };
    
    this.tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();
    
    // Clear input
    this.taskInput.value = '';
    this.taskInput.focus();
  }

  // Toggle task timer
  toggleTaskTimer(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.isRunning) {
      this.stopTaskTimer(task);
    } else {
      // Stop any running task
      const runningTask = this.tasks.find(t => t.isRunning);
      if (runningTask) {
        this.stopTaskTimer(runningTask);
      }
      
      // Start this task
      task.isRunning = true;
      task.startTime = Date.now();
      this.renderTasks();
    }
  }

  // Stop task timer
  stopTaskTimer(task) {
    if (!task.isRunning) return;
    
    const now = Date.now();
    task.timeSpent += Math.floor((now - task.startTime) / 1000);
    task.isRunning = false;
    delete task.startTime;
    this.saveTasks();
    this.renderTasks();
  }

  // Delete a task
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => {
      if (task.id === taskId && task.isRunning) {
        this.stopTimer();
      }
      return task.id !== taskId;
    });
    this.saveTasks();
    this.renderTasks();
  }

  // Render all tasks
  renderTasks() {
    if (!this.tasksContainer) return;
    
    this.tasksContainer.innerHTML = this.tasks.map(task => `
      <div class="task-item bg-gray-50 p-4 rounded-lg border border-gray-100 mb-2" data-task-id="${task.id}">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-medium">${task.name}</h3>
            <p class="text-sm text-gray-500">${this.formatTime(task.timeSpent)}</p>
          </div>
          <div class="flex space-x-2">
            <button class="task-play-btn p-2 ${task.isRunning ? 'text-yellow-500 hover:bg-yellow-50' : 'text-green-500 hover:bg-green-50'} rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                ${task.isRunning ? 
                  '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />' :
                  '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />'
                }
              </svg>
            </button>
            <button class="task-delete-btn p-2 text-red-500 hover:bg-red-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Save tasks to localStorage
  saveTasks() {
    localStorage.setItem('timeTrackerTasks', JSON.stringify(this.tasks));
  }

  // Load tasks from localStorage
  loadTasks() {
    const savedTasks = localStorage.getItem('timeTrackerTasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.timeTracker = new TimeTracker();
});