// Utility module
const util = (() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  return {
    $, $$,
    getSystemPreference: () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    updateElement: (id, value) => $(`#${id}`).textContent = value,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    debounce: (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    },
    attr: (el, attr, value) => value === undefined ? el.getAttribute(attr) : el.setAttribute(attr, value),
    toggleClass: (el, className, force) => el.classList.toggle(className, force),
    calculateAge: (birthdate) => {
      const birth = new Date(birthdate);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const monthDiff = now.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    }
  };
})();

// Theme handler module
const themeHandler = (() => {
  const setTheme = (theme) => {
    util.attr(document.documentElement, 'theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    animateThemeTransition(theme);
  };

  const toggleTheme = () => {
    const currentTheme = util.attr(document.documentElement, 'theme') || util.getSystemPreference();
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const updateThemeIcon = (theme) => {
    const iconClass = `fas fa-${theme === 'dark' ? 'sun' : 'moon'} color-icon icons`;
    util.$$('#modeToggle, #modeToggle2').forEach(icon => {
      if (icon) {
        icon.className = iconClass;
        Object.assign(icon.style, {
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: 'rotate(360deg) scale(1.1)'
        });
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

  const initTheme = () => setTheme(localStorage.getItem('theme') || util.getSystemPreference());

  return { initTheme, toggleTheme, setTheme };
})();

// Menu handler module
const menuHandler = (() => {
  const toggleMenu = () => {
    const menu = util.$(".menu-links");
    const icon = util.$(".hamburger-icon");
    const isOpen = menu.classList.contains("open");

    Object.assign(menu.style, {
      opacity: isOpen ? "0" : "1",
      transform: `translateY(${isOpen ? "-10px" : "0"}) scale(${isOpen ? "0.98" : "1"})`,
      transition: "opacity 0.4s ease, transform 0.4s ease"
    });

    util.toggleClass(icon, "open");
    Object.assign(icon.style, {
      transition: "transform 0.4s ease",
      transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(1.05)"
    });

    setTimeout(() => util.toggleClass(menu, "open"), isOpen ? 400 : 0);
  };

  const closeMenuOnResize = () => {
    if (window.innerWidth > 1200) {
      const menu = util.$(".menu-links");
      const icon = util.$(".hamburger-icon");
      util.toggleClass(menu, "open", false);
      util.toggleClass(icon, "open", false);
      icon.style.transform = "rotate(0deg) scale(1)";
    }
  };

  return { toggleMenu, closeMenuOnResize };
})();

// Dropdown handler module
const dropdownHandler = (() => {
  const setupDropdownMenu = () => {
    const dropdown = util.$(".dropdown");
    const dropdownContent = util.$(".dropdown-content");
    const downloadCvButton = util.$("#downloadCvButton");

    const toggleDropdown = (show) => {
      util.toggleClass(dropdownContent, 'open', show);
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
        util.toggleClass(downloadCvButton, "active", false);
      }
    });
  };

  return { setupDropdownMenu };
})();

// Animation handler module
const animationHandler = (() => {
  const setupScrollAnimations = () => {
    if (window.innerWidth <= 768) {
      util.$$(".animated, .animate-on-scroll").forEach((element) => {
        util.toggleClass(element, "visible", true);
        util.toggleClass(element, "not-visible", false);
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target && entry.target.classList) {
          util.toggleClass(entry.target, "visible", entry.isIntersecting);
          util.toggleClass(entry.target, "not-visible", !entry.isIntersecting);
        }
      });
    }, { rootMargin: "0px", threshold: 0.2 });

    util.$$(".animated, .animate-on-scroll").forEach((element) => {
      if (element) {
        util.toggleClass(element, "not-visible", true);
        observer.observe(element);
      }
    });
  };

  return { setupScrollAnimations };
})();

// Splash screen handler module
const splashScreenHandler = (() => {
  const hideSplashScreen = () => {
    const splashScreen = util.$("#splash-screen");
    const profileSection = util.$("#profile");

    splashScreen.addEventListener("transitionend", () => {
      splashScreen.style.display = "none";
      util.toggleClass(profileSection, "visible", true);
      
      // Initialize animations after splash screen is hidden
      startEntranceAnimation();
    });

    Object.assign(splashScreen.style, {
      opacity: "0",
      transition: "opacity 1s ease"
    });
  };

  const applyInitialTheme = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDarkScheme ? 'dark' : 'light');
    
    util.attr(document.documentElement, 'theme', initialTheme);
    util.toggleClass(document.body, `${initialTheme}-theme`, true);
    
    util.$$('#modeToggle, #modeToggle2').forEach(icon => {
      if (icon) {
        icon.className = `fas fa-${initialTheme === 'dark' ? 'sun' : 'moon'} color-icon icons`;
      }
    });
  };

  const startEntranceAnimation = () => {
    const mainContent = util.$("main");
    const sections = util.$$("main > section");
    const nav = util.$("nav");

    sections.forEach(el => {
      Object.assign(el.style, {
        opacity: "0",
        filter: "blur(10px)",
        transform: "translateY(20px)",
        transition: "opacity 0.8s ease, filter 0.8s ease, transform 0.8s ease"
      });
    });

    Object.assign(mainContent.style, {
      opacity: "1",
      visibility: "visible"
    });

    Object.assign(nav.style, {
      opacity: "0",
      transition: "opacity 0.5s ease"
    });
    setTimeout(() => {
      nav.style.opacity = "1";
    }, 200);

    sections.forEach((section, index) => {
      setTimeout(() => {
        Object.assign(section.style, {
          opacity: "1",
          filter: "blur(0)",
          transform: "translateY(0)"
        });
        animateSection(section);
      }, (index + 1) * 300);
    });

    setTimeout(() => {
      animationHandler.setupScrollAnimations();
      initializeScrollReveal();
    }, sections.length * 300 + 500);
  };

  const animateSection = (section) => {
    const elements = util.$$('.animated-element', section);
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = `fadeInSlide 0.6s ${index * 0.1}s forwards ease-out`;
      }, index * 100);
    });
  };

  return { hideSplashScreen, applyInitialTheme };
})();

// Arrow navigation handler module
const arrowNavigationHandler = (() => {
  const setupArrowNavigation = () => {
    const arrow = util.$(".icon.arrow");
    const handleScroll = () => {
      const shouldShow = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      Object.assign(arrow.style, {
        opacity: shouldShow ? "1" : "0",
        transform: `translateY(${shouldShow ? "0" : "20px"}) scale(${shouldShow ? "1" : "0.8"})`
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    util.$$(".arrow").forEach((arrow) => {
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

// Scroll indicator handler module
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

// Lottie animations handler module
const lottieHandler = (() => {
  const lottieAnimations = {
    splashScreen: "https://lottie.host/f6fd76fa-bf3d-47e1-9594-ca365dac923a/JTES7YEv6f.lottie",
    profile: "https://lottie.host/ec2681d0-ab67-4f7d-a35a-c870c0a588aa/BVfwAmcRde.lottie",
    scrollIndicator: "https://lottie.host/3f35f92c-c5d0-45f8-9eb8-bf7f24f5b8f9/tAqmylkYkr.lottie",
    about: "https://lottie.host/66e29c4b-aa09-4cc6-a4cc-37b824c92390/CMDbVbXDsG.lottie",
    experience: "https://lottie.host/73016d3d-9858-42f7-82ab-fc9f2f387a2b/7LWc6nKCUr.lottie",
    contact: "https://lottie.host/89786656-4880-42e7-9f18-82895c67895a/37mBlD7a1R.lottie"
  };

  const createLottiePlayer = (src, options = {}) => {
    const player = document.createElement('dotlottie-player');
    player.src = src;
    player.setAttribute('background', 'transparent');
    player.setAttribute('speed', '1');
    player.setAttribute('loop', '');
    player.setAttribute('autoplay', '');
    
    if (options.width) player.style.width = options.width;
    if (options.height) player.style.height = options.height;
    
    return player;
  };

  const insertLottieAnimations = () => {
    const lottieContainers = {
      '#splash-screen': { src: lottieAnimations.splashScreen, options: { width: '200px', height: '200px' } },
      '#profile .lottie-container': { src: lottieAnimations.profile },
      '#about .lottie-container': { src: lottieAnimations.about },
      '#experience .section__pic-container': { src: lottieAnimations.experience },
      '#contact .lottie-container': { src: lottieAnimations.contact, options: { width: '400px', height: '400px' } }
    };

    Object.entries(lottieContainers).forEach(([selector, { src, options }]) => {
      const container = util.$(selector);
      if (container) {
        container.appendChild(createLottiePlayer(src, options));
      }
    });

    util.$$('.scroll-indicator').forEach(indicator => {
      indicator.appendChild(createLottiePlayer(lottieAnimations.scrollIndicator));
    });
  };

  return { insertLottieAnimations };
})();

// Initialize ScrollReveal
const initializeScrollReveal = () => {
  const isMobile = window.innerWidth <= 768;

  util.$$('#contact .icons, #contact .contact-icon').forEach(icon => {
    Object.assign(icon.style, { opacity: '1', transform: 'none', transition: 'none' });
  });

  if (isMobile) {
    util.$$('#contact .contact-item p').forEach(text => {
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

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  themeHandler.initTheme();
  util.updateElement("age", calculateAge("2004-05-25"));
  util.updateElement("current-year", new Date().getFullYear());
  dropdownHandler.setupDropdownMenu();
  arrowNavigationHandler.setupArrowNavigation();
  scrollIndicatorHandler.setupScrollIndicators();

  util.$$(".icons").forEach(icon => {
    const label = icon.getAttribute("aria-label") || icon.getAttribute("title") || icon.textContent;
    if (!icon.getAttribute("aria-label")) {
      icon.setAttribute("aria-label", label);
    }
  });

  const hamburgerIcon = util.$(".hamburger-icon");
  if (hamburgerIcon) {
    hamburgerIcon.addEventListener("click", menuHandler.toggleMenu);
  }

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('#modeToggle, #modeToggle2, .hamburger-menu .fa-adjust')) {
      e.preventDefault();
      e.stopPropagation();
      themeHandler.toggleTheme();
    }
  });

  const backToTopButton = util.$("#back-to-top");
  if (backToTopButton) {
    backToTopButton.addEventListener("click", util.scrollToTop);
  }

  // Optimize scroll event listener
  const handleScroll = util.debounce(() => {
    const scrollPos = window.scrollY;
    const backToTopButton = util.$("#back-to-top");
    if (backToTopButton) {
      Object.assign(backToTopButton.style, {
        opacity: scrollPos > 300 ? "1" : "0",
        visibility: scrollPos > 300 ? "visible" : "hidden"
      });
    }
  }, 100);

  window.addEventListener("scroll", handleScroll, { passive: true });

  lottieHandler.insertLottieAnimations();
});

window.addEventListener("resize", menuHandler.closeMenuOnResize);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  themeHandler.setTheme(e.matches ? "dark" : "light");
});

window.addEventListener("load", () => {
  splashScreenHandler.applyInitialTheme();
  setTimeout(splashScreenHandler.hideSplashScreen, 2000);
  setTimeout(() => document.body.style.overflow = "auto", 3000);
});

// Email copy functionality
document.addEventListener("DOMContentLoaded", () => {
  const emailLink = util.$("#email-link");
  const emailTooltip = util.$("#email-tooltip");
  const email = "vkavouras@proton.me";

  const showTooltip = (message) => {
    emailTooltip.textContent = message;
    util.toggleClass(emailTooltip, "visible", true);
    setTimeout(() => util.toggleClass(emailTooltip, "visible", false), 2000);
  };

  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email)
      .then(() => showTooltip("Email copied!"))
      .catch(() => showTooltip("Failed to copy"));
  });

  document.addEventListener("click", (e) => {
    if (!emailLink.contains(e.target)) {
      util.toggleClass(emailTooltip, "visible", false);
    }
  });
});

// Helper function to calculate age
function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
