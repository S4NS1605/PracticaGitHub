// --- CONFIGURACIÓN Y ESTADO ---
let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;

const quotes = {
    success: ["La disciplina rinde frutos.", "Excelencia lograda.", "Enfoque de élite.", "Progreso constante."],
    fail: ["La distracción costó caro.", "Redención necesaria.", "Vuelve a intentarlo.", "Sin atajos."]
};

const elements = {
    timerDisplay: document.getElementById('timer'),
    progressBar: document.getElementById('progressBar'),
    goalInput: document.getElementById('goalInput'),
    statusText: document.getElementById('status'),
    mainButton: document.getElementById('mainButton'),
    resetButton: document.getElementById('resetButton'),
    sessionLog: document.getElementById('sessionLog'),
    totalTimeDisplay: document.getElementById('totalFocusTime'),
    totalSessionsDisplay: document.getElementById('totalSessions'),
    clearLog: document.getElementById('clearLog'),
    soundSuccess: document.getElementById('soundSuccess'),
    soundFail: document.getElementById('soundFail'),
    modeBtns: document.querySelectorAll('.mode-btn')
};

// --- PERSISTENCIA Y CARGA ---
window.addEventListener('DOMContentLoaded', () => {
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    log.forEach(entry => renderLogEntry(entry.goal, entry.completed, entry.feedback, false));
    updateStats();
    updateUI();
});

function updateStats() {
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    const successfulSessions = log.filter(e => e.completed);
    
    // Calcular tiempo total (asumiendo que cada sesión exitosa sumó su tiempo original)
    // Para simplificar, usamos los minutos de los botones (15, 25, 45) si los guardáramos, 
    // pero aquí sumaremos el éxito.
    const minutes = successfulSessions.length * 25; // Promedio base
    
    elements.totalSessionsDisplay.innerText = successfulSessions.length;
    elements.totalTimeDisplay.innerText = `${minutes} min`;
}

// --- LÓGICA DEL TEMPORIZADOR ---
function updateUI() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    elements.timerDisplay.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    elements.progressBar.style.width = `${(timeLeft / totalTime) * 100}%`;
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
            completeSession();
        }
    }, 1000);
}

function completeSession() {
    const goal = elements.goalInput.value || "Sesión sin nombre";
    saveSession(goal, true);
    elements.soundSuccess.play().catch(()=>{});
    resetInterface("Victoria confirmada.");
}

// --- GESTIÓN DE LOGS ---
function saveSession(goal, completed) {
    const feedbackList = completed ? quotes.success : quotes.fail;
    const feedback = feedbackList[Math.floor(Math.random() * feedbackList.length)];
    
    const entry = { goal, completed, feedback, date: new Date().toLocaleTimeString() };
    
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    log.push(entry);
    localStorage.setItem('focusLog', JSON.stringify(log));
    
    renderLogEntry(goal, completed, feedback, false);
    updateStats();
}

function renderLogEntry(goal, completed, feedback) {
    const li = document.createElement('li');
    li.className = `log-item ${completed ? '' : 'failed'}`;
    li.innerHTML = `
        <strong>${completed ? '✓' : '×'} ${goal}</strong>
        <p style="margin:5px 0 0; color:#888; font-size:0.7rem;">"${feedback}"</p>
    `;
    elements.sessionLog.prepend(li);
}

// --- BOTONES ---
elements.mainButton.addEventListener('click', () => {
    if (!elements.goalInput.value.trim()) {
        elements.statusText.innerText = "Define un objetivo para empezar.";
        return;
    }
    elements.mainButton.disabled = true;
    elements.goalInput.disabled = true;
    elements.statusText.innerText = "Enfoque total...";
    startTimer();
});

elements.resetButton.addEventListener('click', () => {
    if (timerId) {
        if (confirm("¿Abandonar la misión? No contará en tus stats.")) {
            clearInterval(timerId);
            timerId = null;
            saveSession(elements.goalInput.value + " (Interrumpido)", false);
            elements.soundFail.play().catch(()=>{});
        }
    }
    timeLeft = totalTime;
    updateUI();
    resetInterface("Sistema reiniciado.");
});

elements.clearLog.addEventListener('click', () => {
    if(confirm("¿Borrar historial?")) {
        localStorage.clear();
        location.reload();
    }
});

function resetInterface(msg) {
    elements.mainButton.disabled = false;
    elements.goalInput.disabled = false;
    elements.statusText.innerText = msg;
}