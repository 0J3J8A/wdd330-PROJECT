// CURRENT YEAR & LAST MODIFIED
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastmodification").textContent = document.lastModified;

// Charge DOM
document.addEventListener('DOMContentLoaded', function () {
  // -------------------- HAMBURGER MENU --------------------
  const menu = document.getElementById('MAIN_MENU');
  const hamburger = document.getElementById('h_menu');

  hamburger.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.toggle('menu-open');
  });
});