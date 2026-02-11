let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerId = null;
let currentAmbient = null;

const elements = {
    timerDisplay: document.getElementById('timer'),
    progressBar: document.getElementById('progressBar'),
    goalInput: document.getElementById('goalInput'),
    mainButton: document.getElementById('mainButton'),
    totalTimeDisplay: document.getElementById('totalFocusTime'),
    rankStatus: document.getElementById('rankStatus'),
    customMin: document.getElementById('customMin'),
    setCustomBtn: document.getElementById('setCustomTime'),
    sessionLog: document.getElementById('sessionLog'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    ambientBtns: document.querySelectorAll('.ambient-btn')
};

// --- RANGOS Y STATS ---
function updateMastery() {
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    const minutes = log.filter(e => e.completed).reduce((acc, curr) => acc + (curr.duration || 25), 0);
    
    elements.totalTimeDisplay.innerText = `${minutes} min`;
    
    let rank = "Novato";
    if (minutes > 60) rank = "Guerrero";
    if (minutes > 300) rank = "Maestro";
    if (minutes > 1000) rank = "Élite Zen";
    elements.rankStatus.innerText = rank;
}

// --- TIEMPO PERSONALIZADO ---
elements.setCustomBtn.addEventListener('click', () => {
    const val = parseInt(elements.customMin.value);
    if (val > 0 && val <= 120) {
        totalTime = val * 60;
        timeLeft = totalTime;
        updateUI();
        elements.modeBtns.forEach(b => b.classList.remove('active'));
    }
});

// --- AUDIO AMBIENTE ---
elements.ambientBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const sound = btn.dataset.sound;
        if (currentAmbient) { currentAmbient.pause(); currentAmbient.currentTime = 0; }
        elements.ambientBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (sound !== 'none') {
            currentAmbient = document.getElementById(`amb-${sound}`);
            currentAmbient.play().catch(() => {});
        }
    });
});

// --- CORE ---
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

function finish(completed) {
    const goal = elements.goalInput.value || "Misión";
    const log = JSON.parse(localStorage.getItem('focusLog')) || [];
    const duration = Math.floor(totalTime / 60);
    log.push({ goal, completed, duration, date: new Date().toLocaleTimeString() });
    localStorage.setItem('focusLog', JSON.stringify(log));
    
    const li = document.createElement('li');
    li.className = `log-item ${completed ? '' : 'failed'}`;
    li.innerHTML = `<strong>${completed ? '✓' : '×'} ${goal}</strong> (${duration}m)`;
    elements.sessionLog.prepend(li);
    
    if (completed) document.getElementById('soundSuccess').play().catch(()=>{});
    updateMastery();
    resetInt();
}

function start() {
    if (timerId || !elements.goalInput.value) return;
    elements.mainButton.disabled = true;
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) { clearInterval(timerId); timerId = null; finish(true); }
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', () => {
    if (timerId && confirm("¿Abortar misión?")) {
        clearInterval(timerId); timerId = null; finish(false);
        document.getElementById('soundFail').play().catch(()=>{});
    }
    timeLeft = totalTime; updateUI(); resetInt();
});

function resetInt() { elements.mainButton.disabled = false; elements.goalInput.disabled = false; }
elements.mainButton.addEventListener('click', start);
document.getElementById('clearLog').addEventListener('click', () => { localStorage.clear(); location.reload(); });

// Init
updateMastery();
updateUI();