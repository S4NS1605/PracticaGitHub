let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;

const mainButton = document.getElementById('mainButton');
const resetButton = document.getElementById('resetButton');
const statusText = document.getElementById('status');
const goalInput = document.getElementById('goalInput');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const mainCard = document.getElementById('mainCard');

function updateUI() {
    // Actualizar texto del reloj
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Actualizar barra de progreso
    const percentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;
}

function startTimer() {
    if (timerId !== null) return;
    
    mainCard.classList.add('active');
    
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            mainCard.classList.remove('active');
            statusText.innerText = "Objetivo completado con éxito.";
            statusText.style.color = "#d4af37";
        }
    }, 1000);
}

mainButton.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    
    if (goal === "") {
        statusText.innerText = "La claridad es poder. Define un objetivo.";
        statusText.style.color = "#ff4757";
        return;
    }

    statusText.innerText = `En curso: ${goal}`;
    statusText.style.color = "#d4af37";
    goalInput.disabled = true;
    mainButton.disabled = true;
    startTimer();
});

resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = totalTime;
    updateUI();
    
    mainCard.classList.remove('active');
    statusText.innerText = "Sistema listo para nueva misión.";
    statusText.style.color = "#888";
    goalInput.disabled = false;
    goalInput.value = "";
    mainButton.disabled = false;
});