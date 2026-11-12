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

const catState = new WeakMap();
const catLines = ["mrrp!", "meow?", "prrrr", "hi :3", "*slow blink*"];

// Moves a cat to (x, y). With walk, it strolls there at roughly 170px per second (or
// trots at 260px per second) and returns how many seconds that takes; otherwise it
// appears there straight away.
const moveCat = (cat, x, y, walk, dash = false) => {
  const state = catState.get(cat) ?? {};
  catState.set(cat, state);
  let seconds = 0;
  // Start from where the cat is drawn right now, which is mid-way if it is already moving.
  const fromX = state.x === undefined ? undefined : new DOMMatrix(getComputedStyle(cat).transform).m41;
  if (fromX !== undefined && x !== fromX) {
    cat.classList.toggle("facing-left", x < fromX);
    if (walk) {
      const distance = Math.abs(x - fromX);
      seconds = dash ? Math.min(Math.max(distance / 260, 0.6), 1.6) : Math.min(Math.max(distance / 170, 0.9), 3);
      cat.style.transitionDuration = `${seconds}s`;
      cat.classList.add("running");
      cat.classList.toggle("dashing", dash);
      // A timer rather than transitionend, which never fires if the tab is hidden mid-walk.
      clearTimeout(state.walkTimer);
      state.walkTimer = setTimeout(() => cat.classList.remove("running", "dashing"), seconds * 1000);
    }
  }
  if (!walk) cat.style.transition = "none";
  cat.style.transform = `translate(${x}px, ${y}px)`;
  if (!walk) {
    void cat.offsetWidth;
    cat.style.transition = "";
  }
  state.x = x;
  return seconds;
};

const catSay = (cat, text = catLines[Math.floor(Math.random() * catLines.length)]) => {
  const state = catState.get(cat) ?? {};
  catState.set(cat, state);
  cat.querySelector(".cat-say").textContent = text;
  cat.classList.add("saying");
  clearTimeout(state.sayTimer);
  state.sayTimer = setTimeout(() => cat.classList.remove("saying"), 1600);
};

const filterCat = document.querySelector(".filter-cat");

const placeFilterCat = (button, walk) => {
  if (!filterCat || !button) return;
  const x = button.offsetLeft + button.offsetWidth / 2 - filterCat.offsetWidth / 2;
  const y = button.offsetTop - filterCat.offsetHeight + 4;
  moveCat(filterCat, x, y, walk);
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    placeFilterCat(button, true);

    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

if (filterCat) {
  const placeOnActive = () => placeFilterCat(document.querySelector(".filter-btn.active"), false);
  document.fonts.ready.then(() => {
    placeOnActive();
    filterCat.classList.add("ready");
  });
  window.addEventListener("resize", placeOnActive);
}

// The walking cat waits off to the right, then strolls onto its floor below the hero when you reach it.
const catWalk = document.querySelector(".cat-walk");
const walkCat = document.querySelector(".walk-cat");

if (catWalk && walkCat) {
  let arrived = false;
  const restX = () =>
    catWalk.clientWidth - parseFloat(getComputedStyle(catWalk).paddingRight) - walkCat.offsetWidth - 40;
  const placeWalkCat = () => moveCat(walkCat, arrived ? restX() : catWalk.clientWidth + 20, 0, false);

  document.fonts.ready.then(() => {
    placeWalkCat();
    walkCat.classList.add("ready");
  });
  window.addEventListener("resize", placeWalkCat);

  const arrival = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      arrival.disconnect();
      arrived = true;
      const seconds = moveCat(walkCat, restX(), 0, true);
      setTimeout(() => catSay(walkCat, "hi :3"), seconds * 1000 + 200);
    },
    { rootMargin: "0px 0px -20% 0px" }
  );
  arrival.observe(catWalk);
  walkCat.addEventListener("click", () => catSay(walkCat));

  // Once it has arrived, the cat dashes away from a mouse that gets too close.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fleeLines = ["!", "eep!", "nope", "catch me :P", "hiss (politely)"];
  let fleeing = false;
  let pointerFrame = 0;

  const flee = (pointerX) => {
    const style = getComputedStyle(catWalk);
    const minX = parseFloat(style.paddingLeft);
    const maxX = catWalk.clientWidth - parseFloat(style.paddingRight) - walkCat.offsetWidth;
    const catRect = walkCat.getBoundingClientRect();
    const catX = catRect.left - catWalk.getBoundingClientRect().left;
    const away = pointerX < catRect.left + catRect.width / 2 ? 1 : -1;
    const distance = 150 + Math.random() * 100;
    let target = catX + away * distance;
    // Cornered against an edge: dart past the cursor the other way instead.
    if (target < minX || target > maxX) target = catX - away * distance;
    target = Math.min(Math.max(target, minX), maxX);

    fleeing = true;
    const seconds = moveCat(walkCat, target, 0, true, true);
    catSay(walkCat, fleeLines[Math.floor(Math.random() * fleeLines.length)]);
    setTimeout(() => {
      fleeing = false;
    }, seconds * 1000);
  };

  document.addEventListener("pointermove", (event) => {
    if (!arrived || fleeing || reduceMotion || event.pointerType !== "mouse" || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      const catRect = walkCat.getBoundingClientRect();
      const dx = event.clientX - (catRect.left + catRect.width / 2);
      const dy = event.clientY - (catRect.top + catRect.height / 2);
      if (Math.hypot(dx, dy) < 90) flee(event.clientX);
    });
  });
}

// The footer cat naps; it wakes for a moment when you reach it or click it.
const footerCat = document.querySelector(".footer-cat");

if (footerCat) {
  let napTimer;
  const wake = (text) => {
    footerCat.classList.remove("sleeping");
    catSay(footerCat, text);
    clearTimeout(napTimer);
    napTimer = setTimeout(() => footerCat.classList.add("sleeping"), 2400);
  };

  footerCat.addEventListener("click", () => wake());
  const footerSeen = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    footerSeen.disconnect();
    setTimeout(() => wake("oh! you made it"), 700);
  });
  footerSeen.observe(footerCat);
}

const playDialog = document.querySelector(".play-dialog");

if (playDialog) {
  const frame = playDialog.querySelector("iframe");
  const newTab = playDialog.querySelector(".play-newtab");
  const title = playDialog.querySelector("#play-title");

  document.querySelectorAll(".play-btn").forEach((button) => {
    button.addEventListener("click", () => {
      frame.src = button.dataset.play;
      frame.title = button.dataset.playTitle;
      title.textContent = button.dataset.playTitle;
      newTab.href = button.dataset.play;
      playDialog.showModal();
    });
  });

  // Give the game keyboard focus so the arrow keys drive the car straight away.
  frame.addEventListener("load", () => frame.contentWindow?.focus());
  playDialog.querySelector(".play-close").addEventListener("click", () => playDialog.close());
  playDialog.addEventListener("click", (event) => {
    if (event.target === playDialog) playDialog.close();
  });
  // Unload the game on close so it stops running in the background.
  playDialog.addEventListener("close", () => {
    frame.src = "about:blank";
  });
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
