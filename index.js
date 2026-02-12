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
<<<<<<< HEAD
    ambients: document.querySelectorAll('.ambient-btn')
=======
    ambients: document.querySelectorAll('.ambient-btn'),
    status: document.getElementById('status')
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
};

// --- PERSISTENCIA BLINDADA ---
function loadData() {
    const log = JSON.parse(localStorage.getItem('absoluteLog')) || [];
<<<<<<< HEAD
    els.logList.innerHTML = ''; // Limpiar UI antes de recargar
=======
    els.logList.innerHTML = ''; 
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
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
<<<<<<< HEAD
    loadData(); // Refrescar UI y Stats
=======
    loadData();
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
}

function renderEntry(entry) {
    const li = document.createElement('li');
    li.className = `log-item ${entry.completed ? '' : 'failed'}`;
    li.innerHTML = `
        <span><strong>${entry.completed ? '✓' : '×'}</strong> ${entry.goal}</span>
<<<<<<< HEAD
        <span style="color:#444; font-size:0.7rem;">${entry.completed ? entry.duration + 'm' : 'ABORT'} | ${entry.time}</span>
=======
        <span style="color:#444; font-size:0.75rem;">${entry.completed ? entry.duration + 'm' : 'ABORT'} | ${entry.time}</span>
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
    `;
    els.logList.prepend(li);
}

<<<<<<< HEAD
// --- CONTROL DE TIEMPO ---
els.setCustomBtn.addEventListener('click', () => {
    if (timerId) return;
    const val = parseInt(els.customInp.value);
    if (isNaN(val)) return alert("Ingresa un número válido");
    if (val > 0 && val <= 180) {
        totalTime = val * 60;
        timeLeft = totalTime;
        updateUI();
        els.modes.forEach(m => m.classList.remove('active'));
=======
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
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
    }
});

els.modes.forEach(btn => {
    btn.addEventListener('click', () => {
        if (timerId) return;
<<<<<<< HEAD
        els.modes.forEach(m => m.classList.remove('active'));
        btn.classList.add('active');
        totalTime = parseInt(btn.dataset.time) * 60;
        timeLeft = totalTime;
        updateUI();
=======
        updateSelectedTime(parseInt(btn.dataset.time) * 60, btn);
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
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
<<<<<<< HEAD
=======
            els.status.innerText = "Atmósfera activada. Concentración máxima.";
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
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
<<<<<<< HEAD
    if (timerId || !els.goal.value.trim()) {
        document.getElementById('status').innerText = "Define tu misión primero.";
        return;
    }
    els.mainBtn.disabled = true;
    els.goal.disabled = true;
    document.getElementById('status').innerText = "Enfoque absoluto activado.";
=======
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
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
    
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            document.getElementById('soundSuccess').play().catch(()=>{});
            saveEntry(els.goal.value, true);
<<<<<<< HEAD
            resetInterface("Victoria registrada.");
=======
            resetInterface("🎯 ¡Victoria! Meta alcanzada.");
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
        }
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', () => {
<<<<<<< HEAD
    if (timerId && confirm("¿Abortar misión? Esto quedará registrado como una retirada.")) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('soundFail').play().catch(()=>{});
        saveEntry(els.goal.value + " (Interrumpido)", false);
        timeLeft = totalTime;
        updateUI();
        resetInterface("Misión abortada.");
=======
    if (timerId && confirm("¿Vas a rendirte? La disciplina se construye terminando lo que empiezas.")) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('soundFail').play().catch(()=>{});
        saveEntry(els.goal.value + " (Rendido)", false);
        timeLeft = totalTime;
        updateUI();
        resetInterface("Misión abortada. El historial no olvida.");
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
    }
});

function resetInterface(msg) {
    els.mainBtn.disabled = false;
    els.goal.disabled = false;
<<<<<<< HEAD
    document.getElementById('status').innerText = msg;
=======
    els.goal.value = ""; 
    els.status.innerText = msg;
    els.status.style.color = "var(--gold)";
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
}

els.mainBtn.addEventListener('click', start);

document.getElementById('clearLog').addEventListener('click', () => {
<<<<<<< HEAD
    if(confirm("¿Deseas resetear tu historial de vida? Esto es irreversible.")) {
=======
    if(confirm("¿Deseas borrar todo tu historial?")) {
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
        localStorage.removeItem('absoluteLog');
        location.reload();
    }
});

<<<<<<< HEAD
// INICIALIZACIÓN
loadData();
updateUI();
=======
// INICIO
loadData();
updateUI();
>>>>>>> b6b25a7654fe256d04afb45612331092ffa3d4c7
