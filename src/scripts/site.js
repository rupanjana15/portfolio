const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const backToTop = document.querySelector(".back-to-top");
const copyEmail = document.querySelector(".copy-email");
const sections = document.querySelectorAll("main section[id]");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});

if (themeToggle && localStorage.getItem("portfolio-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

copyEmail?.addEventListener("click", async () => {
  const originalText = copyEmail.innerHTML;
  try {
    await navigator.clipboard.writeText("rupp1510@gmail.com");
    copyEmail.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
  } catch {
    copyEmail.innerHTML = '<i class="fa-solid fa-check"></i> Email ready';
  }
  setTimeout(() => {
    copyEmail.innerHTML = originalText;
  }, 1600);
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("visible", window.scrollY > 650);
});
