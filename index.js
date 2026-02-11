// La lógica inicial: Interactividad básica
const mainButton = document.getElementById('mainButton');
const statusText = document.getElementById('status');

mainButton.addEventListener('click', () => {
    statusText.innerText = "Estado: Enfocado en la ejecución.";
    console.log("Sistema iniciado.");
});