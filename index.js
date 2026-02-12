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
    ambients: document.querySelectorAll('.ambient-btn')
};

// --- PERSISTENCIA BLINDADA ---
function loadData() {
    const log = JSON.parse(localStorage.getItem('absoluteLog')) || [];
    els.logList.innerHTML = ''; // Limpiar UI antes de recargar
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
    loadData(); // Refrescar UI y Stats
}

function renderEntry(entry) {
    const li = document.createElement('li');
    li.className = `log-item ${entry.completed ? '' : 'failed'}`;
    li.innerHTML = `
        <span><strong>${entry.completed ? '✓' : '×'}</strong> ${entry.goal}</span>
        <span style="color:#444; font-size:0.7rem;">${entry.completed ? entry.duration + 'm' : 'ABORT'} | ${entry.time}</span>
    `;
    els.logList.prepend(li);
}

// --- CONTROL DE TIEMPO ---
els.setCustomBtn.addEventListener('click', () => {
    if (timerId) return;
    const val = parseInt(els.customInp.value);
    if (val > 0 && val <= 180) {
        totalTime = val * 60;
        timeLeft = totalTime;
        updateUI();
        els.modes.forEach(m => m.classList.remove('active'));
    }
});

els.modes.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return;
        els.modes.forEach(m => m.classList.remove('active'));
        btn.classList.add('active');
        totalTime = parseInt(btn.dataset.time) * 60;
        timeLeft = totalTime;
        updateUI();
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
    if (timerId || !els.goal.value.trim()) {
        document.getElementById('status').innerText = "Define tu misión primero.";
        return;
    }
    els.mainBtn.disabled = true;
    els.goal.disabled = true;
    document.getElementById('status').innerText = "Enfoque absoluto activado.";
    
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            document.getElementById('soundSuccess').play().catch(()=>{});
            saveEntry(els.goal.value, true);
            resetInterface("Victoria registrada.");
        }
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', () => {
    if (timerId && confirm("¿Abortar misión? Esto quedará registrado como una retirada.")) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('soundFail').play().catch(()=>{});
        saveEntry(els.goal.value + " (Interrumpido)", false);
        timeLeft = totalTime;
        updateUI();
        resetInterface("Misión abortada.");
    }
});

function resetInterface(msg) {
    els.mainBtn.disabled = false;
    els.goal.disabled = false;
    document.getElementById('status').innerText = msg;
}

els.mainBtn.addEventListener('click', start);

document.getElementById('clearLog').addEventListener('click', () => {
    if(confirm("¿Deseas resetear tu historial de vida? Esto es irreversible.")) {
        localStorage.removeItem('absoluteLog');
        location.reload();
    }
});

// INICIALIZACIÓN
loadData();
updateUI();
