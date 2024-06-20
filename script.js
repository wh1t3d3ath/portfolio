// Splash Screen
window.addEventListener('load', function () {
    setTimeout(function () {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.opacity = '0'; // Start fade out
        setTimeout(function() {
            splashScreen.style.display = 'none'; // Fully hide after fade out
            document.body.style.overflow = 'auto'; // Enable scrolling after splash screen is hidden
        }, 1000); // This should match the CSS transition time
    }, 2000);  // Delay before starting the fade out
    setInitialTheme(); // Set the initial theme based on system preference
});

function triggerPulseEffect() {
    const targetElement = document.getElementById('target-element-id'); // Replace 'target-element-id' with the actual ID
    targetElement.classList.add('pulse-effect');
}


//Hamburger Menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    if (menu.classList.contains("open")) {
        // Menu is currently open, start the close animation
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';

        // Wait for the animation to finish before hiding the menu
        setTimeout(() => {
            menu.classList.remove("open");
        }, 500); // Match the duration of the CSS transition
    } else {
        // Menu is closed, open it with animation
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
        menu.classList.add("open");
    }

    icon.classList.toggle("open");
    }

// Dark / Light Mode Toggle
const btn = document.getElementById("modeToogle");
const btn2 = document.getElementById("modeToogle2");
const themeIcons = document.querySelectorAll(".icon");

function setInitialTheme() {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localStorage.getItem("themeChangedManually")) {
        // Use saved theme only if the user has manually changed it before
        setTheme();
    } else {
        // Automatically adjust to system theme
        if (isSystemDarkMode) {
            setDarkMode();
        } else {
            setLightMode();
        }
    }
    applySplashTheme(); // Apply theme to splash screen
}

function applySplashTheme() {
    const splashScreen = document.getElementById('splash-screen');
    const isDarkMode = document.body.getAttribute("theme") === "dark";
    if (isDarkMode) {
        splashScreen.style.backgroundColor = "rgb(29, 29, 29)"; // Dark background color
    } else {
        splashScreen.style.backgroundColor = "white"; // Light background color
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem("themeChangedManually")) {
        // Only auto-switch if the user hasn't manually set the theme
        if (e.matches) {
            setDarkMode();
        } else {
            setLightMode();
        }
    }
});

btn.addEventListener("click", function () {
    localStorage.setItem("themeChangedManually", "true");
    toggleTheme();
});
btn2.addEventListener("click", function () {
    localStorage.setItem("themeChangedManually", "true");
    toggleTheme();
});

function toggleTheme() {
    let currentTheme = document.body.getAttribute("theme");
    if (currentTheme === "dark") {
        setLightMode();
    } else {
        setDarkMode();
    }
}

function setDarkMode() {
    document.body.setAttribute("theme", "dark");
    localStorage.setItem("theme", "dark");
    themeIcons.forEach(icon => {
        icon.src = icon.getAttribute("src-dark");
    });
    applySplashTheme();
}

function setLightMode() {
    document.body.setAttribute("theme", "light");
    localStorage.setItem("theme", "light");
    themeIcons.forEach(icon => {
        icon.src = icon.getAttribute("src-light");
    });
    applySplashTheme();
}

function setTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        setDarkMode();
    } else {
        setLightMode();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Function to show the dropdown
    function showDropdown() {
        dropdownContent.style.display = 'block';
        dropdownContent.style.opacity = '1';
        dropdownContent.style.transform = 'translateY(0)';
        dropdownContent.style.pointerEvents = 'auto'; // Allow interactions
    }

    // Function to hide the dropdown
    function hideDropdown() {
        dropdownContent.style.display = 'none';
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
        dropdownContent.style.pointerEvents = 'none'; // Prevent interactions
    }

    // Toggle dropdown on button click
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from bubbling
        const isVisible = dropdownContent.style.display === 'block';
        if (isVisible) {
            hideDropdown();
        } else {
            showDropdown();
        }
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            hideDropdown();
        }
    });
});

// Dropdown Animation
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdown.addEventListener('mouseenter', () => {
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
        }, 10); // Delay slightly to allow CSS to reset
    });

    dropdown.addEventListener('mouseleave', () => {
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
    });
});

// Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        console.log(entries); // Log entries to see what's being observed
        entries.forEach(entry => {
            console.log(entry.target, 'is intersecting:', entry.isIntersecting);
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.5 // Adjust this value based on when you want the animation to trigger
    });

    document.querySelectorAll('.animated').forEach(el => {
        observer.observe(el);
    });
});

// Navigation Links Animation
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    console.log(navLinks); // Check if elements are selected correctly
    navLinks.forEach(link => {
        link.classList.add('visible'); // Ensure this line is executing
    });
});

// Function to toggle dropdown visibility
function toggleDropdown(show) {
  const dropdownContent = document.querySelector('.dropdown-content');
  if (show) {
    dropdownContent.style.display = 'block';
    dropdownContent.style.opacity = '1';
    dropdownContent.style.transform = 'translateY(0)';
    dropdownContent.style.pointerEvents = 'auto';
  } else {
    dropdownContent.style.display = 'none';
    dropdownContent.style.opacity = '0';
    dropdownContent.style.transform = 'translateY(-10px)';
    dropdownContent.style.pointerEvents = 'none';
  }
}

// Handle button click
document.getElementById('downloadCvButton').addEventListener('click', function(event) {
  event.stopPropagation(); // Stop event from bubbling at the start
  const isActive = this.classList.contains('active');
  toggleDropdown(!isActive);
  this.classList.toggle('active', !isActive);
});

// Close the dropdown if clicked outside
document.addEventListener('click', function(event) {
  const button = document.getElementById('downloadCvButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  if (!button.contains(event.target) && !dropdownContent.contains(event.target)) {
    toggleDropdown(false);
    button.classList.remove('active');
  }
});

// Optional: Handle hover out on desktop
document.querySelector('.dropdown').addEventListener('mouseleave', function() {
  if (window.innerWidth > 768) { // Assuming 768px as a breakpoint for desktop
    toggleDropdown(false);
  }
});

// Handle touch events for mobile devices
document.getElementById('downloadCvButton').addEventListener('touchstart', function(event) {
  event.stopPropagation(); // Stop event from bubbling at the start
  const isActive = this.classList.contains('active');
  toggleDropdown(!isActive);
  this.classList.toggle('active', !isActive);
});

document.addEventListener('touchstart', function(event) {
  const button = document.getElementById('downloadCvButton');
  const dropdownContent = document.querySelector('.dropdown-content');
  if (!button.contains(event.target) && !dropdownContent.contains(event.target)) {
    toggleDropdown(false);
    button.classList.remove('active');
  }
});

// Add event listeners to dropdown options
document.querySelectorAll('.dropdown-content a').forEach(item => {
  item.addEventListener('click', function() {
    // Handle the click event
    console.log('Dropdown option clicked!');
  });
});

document.addEventListener('DOMContentLoaded', function () {
    const downloadCvButton = document.getElementById('downloadCvButton');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Explicitly set initial state to ensure synchronization
    function initializeDropdown() {
        dropdownContent.style.display = 'none';
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
    }

    // Call the initialization function when the document is ready
    initializeDropdown();

    // Function to toggle dropdown visibility
    function toggleDropdown() {
        const isVisible = dropdownContent.style.display === 'block';
        if (isVisible) {
            dropdownContent.style.display = 'none';
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
        } else {
            dropdownContent.style.display = 'block';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
        }
    }

    // Toggle dropdown on button click
    downloadCvButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from bubbling
        toggleDropdown();
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!downloadCvButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
        }
    });
});