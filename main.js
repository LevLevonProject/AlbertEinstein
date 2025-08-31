document.addEventListener('DOMContentLoaded', () => {
  const htmlRoot = document.documentElement;
  const overlay = document.querySelector('.overlay') || null;
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobile-panel');
  const themeToggle = document.getElementById('theme-toggle');

  const THEME_KEY = 'einstein_theme';

  // Theme helpers
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme) {
    if (theme === 'system') {
      if (systemPrefersDark()) htmlRoot.setAttribute('data-theme', 'dark');
      else htmlRoot.removeAttribute('data-theme');
    } else if (theme === 'dark') {
      htmlRoot.setAttribute('data-theme', 'dark');
    } else {
      htmlRoot.removeAttribute('data-theme');
    }
    updateThemeButton();
  }

  function updateThemeButton() {
    if (!themeToggle) return;
    const current = localStorage.getItem(THEME_KEY) || 'system';
    themeToggle.title = 'Thema: ' + current;
    // icon switch
    if (current === 'dark') {
      themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (current === 'light') {
      themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>';
    } else {
      themeToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M12 3v1M12 20v1M4.2 4.2l.7.7M18.1 18.1l.7.7M1 12h1M22 12h1M4.2 19.8l.7-.7M18.1 5.9l.7-.7M12 6a6 6 0 100 12 6 6 0 000-12z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    }
  }

  // Init theme
  let saved = localStorage.getItem(THEME_KEY);
  if (!saved) saved = 'system';
  applyTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = localStorage.getItem(THEME_KEY) || 'system';
      const next = cur === 'system' ? 'dark' : cur === 'dark' ? 'light' : 'system';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

    // listen to system change
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const cur = localStorage.getItem(THEME_KEY) || 'system';
        if (cur === 'system') applyTheme('system');
      });
    }
  }

  // Mobile menu: only hook if elements exist (hamburger visible only under breakpoint)
  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', (e) => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.classList.toggle('open');
      mobilePanel.setAttribute('aria-hidden', String(expanded));
    });

    // close when clicking outside panel
    document.addEventListener('click', (ev) => {
      if (!mobilePanel.classList.contains('open')) return;
      if (ev.target.closest('.mobile-panel-inner') || ev.target.closest('#hamburger')) return;
      mobilePanel.classList.remove('open');
      mobilePanel.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  }

  // IntersectionObserver reveal
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    // show everything if reduced motion
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
  }

  // Page transitions overlay for internal links
  document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      e.preventDefault();
      if (overlay) {
        overlay.classList.add('active');
      }
      setTimeout(() => { location.href = href; }, 280);
    });
  });

  // Small hover enhancement for images
  document.querySelectorAll('.img-card img, .hero-media img, .family-card img, .figure-tribute img').forEach(img => {
    img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.03)');
    img.addEventListener('mouseleave', () => img.style.transform = '');
  });

  // Close mobile panel with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobilePanel && mobilePanel.classList.contains('open')) {
        mobilePanel.classList.remove('open');
        mobilePanel.setAttribute('aria-hidden', 'true');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Accessibility: ensure nav links reflow correctly — no JS needed, CSS flex-wrap handles it.
});

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a"); // всі посилання на сторінки
  const wrapper = document.getElementById("page-wrapper");

  links.forEach(link => {
    // Перевіряємо що це внутрішнє посилання
    if(link.hostname === window.location.hostname){
      link.addEventListener("click", (e) => {
        e.preventDefault();
        wrapper.classList.remove("fade-in");
        wrapper.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = link.href;
        }, 500); // час fade-out анімації
      });
    }
  });

  // Додаємо fade-up анімацію до тексту та фото
  const fadeElements = document.querySelectorAll(".fade-up");
  fadeElements.forEach(el => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.classList.add("fade-up");
    }, 300);
  });
});
