const btn = document.getElementById("mainButton");
const statusText = document.getElementById("status");
const time = document.getElementById("time");

btn.addEventListener("click", ()=>{

    statusText.textContent = "Estado: Enfocado trabajando...";
    statusText.style.color = "green";

    btn.textContent = "En progreso";
    btn.disabled = true;

});
