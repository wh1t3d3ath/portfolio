// Theme Handling

// Get theme toggle buttons and theme icons
const btn = document.getElementById("modeToogle");
const btn2 = document.getElementById("modeToogle2");
const themeIcons = document.querySelectorAll(".icon");

/**
 * Set the initial theme based on system preference or local storage
 */
function setInitialTheme() {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = localStorage.getItem('theme') || (isSystemDarkMode ? 'dark' : 'light');
    document.body.setAttribute('theme', theme);
    applyThemeIcons(theme);
}

/**
 * Update theme icons based on the current theme
 * @param {string} theme - The current theme ('dark' or 'light')
 */
function applyThemeIcons(theme) {
    themeIcons.forEach(icon => {
        icon.src = theme === 'dark' ? icon.getAttribute("src-dark") : icon.getAttribute("src-light");
    });
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('theme', newTheme); // Set the theme attribute to the new theme

    // Optionally, save the new theme to localStorage if you want to preserve the theme across sessions
    localStorage.setItem('theme', newTheme);
}

// Event listeners for theme toggle buttons
function setupThemeToggleButton() {
    const toggleButtons = [document.getElementById('modeToggle'), document.getElementById('modeToggle2')];

    // Function to handle both click and touch events
    function toggleThemeHandler(event) {
        event.preventDefault(); // Prevent default behavior like scrolling on touch devices
        toggleTheme();
    }

    // Add event listeners for both click and touchstart
    toggleButtons.forEach(button => {
        if (button) { // Check if the button exists
            button.addEventListener('click', toggleThemeHandler);
            button.addEventListener('touchstart', toggleThemeHandler);
        }
    });
}

document.addEventListener('DOMContentLoaded', setupThemeToggleButton);

// Listen for system theme changes and update accordingly
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.body.setAttribute('theme', newTheme);
    applyThemeIcons(newTheme);
});

// Set theme on DOM content loaded
document.addEventListener('DOMContentLoaded', setInitialTheme);

// Apply initial theme on page load
function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' if no theme is saved
    document.body.classList.add(savedTheme + '-theme');
}

// Apply the initial theme on page load
window.addEventListener('load', function() {
    applyInitialTheme();
    setTimeout(function() {
        hideSplashScreen();
    }, 2000); // Adjust the delay as needed
});

// Menu Handling

/**
 * Toggle the visibility of the menu
 */
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.contains("open");

    if (isOpen) {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            menu.classList.remove("open");
        }, 300); // Delay should match the CSS transition time
    } else {
        menu.classList.add("open");
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
    }

    icon.classList.toggle("open");
}

// Dropdown menu handling

/**
 * Handle dropdown menu visibility
 */
document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const downloadCvButton = document.getElementById('downloadCvButton');

    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        const isVisible = dropdownContent.style.display === 'block';
        if (!isVisible) {
            dropdownContent.style.display = 'block';
            setTimeout(() => {
                dropdownContent.style.opacity = '1';
                dropdownContent.style.transform = 'translateY(0)';
                dropdownContent.style.pointerEvents = 'auto';
            }, 10); // Delay to allow CSS to react
        } else {
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdownContent.style.display = 'none';
                dropdownContent.style.pointerEvents = 'none';
            }, 300); // Match the duration of the CSS transition
        }
    });

    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            dropdownContent.style.pointerEvents = 'none';
            downloadCvButton.classList.remove('active'); // Remove 'active' class when clicking outside
        }
    });
});

// Animations and Effects

/**
 * Add intersection observer to animate elements on scroll
 */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { rootMargin: '0px', threshold: 0.3 });

    const sections = document.querySelectorAll('.animated');
    sections.forEach(section => observer.observe(section));

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.add('visible'));
});

/**
 * Add interesting animations on scroll
 */
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1  // Adjust this as needed
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.target && entry.target.classList) { // Check if the target and classList exist
                entry.target.classList.toggle('visible', entry.isIntersecting);
                entry.target.classList.toggle('not-visible', !entry.isIntersecting);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(element => {
        if (element) { // Check if the element exists
            observer.observe(element);
        }
    });
});

/**
 * Trigger pulse effect on a target element
 */
function triggerPulseEffect() {
    const targetElement = document.getElementById('target-element-id');
    targetElement.classList.add('pulse-effect');
}

// Utility Functions

/**
 * Update the current year in the footer
 */
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('current-year');
    yearSpan.textContent = new Date().getFullYear();
});

/**
 * Update age based on birthdate
 */
function updateAge() {
    const birthdate = new Date('2004-05-25'); // Set your birthdate here (YYYY-MM-DD)
    const diff = Date.now() - birthdate.getTime();
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    document.getElementById('age').textContent = age;
}

document.addEventListener('DOMContentLoaded', updateAge);

// Scroll to Top Function

/**
 * Scroll to the top of the page smoothly
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/Hide Back to Top Button

/**
 * Show or hide the back to top button based on scroll position
 */
window.addEventListener('scroll', function() {
  const backToTopButton = document.getElementById('back-to-top');
  if (window.scrollY > 300) { // Show button after scrolling down 300px
    backToTopButton.classList.add('show-back-to-top');
  } else {
    backToTopButton.classList.remove('show-back-to-top');
  }
});

// Function to hide splash screen and show profile animations

/**
 * Hide the splash screen and show profile animations
 */
function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const profileSection = document.getElementById('profile');

    splashScreen.addEventListener('transitionend', () => {
        splashScreen.style.display = 'none';
        profileSection.classList.add('visible');

        // Initialize AOS for the profile section
        AOS.init({
            duration: 1000,
            once: false,
        });

        // Refresh AOS to ensure proper calculations
        AOS.refresh();
    });

    // Start the splash screen hide transition
    splashScreen.style.opacity = '0';
}

// Apply the initial theme on page load
function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' if no theme is saved
    document.body.classList.add(savedTheme + '-theme');
}

// Hide splash screen and show profile animations after a delay
window.addEventListener('load', function() {
    applyInitialTheme();
    setTimeout(function() {
        hideSplashScreen();
    }, 2000); // Adjust the delay as needed
});

// Hide splash screen and show profile animations after a delay
window.addEventListener('load', function() {
    setTimeout(function() {
        hideSplashScreen();
    }, 2000); // Adjust the delay as needed
});

/**
 * Hide the splash screen and enable scrolling after a delay
 */
window.addEventListener('load', function () {
    setTimeout(function () {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.opacity = '0';
        setTimeout(function() {
            splashScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 2000);
});

// Show arrow at the bottom of the section
window.addEventListener('scroll', function() {
    const arrow = document.querySelector('.icon.arrow');
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        arrow.style.display = 'block'; // Ensure it's set to block not none
    } else {
        arrow.style.display = 'none';
    }
});

// Smooth scrolling for arrows
document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.addEventListener('click', function() {
        const href = this.getAttribute('onclick').match(/'#([^']+)'/)[1];
        const section = document.getElementById(href);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const indicators = document.querySelectorAll('.scroll-indicator');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Adjust this value as needed
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const indicator = entry.target.querySelector('.scroll-indicator');
            if (entry.isIntersecting) {
                indicator.classList.add('visible');
            } else {
                indicator.classList.remove('visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));

    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
