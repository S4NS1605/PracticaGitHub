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

function updateUI() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const percentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Selección de modo
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return; // Bloquear cambio si está corriendo
        
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const minutes = parseInt(btn.dataset.time);
        totalTime = minutes * 60;
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
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
            statusText.innerText = "Ciclo terminado. Evalúa tus resultados.";
        }
    }, 1000);
}

mainButton.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    if (!goal) {
        statusText.innerText = "Sin objetivo no hay camino. Escribe algo.";
        return;
    }
    statusText.innerText = `Enfoque: ${goal}`;
    goalInput.disabled = true;
    mainButton.disabled = true;
    startTimer();
});

resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = totalTime;
    updateUI();
    statusText.innerText = "Sistema reiniciado.";
    goalInput.disabled = false;
    mainButton.disabled = false;
});