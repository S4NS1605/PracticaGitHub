let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;

const quotes = {
    success: [
        "La disciplina es el puente entre metas y logros.",
        "Excelencia no es un acto, es un hábito.",
        "Has dominado tu tiempo, ahora domina tu día.",
        "Poco a poco, lo difícil se vuelve fácil."
    ],
    fail: [
        "El fracaso es solo una oportunidad para empezar de nuevo con más inteligencia.",
        "No te juzgues por caer, júzgate por no querer levantarte.",
        "La distracción es el enemigo de la ambición.",
        "Mañana es una nueva oportunidad para la redención."
    ]
};

const elements = {
    mainButton: document.getElementById('mainButton'),
    resetButton: document.getElementById('resetButton'),
    statusText: document.getElementById('status'),
    goalInput: document.getElementById('goalInput'),
    timerDisplay: document.getElementById('timer'),
    progressBar: document.getElementById('progressBar'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    sessionLog: document.getElementById('sessionLog'),
    soundSuccess: document.getElementById('soundSuccess'),
    soundFail: document.getElementById('soundFail')
};

function updateUI() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    elements.timerDisplay.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    elements.progressBar.style.width = `${(timeLeft / totalTime) * 100}%`;
}

function getFeedback(type) {
    const list = quotes[type];
    return list[Math.floor(Math.random() * list.length)];
}

function addToLog(goal, completed) {
    const li = document.createElement('li');
    li.className = `log-item ${completed ? '' : 'failed'}`;
    const feedback = getFeedback(completed ? 'success' : 'fail');
    
    li.innerHTML = `
        <strong>${completed ? '✓' : '×'} ${goal || 'Sin título'}</strong>
        <span class="feedback-text">"${feedback}"</span>
    `;
    elements.sessionLog.prepend(li);
    
    if(completed) elements.soundSuccess.play();
    else elements.soundFail.play();
}

elements.modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return;
        elements.modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        totalTime = parseInt(btn.dataset.time) * 60;
        timeLeft = totalTime;
        updateUI();
    });
});

function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            addToLog(elements.goalInput.value, true);
            resetInterface("Misión cumplida.");
        }
    }, 1000);
}

function resetInterface(msg) {
    elements.goalInput.disabled = false;
    elements.mainButton.disabled = false;
    elements.statusText.innerText = msg;
    elements.mainButton.innerText = "Ejecutar";
}

elements.mainButton.addEventListener('click', () => {
    if (!elements.goalInput.value.trim()) {
        elements.statusText.innerText = "Sin dirección no hay progreso.";
        return;
    }
    elements.statusText.innerText = "Enfoque absoluto...";
    elements.goalInput.disabled = true;
    elements.mainButton.disabled = true;
    startTimer();
});

elements.resetButton.addEventListener('click', () => {
    if (timerId && confirm("¿Abandonar el campo de batalla?")) {
        addToLog(elements.goalInput.value + " (Interrumpido)", false);
        clearInterval(timerId);
        timerId = null;
    }
    timeLeft = totalTime;
    updateUI();
    resetInterface("Sistema reiniciado.");
});