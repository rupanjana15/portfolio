const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const backToTop = document.querySelector(".back-to-top");
const copyEmail = document.querySelector(".copy-email");
const sections = document.querySelectorAll("main section[id]");

document.querySelectorAll(".project-visual img").forEach((image) => {
  const hideMissingImage = () => {
    if (!image.naturalWidth) image.hidden = true;
  };
  image.addEventListener("error", hideMissingImage);
  if (image.complete) hideMissingImage();
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".project-slide"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dots i"));
  const count = carousel.querySelector(".carousel-count strong");
  let current = 0;

  const showSlide = (nextIndex) => {
    current = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const isActive = index === current;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, index) => dot.classList.toggle("active", index === current));
    if (count) count.textContent = String(current + 1);
  };

  carousel.querySelector(".carousel-prev")?.addEventListener("click", () => showSlide(current - 1));
  carousel.querySelector(".carousel-next")?.addEventListener("click", () => showSlide(current + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(current - 1);
    if (event.key === "ArrowRight") showSlide(current + 1);
  });
});

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

const filterCat = document.querySelector(".filter-cat");
const filterCatHop = document.querySelector(".filter-cat-hop");
let catX = null;

const placeCat = (button, hop) => {
  if (!filterCat || !button) return;
  const x = button.offsetLeft + button.offsetWidth / 2 - filterCat.offsetWidth / 2;
  const y = button.offsetTop - filterCat.offsetHeight + 4;
  if (catX !== null && x !== catX) filterCat.classList.toggle("facing-left", x < catX);
  filterCat.style.transform = `translate(${x}px, ${y}px)`;
  catX = x;
  if (hop) {
    filterCatHop.classList.remove("hopping");
    void filterCatHop.offsetWidth; // restart the hop animation
    filterCatHop.classList.add("hopping");
  }
};

filterCatHop?.addEventListener("animationend", () => filterCatHop.classList.remove("hopping"));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    placeCat(button, true);

    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

if (filterCat) {
  const placeOnActive = () => placeCat(document.querySelector(".filter-btn.active"), false);
  document.fonts.ready.then(() => {
    filterCat.style.transition = "none";
    placeOnActive();
    void filterCat.offsetWidth;
    filterCat.style.transition = "";
    filterCat.classList.add("ready");
  });
  window.addEventListener("resize", placeOnActive);
}

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
