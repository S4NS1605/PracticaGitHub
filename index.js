// CONFIGURACIÓN MAESTRA
let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;
let currentAmbient = null;

const els = {
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
    ambients: document.querySelectorAll('.ambient-btn'),
    status: document.getElementById('status')
};

// --- PERSISTENCIA BLINDADA ---
function loadData() {
    const log = JSON.parse(localStorage.getItem('absoluteLog')) || [];
    els.logList.innerHTML = ''; 
    log.forEach(entry => renderEntry(entry));
    updateMastery(log);
}

function updateMastery(log) {
    const mins = log.filter(e => e.completed).reduce((acc, curr) => acc + curr.duration, 0);
    els.totalTimeDisp.innerText = `${mins} min`;
    
    let rank = "Novato";
    if (mins >= 60) rank = "Guerrero";
    if (mins >= 300) rank = "Maestro";
    if (mins >= 1000) rank = "Élite Zen";
    els.rankDisp.innerText = rank;
}

function saveEntry(goal, completed) {
    const log = JSON.parse(localStorage.getItem('absoluteLog')) || [];
    const duration = Math.floor(totalTime / 60);
    const newEntry = {
        goal: goal || "Misión sin nombre",
        completed,
        duration: completed ? duration : 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    log.push(newEntry);
    localStorage.setItem('absoluteLog', JSON.stringify(log));
    loadData();
}

function renderEntry(entry) {
    const li = document.createElement('li');
    li.className = `log-item ${entry.completed ? '' : 'failed'}`;
    li.innerHTML = `
        <span><strong>${entry.completed ? '✓' : '×'}</strong> ${entry.goal}</span>
        <span style="color:#444; font-size:0.75rem;">${entry.completed ? entry.duration + 'm' : 'ABORT'} | ${entry.time}</span>
    `;
    els.logList.prepend(li);
}

// --- INTUICIÓN MEJORADA: TIEMPO ---
function updateSelectedTime(seconds, sourceElement) {
    totalTime = seconds;
    timeLeft = totalTime;
    updateUI();
    
    els.modes.forEach(m => m.classList.remove('active'));
    if (sourceElement) sourceElement.classList.add('active');
    
    const mins = Math.floor(seconds / 60);
    els.status.innerText = `✅ Tiempo fijado en ${mins} min. ¡Ahora escribe tu meta!`;
    els.status.style.color = "var(--gold)";
}

els.setCustomBtn.addEventListener('click', () => {
    if (timerId) return;
    const val = parseInt(els.customInp.value);
    if (val > 0 && val <= 180) {
        updateSelectedTime(val * 60, null);
    } else {
        els.status.innerText = "⚠️ Error: Ingresa un valor entre 1 y 180.";
        els.status.style.color = "var(--red)";
    }
});

els.modes.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return;
        updateSelectedTime(parseInt(btn.dataset.time) * 60, btn);
    });
});

// --- AUDIO AMBIENTE ---
els.ambients.forEach(btn => {
    btn.addEventListener('click', () => {
        const sound = btn.dataset.sound;
        if (currentAmbient) { currentAmbient.pause(); currentAmbient.currentTime = 0; }
        els.ambients.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (sound !== 'none') {
            currentAmbient = document.getElementById(`amb-${sound}`);
            currentAmbient.play().catch(()=>{});
            els.status.innerText = "Atmósfera activada. Concentración máxima.";
        }
    });
});

// --- CORE LOGIC ---
function updateUI() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    els.timer.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    els.progress.style.width = `${(timeLeft / totalTime) * 100}%`;
}

function start() {
    if (timerId) return;
    
    if (!els.goal.value.trim()) {
        els.status.innerText = "⚠️ ALERTA: No has definido una meta para este tiempo.";
        els.status.style.color = "var(--red)";
        els.goal.focus();
        return;
    }

    els.mainBtn.disabled = true;
    els.goal.disabled = true;
    els.status.innerText = "Misión en curso. Mantén el enfoque.";
    els.status.style.color = "#fff";
    
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            document.getElementById('soundSuccess').play().catch(()=>{});
            saveEntry(els.goal.value, true);
            resetInterface("🎯 ¡Victoria! Meta alcanzada.");
        }
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', () => {
    if (timerId && confirm("¿Vas a rendirte? La disciplina se construye terminando lo que empiezas.")) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('soundFail').play().catch(()=>{});
        saveEntry(els.goal.value + " (Rendido)", false);
        timeLeft = totalTime;
        updateUI();
        resetInterface("Misión abortada. El historial no olvida.");
    }
});

function resetInterface(msg) {
    els.mainBtn.disabled = false;
    els.goal.disabled = false;
    els.goal.value = ""; 
    els.status.innerText = msg;
    els.status.style.color = "var(--gold)";
}

els.mainBtn.addEventListener('click', start);

document.getElementById('clearLog').addEventListener('click', () => {
    if(confirm("¿Deseas borrar todo tu historial?")) {
        localStorage.removeItem('absoluteLog');
        location.reload();
    }
});

// INICIO
loadData();
updateUI();