// Theme Handling
const themeHandler = (() => {
  const getSystemPreference = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const setTheme = (theme) => {
    document.documentElement.setAttribute('theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    animateThemeTransition(theme);
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('theme') || getSystemPreference();
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const updateThemeIcon = (theme) => {
    const iconClass = `fas fa-${theme === 'dark' ? 'sun' : 'moon'} color-icon icons`;
    document.querySelectorAll('#modeToggle, #modeToggle2').forEach(icon => {
      if (icon) {
        icon.className = iconClass;
        icon.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => icon.style.transform = 'rotate(360deg) scale(1)', 250);
      }
    });
  };

  const animateThemeTransition = (theme) => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      opacity: '0', transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: '9999'
    });
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '0.3';
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => document.body.removeChild(overlay), 500);
      }, 300);
    });
  };

  const initTheme = () => setTheme(localStorage.getItem('theme') || getSystemPreference());

  return { initTheme, toggleTheme, setTheme };
})();

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  themeHandler.initTheme();
  // Other initialization code...
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  themeHandler.setTheme(e.matches ? "dark" : "light");
});

// Menu Handling
const menuHandler = (() => {
  const toggleMenu = () => {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.contains("open");

    menu.style.opacity = isOpen ? "0" : "1";
    menu.style.transform = `translateY(${isOpen ? "-10px" : "0"}) scale(${isOpen ? "0.98" : "1"})`;
    menu.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    icon.classList.toggle("open");
    icon.style.transition = "transform 0.4s ease";
    icon.style.transform = isOpen ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(1.05)";

    setTimeout(() => menu.classList.toggle("open"), isOpen ? 400 : 0);
  };

  const closeMenuOnResize = () => {
    if (window.innerWidth > 1200) {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      menu.classList.remove("open");
      icon.classList.remove("open");
      icon.style.transform = "rotate(0deg) scale(1)";
    }
  };

  return { toggleMenu, closeMenuOnResize };
})();

// Dropdown Menu Handling
const dropdownHandler = (() => {
  const setupDropdownMenu = () => {
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
    const downloadCvButton = document.getElementById("downloadCvButton");

    const toggleDropdown = (show) => {
      dropdownContent.classList.toggle('open', show);
      dropdownContent.style.display = show ? 'block' : 'none';
      if (show) setTimeout(() => dropdownContent.classList.add('open'), 10);
    };

    dropdown.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDropdown(dropdownContent.style.display !== "block");
    });

    dropdown.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDropdown(dropdownContent.style.display !== "block");
      }
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        toggleDropdown(false);
        downloadCvButton.classList.remove("active");
      }
    });
  };

  return { setupDropdownMenu };
})();

// Animations and Effects
const animationHandler = (() => {
  const setupScrollAnimations = () => {
    if (window.innerWidth <= 768) {
      document.querySelectorAll(".animated, .animate-on-scroll").forEach((element) => {
        element.classList.add("visible");
        element.classList.remove("not-visible");
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target && entry.target.classList) {
          entry.target.classList.toggle("visible", entry.isIntersecting);
          entry.target.classList.toggle("not-visible", !entry.isIntersecting);
        }
      });
    }, { rootMargin: "0px", threshold: 0.2 });

    document.querySelectorAll(".animated, .animate-on-scroll").forEach((element) => {
      if (element) {
        element.classList.add("not-visible");
        observer.observe(element);
      }
    });
  };

  return { setupScrollAnimations };
})();

// Utility Functions
const utilityFunctions = (() => {
  const updateCurrentYear = () => {
    document.getElementById("current-year").textContent = new Date().getFullYear();
  };

  const updateAge = () => {
    const birthdate = new Date("2004-05-25");
    const age = Math.floor((Date.now() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
    document.getElementById("age").textContent = age;
  };

  return { updateCurrentYear, updateAge };
})();

// Scroll to Top Function
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// Splash Screen and Initial Theme
const splashScreenHandler = (() => {
  const hideSplashScreen = () => {
    const splashScreen = document.getElementById("splash-screen");
    const profileSection = document.getElementById("profile");

    splashScreen.addEventListener("transitionend", () => {
      splashScreen.style.display = "none";
      profileSection.classList.add("visible");
    });

    splashScreen.style.opacity = "0";
    splashScreen.style.transition = "opacity 1s ease";
  };

  const applyInitialTheme = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDarkScheme ? 'dark' : 'light');
    
    document.documentElement.setAttribute('theme', initialTheme);
    document.body.classList.add(`${initialTheme}-theme`);
    
    document.querySelectorAll('#modeToggle, #modeToggle2').forEach(icon => {
      if (icon) {
        icon.className = `fas fa-${initialTheme === 'dark' ? 'sun' : 'moon'} color-icon icons`;
      }
    });
  };

  applyInitialTheme();

  return { hideSplashScreen, applyInitialTheme };
})();

// Arrow Navigation
const arrowNavigationHandler = (() => {
  const setupArrowNavigation = () => {
    const arrow = document.querySelector(".icon.arrow");
    const handleScroll = () => {
      const shouldShow = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      arrow.style.opacity = shouldShow ? "1" : "0";
      arrow.style.transform = `translateY(${shouldShow ? "0" : "20px"}) scale(${shouldShow ? "1" : "0.8"})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", function () {
        const href = this.getAttribute("onclick").match(/'#([^']+)'/)[1];
        const section = document.getElementById(href);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  };

  return { setupArrowNavigation };
})();

// Scroll Indicators
const scrollIndicatorHandler = (() => {
  const setupScrollIndicators = () => {
    document.addEventListener("click", function (event) {
      const indicator = event.target.closest(".scroll-indicator");
      if (indicator) {
        const targetSection = document.querySelector(indicator.getAttribute("data-target"));
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  };

  return { setupScrollIndicators };
})();

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  themeHandler.initTheme();
  utilityFunctions.updateAge();
  dropdownHandler.setupDropdownMenu();
  animationHandler.setupScrollAnimations();
  utilityFunctions.updateCurrentYear();
  arrowNavigationHandler.setupArrowNavigation();
  scrollIndicatorHandler.setupScrollIndicators();
  initializeScrollReveal();

  document.querySelectorAll(".icons").forEach((icon) => {
    const label = icon.getAttribute("aria-label") || icon.getAttribute("title") || icon.textContent;
    if (!icon.getAttribute("aria-label")) {
      icon.setAttribute("aria-label", label);
    }
  });

  const hamburgerIcon = document.querySelector(".hamburger-icon");
  if (hamburgerIcon) {
    hamburgerIcon.addEventListener("click", menuHandler.toggleMenu);
  }

  document.querySelectorAll('#modeToggle, #modeToggle2, .hamburger-menu .fa-adjust').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      themeHandler.toggleTheme();
    });
  });
});

window.addEventListener("resize", menuHandler.closeMenuOnResize);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  themeHandler.setTheme(e.matches ? "dark" : "light");
});

// Optimize scroll event listener
const handleScroll = (() => {
  let lastKnownScrollPosition = 0;
  let ticking = false;

  const updateBackToTopButton = (scrollPos) => {
    const backToTopButton = document.getElementById("back-to-top");
    backToTopButton.classList.toggle("show", scrollPos > 300);
  };

  return () => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBackToTopButton(lastKnownScrollPosition);
        ticking = false;
      });
      ticking = true;
    }
  };
})();

window.addEventListener("scroll", handleScroll, { passive: true });

window.addEventListener("load", () => {
  splashScreenHandler.applyInitialTheme();
  setTimeout(splashScreenHandler.hideSplashScreen, 2000);
  setTimeout(() => document.body.style.overflow = "auto", 3000);
});

// ScrollReveal Animations
// ScrollReveal Animations
const initializeScrollReveal = () => {
  const isMobile = window.innerWidth <= 768;

  document.querySelectorAll('#contact .icons, #contact .contact-icon').forEach(icon => {
    Object.assign(icon.style, { opacity: '1', transform: 'none', transition: 'none' });
  });

  if (isMobile) {
    document.querySelectorAll('#contact .contact-item p').forEach(text => {
      text.style.display = 'none';
    });
    return;
  }

  const sr = ScrollReveal({
    distance: "20px",
    duration: 600,
    delay: 50,
    reset: true,
    mobile: false,
    useDelay: "onload",
    viewFactor: 0.2,
    viewOffset: { top: 50, right: 0, bottom: 50, left: 0 },
    easing: "ease-out",
  });

  const getConfig = (desktopConfig) => ({ ...desktopConfig, duration: 600, delay: 50 });

  // Navigation
  sr.reveal('nav .logo', getConfig({ origin: 'left', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('nav .nav-links li', getConfig({ origin: 'top', interval: 100, distance: '20px', opacity: 0, scale: 0.95 }));

  // Profile Section
  sr.reveal('#profile .section__text__p1', getConfig({ origin: 'left', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#profile .title', getConfig({ origin: 'right', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#profile .section__text__p2', getConfig({ origin: 'left', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#profile .btn-container', getConfig({ origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#profile #socials-container', getConfig({ origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#profile .lottie-container', getConfig({ origin: 'right', distance: '50px', opacity: 0, scale: 0.9 }));

  // About Section
  sr.reveal('#about .section__text__p1', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#about .title', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#about .lottie-container', getConfig({ origin: 'left', distance: '50px', opacity: 0, scale: 0.9 }));
  sr.reveal('#about .about-containers', getConfig({ origin: 'right', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#about .text-container', getConfig({ origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 }));

  // Experience Section
  sr.reveal('#experience .section__text__p1', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#experience .title', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#experience .experience-details-container', getConfig({ origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#experience .article-container article', getConfig({ origin: 'bottom', interval: 100, distance: '20px', opacity: 0, scale: 0.95 }));

  // Projects Section
  sr.reveal('#projects .section__text__p1', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#projects .title', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#projects .color-container', getConfig({ origin: 'bottom', interval: 200, distance: '30px', opacity: 0, scale: 0.95 }));

  // Contact Section
  sr.reveal('#contact .section__text__p1', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#contact .title', getConfig({ origin: 'top', distance: '20px', opacity: 0, scale: 0.98 }));
  sr.reveal('#contact .lottie-container', getConfig({ origin: 'left', distance: '50px', opacity: 0, scale: 0.9 }));
  sr.reveal('#contact .contact-info-upper-container', getConfig({ origin: 'right', distance: '30px', opacity: 0, scale: 0.95 }));
  sr.reveal('#contact .contact-item', getConfig({ origin: 'bottom', interval: 100, distance: '20px', opacity: 0, scale: 0.95 }));

  // Footer
  sr.reveal('footer .nav-links-container', getConfig({ origin: 'bottom', distance: '15px', opacity: 0, scale: 0.98 }));
  sr.reveal('footer .nav-links li', getConfig({ origin: 'bottom', interval: 100, distance: '10px', opacity: 0, scale: 0.95 }));
  sr.reveal('footer p', getConfig({ origin: 'bottom', distance: '10px', opacity: 0, scale: 0.98 }));

  // Scroll Indicators
  sr.reveal('.scroll-indicator-container', getConfig({ origin: 'bottom', distance: '20px', opacity: 0, scale: 0.95 }));
};

document.addEventListener('DOMContentLoaded', initializeScrollReveal);
window.addEventListener('resize', initializeScrollReveal);

document.addEventListener('DOMContentLoaded', initializeScrollReveal);
window.addEventListener('resize', initializeScrollReveal);

document.addEventListener("DOMContentLoaded", () => {
  const emailLink = document.getElementById("email-link");
  const emailTooltip = document.getElementById("email-tooltip");
  const email = "vkavouras@proton.me";

  const showTooltip = (message) => {
    emailTooltip.textContent = message;
    emailTooltip.classList.add("visible");
    setTimeout(() => emailTooltip.classList.remove("visible"), 2000);
  };

  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email)
      .then(() => showTooltip("Email copied!"))
      .catch((err) => {
        console.error("Could not copy text: ", err);
        showTooltip("Failed to copy");
      });
  });

  document.addEventListener("click", (e) => {
    if (!emailLink.contains(e.target)) {
      emailTooltip.classList.remove("visible");
    }
  });
});