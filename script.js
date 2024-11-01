// Core utility functions
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

// Theme handling
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

// Menu handling
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

// Dropdown handling
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

// Animation handling
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

// Splash screen handling
const splashScreenHandler = (() => {
  const hideSplashScreen = () => {
    const splashScreen = util.$("#splash-screen");
    const profileSection = util.$("#profile");

    splashScreen.addEventListener("transitionend", () => {
      splashScreen.style.display = "none";
      util.toggleClass(profileSection, "visible", true);
      startEntranceAnimation();
    });

    Object.assign(splashScreen.style, {
      opacity: "0",
      transform: "scale(1.1)",
      transition: "opacity 1s ease, transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)"
    });
  };

  const applyInitialTheme = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = prefersDarkScheme ? 'dark' : 'light';
    
    util.attr(document.documentElement, 'theme', initialTheme);
    util.toggleClass(document.body, `${initialTheme}-theme`, true);
    
    util.$$('#modeToggle, #modeToggle2').forEach(icon => {
      if (icon) {
        icon.className = `fas fa-${initialTheme === 'dark' ? 'sun' : 'moon'} color-icon icons`;
      }
    });

    localStorage.setItem('theme', initialTheme);
  };

  const startEntranceAnimation = () => {
    const mainContent = util.$("main");
    const sections = util.$$("main > section");
    const nav = util.$("nav");
    const profileLottie = util.$('#profile .lottie-container');
    const profileInfo = util.$('#profile-info');
    const socials = util.$('#socials-container');

    // Enhanced initial states
    if (profileLottie) {
      Object.assign(profileLottie.style, {
        opacity: "0",
        transform: "translateX(50px) scale(0.95)",
        transition: "opacity 1s cubic-bezier(0.34, 1.56, 0.64, 1), transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)"
      });
    }

    if (profileInfo) {
      Object.assign(profileInfo.style, {
        opacity: "0",
        transform: "translateY(30px)",
        transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
      });
    }

    if (socials) {
      Object.assign(socials.style, {
        opacity: "0",
        transform: "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      });
    }

    sections.forEach(el => {
      Object.assign(el.style, {
        opacity: "0",
        filter: "blur(10px)",
        transform: "translateY(30px) scale(0.98)",
        transition: "opacity 1s ease, filter 1s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)"
      });
    });

    // Staggered animation sequence
    const animationSequence = async () => {
      // Fade in main content
      Object.assign(mainContent.style, {
        opacity: "1",
        visibility: "visible"
      });

      // Animate navigation with bounce
      Object.assign(nav.style, {
        opacity: "0",
        transform: "translateY(-20px)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
      });

      await new Promise(resolve => setTimeout(resolve, 200));
      Object.assign(nav.style, {
        opacity: "1",
        transform: "translateY(0)"
      });

      // Animate sections with staggered timing
      for (let [index, section] of sections.entries()) {
        await new Promise(resolve => setTimeout(resolve, 200));
        Object.assign(section.style, {
          opacity: "1",
          filter: "blur(0)",
          transform: "translateY(0) scale(1)"
        });
        animateSection(section);

        if (section.id === 'profile') {
          // Profile section special animations
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (profileInfo) {
            Object.assign(profileInfo.style, {
              opacity: "1",
              transform: "translateY(0)"
            });
          }

          await new Promise(resolve => setTimeout(resolve, 200));
          
          if (profileLottie) {
            Object.assign(profileLottie.style, {
              opacity: "1",
              transform: "translateX(0) scale(1)"
            });
          }

          await new Promise(resolve => setTimeout(resolve, 200));
          
          if (socials) {
            Object.assign(socials.style, {
              opacity: "1",
              transform: "translateY(0)"
            });
          }
        }
      }

      // Initialize other animations
      await new Promise(resolve => setTimeout(resolve, 500));
      animationHandler.setupScrollAnimations();
      initializeScrollReveal();
    };

    animationSequence();
  };

  const animateSection = (section) => {
    const elements = util.$$('.animated-element', section);
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = `fadeInSlide 0.8s ${index * 0.15}s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
      }, index * 150);
    });
  };

  return { hideSplashScreen, applyInitialTheme };
})();

// Navigation handling
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

// Lottie animations
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
      '#profile .lottie-container': { 
        src: lottieAnimations.profile,
        initialStyle: {
          opacity: "0",
          transform: "translateX(50px)",
          transition: "opacity 0.8s ease, transform 0.8s ease"
        }
      },
      '#about .lottie-container': { src: lottieAnimations.about },
      '#experience .section__pic-container': { src: lottieAnimations.experience },
      '#contact .lottie-container': { src: lottieAnimations.contact, options: { width: '400px', height: '400px' } }
    };

    Object.entries(lottieContainers).forEach(([selector, { src, options, initialStyle }]) => {
      const container = util.$(selector);
      if (container) {
        if (initialStyle) {
          Object.assign(container.style, initialStyle);
        }
        container.appendChild(createLottiePlayer(src, options));
      }
    });

    util.$$('.scroll-indicator').forEach(indicator => {
      indicator.appendChild(createLottiePlayer(lottieAnimations.scrollIndicator));
    });
  };

  return { insertLottieAnimations };
})();

// ScrollReveal configuration
const initializeScrollReveal = () => {
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

  const revealConfigs = {
    profile: {
      '.section__text__p1': { origin: 'left', distance: '30px', opacity: 0, scale: 0.95 },
      '.title': { origin: 'right', distance: '30px', opacity: 0, scale: 0.95 },
      '.section__text__p2': { origin: 'left', distance: '30px', opacity: 0, scale: 0.95 },
      '.btn-container': { origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 },
      '#socials-container': { origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 },
      '.lottie-container': { origin: 'right', distance: '50px', opacity: 0, scale: 0.9 }
    },
    about: {
      '.section__text__p1, .title': { origin: 'top', distance: '20px', opacity: 0, scale: 0.98 },
      '.lottie-container': { origin: 'left', distance: '50px', opacity: 0, scale: 0.9 },
      '.about-containers': { origin: 'right', distance: '30px', opacity: 0, scale: 0.95 },
      '.text-container': { origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 }
    },
    experience: {
      '.section__text__p1, .title': { origin: 'top', distance: '20px', opacity: 0, scale: 0.98 },
      '.experience-details-container': { origin: 'bottom', distance: '30px', opacity: 0, scale: 0.95 },
      '.article-container article': { origin: 'bottom', interval: 100, distance: '20px', opacity: 0, scale: 0.95 }
    },
    projects: {
      '.section__text__p1, .title': { origin: 'top', distance: '20px', opacity: 0, scale: 0.98 },
      '.color-container': { origin: 'bottom', interval: 200, distance: '30px', opacity: 0, scale: 0.95 }
    },
    contact: {
      '.section__text__p1, .title': { origin: 'top', distance: '20px', opacity: 0, scale: 0.98 },
      '.lottie-container': { origin: 'left', distance: '50px', opacity: 0, scale: 0.9 },
      '.contact-info-upper-container': { origin: 'right', distance: '30px', opacity: 0, scale: 0.95 },
      '.contact-item': { origin: 'bottom', interval: 100, distance: '20px', opacity: 0, scale: 0.95 }
    },
    footer: {
      '.nav-links-container': { origin: 'bottom', distance: '15px', opacity: 0, scale: 0.98 },
      '.nav-links li': { origin: 'bottom', interval: 100, distance: '10px', opacity: 0, scale: 0.95 },
      'p': { origin: 'bottom', distance: '10px', opacity: 0, scale: 0.98 }
    }
  };

  Object.entries(revealConfigs).forEach(([section, configs]) => {
    Object.entries(configs).forEach(([selector, config]) => {
      sr.reveal(`#${section} ${selector}`, getConfig(config));
    });
  });

  sr.reveal('.scroll-indicator-container', getConfig({ origin: 'bottom', distance: '20px', opacity: 0, scale: 0.95 }));
};

// Event listeners and initialization
document.addEventListener("DOMContentLoaded", () => {
  themeHandler.initTheme();
  util.updateElement("age", util.calculateAge("2004-05-25"));
  util.updateElement("current-year", new Date().getFullYear());
  dropdownHandler.setupDropdownMenu();
  arrowNavigationHandler.setupArrowNavigation();
  scrollIndicatorHandler.setupScrollIndicators();

  util.$$(".icons").forEach(icon => {
    const label = icon.getAttribute("aria-label") || icon.getAttribute("title") || icon.textContent;
    if (!label) {
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

// Email functionality
document.addEventListener("DOMContentLoaded", () => {
  const emailLink = util.$("#email-link");
  const emailTooltip = util.$("#email-tooltip");
  const email = "vkavouras@proton.me";

  const showTooltip = (message) => {
    if (emailTooltip) {
      emailTooltip.textContent = message;
      emailTooltip.style.visibility = 'visible';
      emailTooltip.style.opacity = '1';
      emailTooltip.style.transform = 'translateX(-50%) translateY(0)';

      setTimeout(() => {
        emailTooltip.style.opacity = '0';
        emailTooltip.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => {
          emailTooltip.style.visibility = 'hidden';
        }, 300);
      }, 2000);
    }
  };

  const isMobile = () => window.innerWidth <= 768;

  if (emailLink && emailTooltip) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (isMobile()) {
        window.location.href = `mailto:${email}`;
      } else {
        navigator.clipboard.writeText(email)
          .then(() => showTooltip("Email copied!"))
          .catch(() => showTooltip("Failed to copy"));
      }
    });

    // Hide tooltip when clicking outside
    document.addEventListener("click", (e) => {
      if (!emailLink.contains(e.target)) {
        emailTooltip.style.visibility = 'hidden';
        emailTooltip.style.opacity = '0';
        emailTooltip.style.transform = 'translateX(-50%) translateY(10px)';
      }
    });
  }
});
