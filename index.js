let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;
let currentAmbient = null;

const elements = {
    timer: document.getElementById('timer'),
    progress: document.getElementById('progressBar'),
    goal: document.getElementById('goalInput'),
    mainBtn: document.getElementById('mainButton'),
    totalTimeDisp: document.getElementById('totalFocusTime'),
    rankDisp: document.getElementById('rankStatus'),
    customInp: document.getElementById('customMin'),
    setCustomBtn: document.getElementById('setCustomTime'),
    logList: document.getElementById('sessionLog'),
    modes: document.querySelectorAll('.mode-btn'),
    ambients: document.querySelectorAll('.ambient-btn')
};

// --- MAESTRÍA ---
function updateMastery() {
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    const mins = log.filter(e => e.completed).reduce((acc, curr) => acc + curr.duration, 0);
    elements.totalTimeDisp.innerText = `${mins} min`;
    
    let rank = "Novato";
    if (mins >= 60) rank = "Guerrero";
    if (mins >= 300) rank = "Maestro";
    if (mins >= 1000) rank = "Élite Zen";
    elements.rankDisp.innerText = rank;
}

// --- TIEMPO PERSONALIZADO ---
elements.setCustomBtn.addEventListener('click', () => {
    const val = parseInt(elements.customInp.value);
    if (val > 0 && val <= 120) {
        totalTime = val * 60;
        timeLeft = totalTime;
        updateUI();
        elements.modes.forEach(m => m.classList.remove('active'));
    }
});

// --- AUDIO AMBIENTE ---
elements.ambients.forEach(btn => {
    btn.addEventListener('click', () => {
        const soundId = btn.dataset.sound;
        if (currentAmbient) { currentAmbient.pause(); currentAmbient.currentTime = 0; }
        elements.ambients.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (soundId !== 'none') {
            currentAmbient = document.getElementById(`amb-${soundId}`);
            currentAmbient.play();
        }
    });
});

// --- CORE LOGIC ---
function updateUI() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    elements.timer.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    elements.progress.style.width = `${(timeLeft / totalTime) * 100}%`;
}

elements.modes.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return;
        elements.modes.forEach(m => m.classList.remove('active'));
        btn.classList.add('active');
        totalTime = parseInt(btn.dataset.time) * 60;
        timeLeft = totalTime;
        updateUI();
    });
});

function finish(completed) {
    const goalText = elements.goal.value || "Misión sin nombre";
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    const dur = Math.floor(totalTime / 60);
    
    log.push({ goal: goalText, completed, duration: completed ? dur : 0 });
    localStorage.setItem('focusLog', JSON.stringify(log));
    
    const li = document.createElement('li');
    li.className = `log-item ${completed ? '' : 'failed'}`;
    li.innerHTML = `<strong>${completed ? '✓' : '×'} ${goalText}</strong> <small style="float:right">${dur}m</small>`;
    elements.logList.prepend(li);
    
    if (completed) document.getElementById('soundSuccess').play();
    updateMastery();
    resetState();
}

function start() {
    if (timerId || !elements.goal.value.trim()) return;
    elements.mainBtn.disabled = true;
    elements.goal.disabled = true;
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) { clearInterval(timerId); timerId = null; finish(true); }
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', () => {
    if (timerId && confirm("¿Abortar misión? Esto no contará en tus estadísticas.")) {
        clearInterval(timerId); timerId = null; finish(false);
        document.getElementById('soundFail').play();
    }
    timeLeft = totalTime; updateUI(); resetState();
});

function resetState() { elements.mainBtn.disabled = false; elements.goal.disabled = false; }
elements.mainBtn.addEventListener('click', start);
document.getElementById('clearLog').addEventListener('click', () => { if(confirm("¿Borrar todo?")) { localStorage.clear(); location.reload(); }});

// Start
updateMastery();
updateUI();