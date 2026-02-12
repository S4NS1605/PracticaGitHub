// CONFIGURACIÓN MAESTRA
let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;
let isPaused = false;
let currentAmbient = null;

const els = {
    timer: document.getElementById('timer'),
    progress: document.getElementById('progressBar'),
    goal: document.getElementById('goalInput'),
    mainBtn: document.getElementById('mainButton'),
    totalTimeDisp: document.getElementById('totalFocusTime'),
    rankDisp: document.getElementById('rankStatus'),
    successRateDisp: document.getElementById('successRate'),
    customInp: document.getElementById('customMin'),
    setCustomBtn: document.getElementById('setCustomTime'),
    logList: document.getElementById('sessionLog'),
    modes: document.querySelectorAll('.mode-btn'),
    ambients: document.querySelectorAll('.ambient-btn'),
    status: document.getElementById('status')
};

// --- PERSISTENCIA Y ANALÍTICA ---
function loadData() {
    const log = JSON.parse(localStorage.getItem('absoluteLog')) || [];
    els.logList.innerHTML = ''; 
    log.forEach(entry => renderEntry(entry));
    updateAnalytics(log);
}

function updateAnalytics(log) {
    const completedSessions = log.filter(e => e.completed);
    const mins = completedSessions.reduce((acc, curr) => acc + curr.duration, 0);
    els.totalTimeDisp.innerText = `${mins} min`;
    
    if (log.length > 0) {
        const rate = Math.round((completedSessions.length / log.length) * 100);
        els.successRateDisp.innerText = `${rate}%`;
        if (rate >= 80) els.successRateDisp.classList.add('success-glow');
        else els.successRateDisp.classList.remove('success-glow');
    }

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
        <span style="color:#444;">${entry.completed ? entry.duration + 'm' : 'FALLO'}</span>
    `;
    els.logList.prepend(li);
}

// --- CONTROLES DEL TIEMPO ---
function setTime(seconds, btn) {
    if (timerId) return;
    totalTime = seconds;
    timeLeft = totalTime;
    updateUI();
    els.modes.forEach(m => m.classList.remove('active'));
    if (btn) btn.classList.add('active');
    els.status.innerText = `Listo para ${Math.floor(seconds/60)} minutos. Define tu misión.`;
}

els.modes.forEach(btn => btn.addEventListener('click', () => setTime(parseInt(btn.dataset.time) * 60, btn)));

els.setCustomBtn.addEventListener('click', () => {
    const val = parseInt(els.customInp.value);
    if (val > 0 && val <= 180) setTime(val * 60, null);
    else els.status.innerText = "Ingresa entre 1 y 180 min.";
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
            if (timerId && !isPaused) currentAmbient.play().catch(()=>{});
        } else {
            currentAmbient = null;
        }
    });
});

// --- seccion de (START / PAUSE / RESUME) ---
function updateUI() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    els.timer.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    els.progress.style.width = `${(timeLeft / totalTime) * 100}%`;
}

function handleMainAction() {
    if (!timerId) {
        startSession();
    } else {
        togglePause();
    }
}

function startSession() {
    if (!els.goal.value.trim()) {
        els.status.innerText = "⚠️ ERROR: Escribe tu meta primero.";
        els.goal.focus();
        return;
    }
    
    isPaused = false;
    els.goal.disabled = true;
    els.mainBtn.innerText = "Pausar";
    els.status.innerText = "Enfoque absoluto activado.";
    if (currentAmbient) currentAmbient.play().catch(()=>{});

    timerId = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateUI();
            if (timeLeft <= 0) {
                finishSession();
            }
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        els.mainBtn.innerText = "Reanudar";
        els.mainBtn.style.background = "#fff";
        els.timer.style.color = "#444";
        els.status.innerText = "Sesión pausada. El mundo espera.";
        if (currentAmbient) currentAmbient.pause();
    } else {
        els.mainBtn.innerText = "Pausar";
        els.mainBtn.style.background = "var(--gold)";
        els.timer.style.color = "#fff";
        els.status.innerText = "Enfoque reanudado.";
        if (currentAmbient) currentAmbient.play().catch(()=>{});
    }
}

function finishSession() {
    clearInterval(timerId);
    timerId = null;
    document.getElementById('soundSuccess').play().catch(()=>{});
    saveEntry(els.goal.value, true);
    resetInterface("¡Victoria! Meta alcanzada.");
}

els.mainBtn.addEventListener('click', handleMainAction);

document.getElementById('resetButton').addEventListener('click', () => {
    if (timerId && confirm("¿Vas a rendirte? Quedará registrado.")) {
        clearInterval(timerId);
        timerId = null;
        if (currentAmbient) { currentAmbient.pause(); currentAmbient.currentTime = 0; }
        document.getElementById('soundFail').play().catch(()=>{});
        saveEntry(els.goal.value + " (Rendido)", false);
        resetInterface("Misión abortada.");
        timeLeft = totalTime;
        updateUI();
    }
});

function resetInterface(msg) {
    els.mainBtn.innerText = "Ejecutar";
    els.mainBtn.style.background = "var(--gold)";
    els.timer.style.color = "#fff";
    els.goal.disabled = false;
    els.goal.value = "";
    els.status.innerText = msg;
}

document.getElementById('clearLog').addEventListener('click', () => {
    if(confirm("¿Borrar todo el historial?")) { localStorage.clear(); location.reload(); }
});

loadData();
updateUI();