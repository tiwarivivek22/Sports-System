function updateValues() {
    const steps = document.getElementById('total-steps').value;
    const calories = document.getElementById('total-calories').value;
    const distance = document.getElementById('total-distance').value;
    
    console.log(`Updated Values - Steps: ${steps}, Calories: ${calories}, Distance: ${distance} km`);
}
// User data storage (in a real app, this would be server-side)
let users = [];
let currentUser = null;

// DOM Elements
const authContainer = document.getElementById('auth-container');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signinToggle = document.getElementById('signin-toggle');
const signupToggle = document.getElementById('signup-toggle');
const errorMessage = document.getElementById('error-message');
const profileForm = document.getElementById('profile-form');
const profileFormElement = document.getElementById('profile-form-element');
const dashboard = document.getElementById('dashboard');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');
const totalSteps = document.getElementById('total-steps');
const totalCalories = document.getElementById('total-calories');
const totalDistance = document.getElementById('total-distance');

// Toggle between sign-in and sign-up forms
signinToggle.addEventListener('click', () => {
    signinForm.style.display = 'block';
    signupForm.style.display = 'none';
    signinToggle.classList.add('bg-blue-500', 'text-white');
    signinToggle.classList.remove('bg-gray-200');
    signupToggle.classList.add('bg-gray-200');
    signupToggle.classList.remove('bg-blue-500', 'text-white');
});

signupToggle.addEventListener('click', () => {
    signinForm.style.display = 'none';
    signupForm.style.display = 'block';
    signinToggle.classList.add('bg-gray-200');
    signinToggle.classList.remove('bg-blue-500', 'text-white');
    signupToggle.classList.add('bg-blue-500', 'text-white');
    signupToggle.classList.remove('bg-gray-200');
});

// Sign-in form submission
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        if (user.profile) {
            showDashboard();
        } else {
            showProfileForm();
        }
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});

// Sign-up form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        return;
    }

    if (users.some(u => u.username === username)) {
        errorMessage.textContent = 'Username already exists';
        return;
    }

    const newUser = { username, password };
    users.push(newUser);
    currentUser = newUser;
    showProfileForm();
});

// Profile form submission
profileFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    const sport = document.getElementById('sport').value;
    currentUser.profile = { name, age, sport, height, weight, gender};
    currentUser.activityData = [];
    showDashboard();
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    showAuthForm();
});

function showAuthForm() {
    authContainer.style.display = 'flex';
    profileForm.style.display = 'none';
    dashboard.style.display = 'none';
}

function showProfileForm() {
    authContainer.style.display = 'none';
    profileForm.style.display = 'flex';
    dashboard.style.display = 'none';
}

function showDashboard() {
    authContainer.style.display = 'none';
    profileForm.style.display = 'none';
    dashboard.style.display = 'block';
    userGreeting.textContent = `Welcome, ${currentUser.profile.name}!`;
    initializeChart();
    startRealTimeUpdates();
}

let activityChart;

function initializeChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Steps',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }, {
                label: 'Calories',
                data: [],
                borderColor: 'rgb(16, 185, 129)',
                tension: 0.1
            }, {
                label: 'Distance',
                data: [],
                borderColor: 'rgb(245, 158, 11)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }
            }
        }
    });
}

function startRealTimeUpdates() {
    setInterval(() => {
        const now = new Date();
        const newData = {
            timestamp: now,
            steps: Math.floor(Math.random() * 100),
            calories: Math.floor(Math.random() * 10),
            distance: Math.random() * 0.1
        };
        currentUser.activityData.push(newData);
        updateDashboard();
    }, 5000); // Update every 5 seconds
}

function updateDashboard() {
    const latestData = currentUser.activityData[currentUser.activityData.length - 1];
    
    // Update totals
    const totalStepsValue = currentUser.activityData.reduce((sum, data) => sum + data.steps, 0);
    const totalCaloriesValue = currentUser.activityData.reduce((sum, data) => sum + data.calories, 0);
    const totalDistanceValue = currentUser.activityData.reduce((sum, data) => sum + data.distance, 0);
    
    totalSteps.textContent = totalStepsValue.toLocaleString();
    totalCalories.textContent = totalCaloriesValue.toLocaleString();
    totalDistance.textContent = totalDistanceValue.toFixed(2) + ' km';

    // Update chart
    activityChart.data.labels.push(latestData.timestamp);
    activityChart.data.datasets[0].data.push(latestData.steps);
    activityChart.data.datasets[1].data.push(latestData.calories);
    activityChart.data.datasets[2].data.push(latestData.distance);

    // Keep only the last 20 data points
    if (activityChart.data.labels.length > 20) {
        activityChart.data.labels.shift();
        activityChart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    activityChart.update();
}


// Get elements
const editBtn = document.getElementById("edit-btn");
const editProfileModal = document.getElementById("edit-profile-modal");
const closeModal = document.getElementById("close-modal");
const editProfileForm = document.getElementById("edit-profile-form");

// Retrieve stored data
let storedName = localStorage.getItem("userName") || "Guest";
userGreeting.textContent = `Welcome, ${storedName}!`;

// Open edit profile modal
editBtn.addEventListener("click", () => {
editProfileModal.classList.remove("hidden");
document.getElementById("edit-name").value = storedName;  // Prefill name
});

// Close modal
closeModal.addEventListener("click", () => {
editProfileModal.classList.add("hidden");
});

// Save profile changes
editProfileForm.addEventListener("submit", function (e) {
e.preventDefault();
const newName = document.getElementById("edit-name").value;
localStorage.setItem("userName", newName);
userGreeting.textContent = `Welcome, ${newName}!`;
editProfileModal.classList.add("hidden");  // Hide modal after saving
});


document.addEventListener("DOMContentLoaded", function () {
const ctx = document.getElementById("activity-chart").getContext("2d");

// Sample Weekly Data
const weeklyData = {
labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
steps: [5000, 7000, 6500, 8000, 9000, 7500, 8200],
calories: [200, 250, 220, 280, 300, 270, 290],
distance: [3.5, 4.2, 4.0, 4.8, 5.0, 4.5, 4.9]
};

// Sample Monthly Data
const monthlyData = {
labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
steps: [35000, 42000, 38000, 44000],
calories: [1400, 1600, 1500, 1700],
distance: [24, 28, 25, 30]
};

// Initial Chart Configuration
let chart = new Chart(ctx, {
type: "bar",
data: {
    labels: weeklyData.labels,
    datasets: [
        {
            label: "Steps",
            data: weeklyData.steps,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
        },
        {
            label: "Calories Burned",
            data: weeklyData.calories,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1
        },
        {
            label: "Distance (km)",
            data: weeklyData.distance,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
        }
    ]
},
options: {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true
        }
    }
}
});

// Toggle to Weekly Data
document.getElementById("weekly-btn").addEventListener("click", function () {
updateChart(weeklyData);
});

// Toggle to Monthly Data
document.getElementById("monthly-btn").addEventListener("click", function () {
updateChart(monthlyData);
});
// Function to Update Chart
function updateChart(data) {
chart.data.labels = data.labels;
chart.data.datasets[0].data = data.steps;
chart.data.datasets[1].data = data.calories;
chart.data.datasets[2].data = data.distance;
chart.update();
}
});


  // BMI Calculator
  const heightInput = document.getElementById("height")
  const weightInput = document.getElementById("weight")
  const bmiValue = document.getElementById("bmi-value")
  const bmiStatus = document.getElementById("bmi-status")
  const gaugeFill = document.querySelector(".gauge-fill")

  function calculateBMI() {
    const height = heightInput.value / 100 // convert cm to m
    const weight = weightInput.value
    const bmi = (weight / (height * height)).toFixed(1)

    bmiValue.textContent = bmi

    if (bmi < 18.5) {
      bmiStatus.textContent = "Underweight"
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiStatus.textContent = "You're Healthy"
    } else if (bmi >= 25 && bmi < 30) {
      bmiStatus.textContent = "Overweight"
    } else {
      bmiStatus.textContent = "Obese"
    }

    const percentage = ((bmi - 15) / (40 - 15)) * 100
    gaugeFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`
  }

  heightInput.addEventListener("input", calculateBMI)
  weightInput.addEventListener("input", calculateBMI)

  function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24)); // Difference in days
    return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : `${diff} Days Ago`;
  }

  const lastCheckedDate = new Date("2024-02-08"); // Set your last checked date here
  document.getElementById("lastChecked").innerText = `Last checked ${timeAgo(lastCheckedDate)}`;


  