// Hamburger Menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Dark / Light Mode
const btn = document.getElementById("modeToogle")
const btn2 = document.getElementById("modeToogle2")
const themeIcons = document.querySelectorAll(".icon");
let isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    isSystemDarkMode = e.matches;
    setTheme();
});

if(localStorage.getItem("theme") === "dark"){
  setDarkMode();
};

btn.addEventListener("click" , function(){
  localStorage.setItem("themeChangedManually", "true");
  setTheme();
})
btn2.addEventListener("click" , function(){
  localStorage.setItem("themeChangedManually", "true");
  setTheme();
})

function setTheme(){
  let currentTheme = document.body.getAttribute("theme")
  let themeChangedManually = localStorage.getItem("themeChangedManually");

  if(themeChangedManually !== "true"){
    if(isSystemDarkMode){
      setDarkMode();
    } else {
      setLightMode();
    }
  } else if(currentTheme === "dark"){
    setLightMode();
  } else {
    setDarkMode();
  }
};

function setDarkMode(){
  document.body.setAttribute("theme" , "dark");
  localStorage.setItem("theme" , "dark");
  themeIcons.forEach((icon) => (
    icon.src = icon.getAttribute("src-dark")
  ))
};

function setLightMode(){
  document.body.removeAttribute("theme");
  localStorage.setItem("theme" , "light");
  themeIcons.forEach((icon) => (
    icon.src = icon.getAttribute("src-light")
  ))
};
