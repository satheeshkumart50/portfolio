const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Smooth scroll for internal links
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    event.preventDefault();
    targetEl.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    if (targetId !== "#hero") history.replaceState(null, "", targetId);
  });
});

// Active nav highlighting based on section in view
const sections = document.querySelectorAll("main section[id]");
const observerOptions = {
  root: null,
  threshold: 0.35,
};

const navMap = new Map();
navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.startsWith("#")) {
    navMap.set(href.substring(1), link);
  }
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute("id");
    const navLink = navMap.get(id);
    if (!navLink) return;
    if (entry.isIntersecting) {
      document
        .querySelectorAll(".nav-link")
        .forEach((lnk) => lnk.classList.remove("is-active"));
      navLink.classList.add("is-active");
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

// Fade-in animations on scroll
const animatables = document.querySelectorAll("[data-animate]");
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        animationObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatables.forEach((el) => animationObserver.observe(el));
