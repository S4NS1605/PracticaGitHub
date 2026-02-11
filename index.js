let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;

const mainButton = document.getElementById('mainButton');
const resetButton = document.getElementById('resetButton');
const statusText = document.getElementById('status');
const goalInput = document.getElementById('goalInput');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const modeBtns = document.querySelectorAll('.mode-btn');
const sessionLog = document.getElementById('sessionLog');

function updateUI() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const percentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;
}

function addToLog(goal, completed = true) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const li = document.createElement('li');
    li.className = 'log-item';
    li.innerHTML = `
        <span>${goal || "Sin nombre"}</span>
        <span class="log-time">${completed ? '✓' : '×'} ${timeStr}</span>
    `;
    
    sessionLog.prepend(li); // Añadir al inicio de la lista
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        totalTime = parseInt(btn.dataset.time) * 60;
        timeLeft = totalTime;
        updateUI();
    });
});

function startTimer() {
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            addToLog(goalInput.value, true);
            statusText.innerText = "Victoria confirmada.";
            resetInterface();
        }
    }, 1000);
}

function resetInterface() {
    goalInput.disabled = false;
    mainButton.disabled = false;
    mainButton.innerText = "Iniciar";
}

mainButton.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    if (!goal) {
        statusText.innerText = "Define tu objetivo primero.";
        return;
    }
    statusText.innerText = "Enfoque total activado.";
    goalInput.disabled = true;
    mainButton.disabled = true;
    startTimer();
});

resetButton.addEventListener('click', () => {
    if (timerId) {
        if(confirm("¿Rendirse? Esta sesión no contará en tu registro.")) {
            addToLog(goalInput.value + " (Cancelado)", false);
            clearInterval(timerId);
            timerId = null;
            timeLeft = totalTime;
            updateUI();
            resetInterface();
            statusText.innerText = "Sesión abortada.";
        }
    } else {
        timeLeft = totalTime;
        updateUI();
        statusText.innerText = "Listo para comenzar.";
    }
});