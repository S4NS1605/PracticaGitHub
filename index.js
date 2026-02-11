const mainButton = document.getElementById('mainButton');
const statusText = document.getElementById('status');
const goalInput = document.getElementById('goalInput');
const goalText = document.getElementById('goalText');
const resetButton = document.getElementById('resetButton');

let sessionStarted = false;

mainButton.addEventListener('click', () => {

    if (!sessionStarted) {
        statusText.innerText = "Estado: Sesión iniciada.";
        goalInput.style.display = "block";
        mainButton.innerText = "Guardar Propósito";
        sessionStarted = true;
    } else {
        if (goalInput.value.trim() !== "") {
            statusText.innerText = "Estado: Enfocado en la ejecución.";
            goalText.innerText = "🎯 Propósito: " + goalInput.value;
            goalInput.value = "";
            resetButton.style.display = "inline-block";
        } else {
            alert("Por favor escribe un propósito.");
        }
    }

});

resetButton.addEventListener('click', () => {
    statusText.innerText = "Estado: En espera de acción.";
    goalText.innerText = "";
    goalInput.style.display = "none";
    mainButton.innerText = "Iniciar Sesión";
    resetButton.style.display = "none";
    sessionStarted = false;
});
