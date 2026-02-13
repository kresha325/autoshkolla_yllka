(function () {
  const DEFAULT_LANG = "sq";
  const LANG_LABELS = {
    sq: "SQ",
    en: "EN",
    tr: "TR",
    bs: "BS",
  };

  function setYear() {
    const year = new Date().getFullYear();
    ["sq", "en", "tr", "bs"].forEach((lang) => {
      const el = document.getElementById("year-" + lang);
      if (el) el.textContent = year;
    });
  }

  function updateCurrentLangLabel(lang) {
    const el = document.getElementById("current-lang-label");
    if (el) {
      el.textContent = LANG_LABELS[lang] || lang.toUpperCase();
    }
  }

  function setLanguage(lang) {
    // Handle all elements with data-lang attribute
    document.querySelectorAll("[data-lang]").forEach((el) => {
      const tagName = el.tagName.toUpperCase();
      const isTargetLang = el.dataset.lang === lang;
      
      // Skip language switcher buttons and menu items
      if (el.closest(".lang-switch") || el.closest(".lang-menu")) {
        return;
      }
      
      if (isTargetLang) {
        // Show the matching language element - use !important to override CSS
        if (tagName === "SPAN") {
          // Check if it's inside a multi-lang-inline container
          if (el.closest(".multi-lang-inline")) {
            el.style.setProperty("display", "inline", "important");
          } else {
            // Regular span - use inline
            el.style.setProperty("display", "inline", "important");
          }
        } else {
          // Block-level elements (div, h1, h2, h3, p, etc.)
          el.style.setProperty("display", "block", "important");
        }
      } else {
        // Hide non-matching language elements
        el.style.setProperty("display", "none", "important");
      }
    });

    // Multi-language inline containers (handle separately for safety)
    document.querySelectorAll(".multi-lang-inline").forEach((container) => {
      container.querySelectorAll("span[data-lang]").forEach((span) => {
        if (span.dataset.lang === lang) {
          span.style.setProperty("display", "inline", "important");
        } else {
          span.style.setProperty("display", "none", "important");
        }
      });
    });

    // Update language switcher active state
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      if (btn.dataset.switchLang === lang) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });

    updateCurrentLangLabel(lang);
  }

  function attachLanguageSwitcher() {
    const langSwitch = document.querySelector(".lang-switch");
    const menu = langSwitch?.querySelector(".lang-menu");
    const toggle = langSwitch?.querySelector(".lang-toggle");

    // Buttons inside the menu
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.switchLang;
        if (!lang) return;
        setLanguage(lang);
        if (menu && toggle) {
          menu.classList.remove("is-open");
          toggle.classList.remove("is-open");
        }
      });
    });

    // Toggle button to open/close the small modal/dropdown
    if (toggle && menu) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
      });

      // Close when clicking outside
      document.addEventListener("click", (e) => {
        if (!langSwitch.contains(e.target)) {
          menu.classList.remove("is-open");
          toggle.classList.remove("is-open");
        }
      });
    }
  }

  function attachSmoothScroll() {
    document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(btn.dataset.scrollTo);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function attachContactActions() {
    document.querySelectorAll("[data-contact-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.contactAction;
        if (action === "call") {
          window.location.href = "tel:+38345558551";
        }
        if (action === "message") {
          // SMS or preferred messaging link placeholder
          window.location.href = "sms:+38345558551";
        }
        if (action === "whatsapp") {
          window.open("https://wa.me/38345558551", "_blank");
        }
      });
    });
  }

  
  function attachThemeToggle() {
    const toggleBtn = document.querySelector("[data-theme-toggle]");
    if (!toggleBtn) return;

    const label = toggleBtn.querySelector("[data-theme-label]");
    const storageKey = "yllka-theme";

    function applyTheme(theme, persist) {
      document.documentElement.setAttribute("data-theme", theme);
      if (label) {
        label.textContent = theme === "light" ? "Light" : "Dark";
      }
      if (persist) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch (err) {
          // Ignore storage errors (private mode, etc.).
        }
      }
    }

    let initialTheme = "dark";
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") {
        initialTheme = stored;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        initialTheme = "light";
      }
    } catch (err) {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        initialTheme = "light";
      }
    }

    applyTheme(initialTheme, false);

    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }


  function attachMaterialsModal() {
    const openBtn = document.querySelector("[data-open-materials]");
    const modal = document.querySelector("[data-materials-modal]");
    const closeBtn = modal ? modal.querySelector("[data-close-materials]") : null;
    if (!openBtn || !modal) return;

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      if (closeBtn) {
        closeBtn.focus();
      }
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (openBtn) {
        openBtn.focus();
      }
    }

    openBtn.addEventListener("click", openModal);
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  }

function attachInstructorSlider() {
    const slider = document.querySelector("[data-instructor-slider]");
    if (!slider) return;

    const track = slider.querySelector(".instructor-slider-track");
    const slides = slider.querySelectorAll("[data-instructor-slide]");
    const prevBtn = slider.querySelector("[data-instructor-prev]");
    const nextBtn = slider.querySelector("[data-instructor-next]");
    const dotsContainer = slider.querySelector("[data-instructor-dots]");
    const dots = dotsContainer ? dotsContainer.querySelectorAll(".instructor-dot") : [];

    let currentIndex = 0;
    const total = slides.length;

    function updateSlider(index) {
      if (!track || total === 0) return;
      const clamped = Math.max(0, Math.min(index, total - 1));
      currentIndex = clamped;
      const offset = -clamped * 100;
      track.style.transform = "translateX(" + offset + "%)";

      // Update dots
      dots.forEach((dot, i) => {
        if (i === clamped) {
          dot.classList.add("is-active");
        } else {
          dot.classList.remove("is-active");
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const nextIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
        updateSlider(nextIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const nextIndex = currentIndex === total - 1 ? 0 : currentIndex + 1;
        updateSlider(nextIndex);
      });
    }

    if (dotsContainer) {
      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const idx = parseInt(dot.dataset.index || "0", 10);
          updateSlider(idx);
        });
      });
    }

    updateSlider(0);
  }

  setYear();
  attachLanguageSwitcher();
  attachSmoothScroll();
  attachContactActions();
  attachInstructorSlider();
  attachThemeToggle();
  attachMaterialsModal();
  setLanguage(DEFAULT_LANG);
})();

