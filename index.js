// Gestión de estado y tiempo
let timeLeft = 25 * 60;
let timerId = null;

const mainButton = document.getElementById('mainButton');
const resetButton = document.getElementById('resetButton');
const statusText = document.getElementById('status');
const goalInput = document.getElementById('goalInput');
const timerDisplay = document.getElementById('timer');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId !== null) return;
    
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            statusText.innerText = "Misión cumplida. Descansa.";
            alert("Tiempo agotado. Revisa tu progreso.");
        }
    }, 1000);
}

mainButton.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    
    if (goal === "") {
        statusText.innerText = "Error: Define un objetivo antes de empezar.";
        statusText.style.color = "#ff6b6b";
        return;
    }

    statusText.innerText = `Ejecutando: ${goal}`;
    statusText.style.color = "#d4af37";
    goalInput.disabled = true;
    mainButton.disabled = true;
    startTimer();
});

resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    statusText.innerText = "Estado: Reiniciado.";
    statusText.style.color = "#888";
    goalInput.disabled = false;
    mainButton.disabled = false;
});