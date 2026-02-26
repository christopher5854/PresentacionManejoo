document.addEventListener("DOMContentLoaded", () => {
  const stats = {
    Inteligencia: 80,
    Impulsividad: 95,
    "Manejo de Estrés": 15,
    Imperactividad: 80
  };

  const labels = document.querySelectorAll(".stat-label");
  const fills = document.querySelectorAll(".stat-fill");

  let i = 0;
  for (let key in stats) {
    labels[i].textContent = key + ": " + stats[key] + "%";
    fills[i].style.width = stats[key] + "%";
    i++;
  }
});
