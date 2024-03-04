// Hamburger Menu

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Dark Mode

let btn = document.getElementById("btn");
let btnText = document.getElementById("btnText");
let btnIcon = document.getElementById("btnIcon")


btn.onclick = function(){
  document.body.classList.toggle("dark-theme");
  if(document.body.classList.contains(dark-theme)){
    btnIcon.src = "<./assets/sun-solid.svg>";
    btnText.innerHTML = "Light";
  }
  else{
    btnIcon.src = "./aseets/moon-solid.svg"
    btnText.innerHTML = "Dark";
  }
}