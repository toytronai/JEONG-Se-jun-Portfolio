const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const audio = document.querySelector("[data-bgm]");
const musicButton = document.querySelector("[data-bgm-toggle]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("open")) {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
    navToggle?.focus();
  }
});

if (header && "ResizeObserver" in window) {
  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-offset", `${header.getBoundingClientRect().bottom + 20}px`);
  }).observe(header);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -50% 0px" },
);

sections.forEach((section) => observer.observe(section));

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll("[data-category]")];

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});

if (audio && musicButton) {
  const status = document.querySelector("[data-bgm-status]");
  const label = document.querySelector("[data-bgm-button-label]");
  const playIcon = document.querySelector("[data-bgm-play-icon]");
  const pauseIcon = document.querySelector("[data-bgm-pause-icon]");
  let wantsMusic = true;
  let pending = false;
  let waitingForGesture = false;
  let unavailable = false;
  let attempt = 0;

  // Each new page load attempts playback; OFF applies to this visit only.
  audio.volume = 0.23;

  const renderMusic = () => {
    const playing = !audio.paused && !audio.ended && !unavailable;
    const canStop = playing || pending;
    musicButton.setAttribute("aria-pressed", String(playing));
    const action = canStop ? "Turn background music off" : unavailable ? "Retry background music" : "Turn background music on";
    musicButton.setAttribute("aria-label", action);
    musicButton.title = action;
    musicButton.dataset.state = playing ? "playing" : pending ? "loading" : "paused";
    label.textContent = canStop ? "BGM OFF" : "BGM ON";
    playIcon.hidden = canStop;
    pauseIcon.hidden = !canStop;
    status.textContent = unavailable ? "Audio unavailable" : playing ? "Playing" : pending ? "Loading" : waitingForGesture ? "Ready" : "Off";
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }
  };

  const startMusic = async ({ fromGesture = false } = {}) => {
    if (!wantsMusic || (pending && !fromGesture)) return;
    const currentAttempt = ++attempt;
    pending = true;
    waitingForGesture = false;
    unavailable = false;
    if (audio.error) audio.load();
    renderMusic();
    try {
      await audio.play();
      if (!wantsMusic) audio.pause();
    } catch (error) {
      if (currentAttempt !== attempt) return;
      waitingForGesture = error.name === "NotAllowedError";
      unavailable = !waitingForGesture && error.name !== "AbortError";
    } finally {
      if (currentAttempt === attempt) {
        pending = false;
        renderMusic();
      }
    }
  };

  const stopMusic = () => {
    ++attempt;
    wantsMusic = false;
    pending = false;
    waitingForGesture = false;
    audio.pause();
    renderMusic();
  };

  musicButton.addEventListener("click", () => {
    if (pending || !audio.paused) {
      stopMusic();
    } else {
      wantsMusic = true;
      void startMusic();
    }
  });

  // Browsers may block audible autoplay. Capture the visitor's first gesture so
  // playback can begin even when it occurs before the initial autoplay rejection.
  const resumeOnFirstGesture = (event) => {
    if (wantsMusic && !musicButton.contains(event.target)) void startMusic({ fromGesture: true });
  };
  document.addEventListener("pointerdown", resumeOnFirstGesture, { capture: true, once: true });
  document.addEventListener("keydown", resumeOnFirstGesture, { capture: true, once: true });

  audio.addEventListener("playing", () => {
    if (!wantsMusic) audio.pause();
    renderMusic();
  });
  audio.addEventListener("pause", renderMusic);
  audio.addEventListener("error", () => {
    ++attempt;
    pending = false;
    unavailable = true;
    waitingForGesture = false;
    renderMusic();
  });

  if ("mediaSession" in navigator && "MediaMetadata" in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "따뜻한 AI(J36)와의 여행",
      album: "JEONG Se-jun Portfolio",
    });
    try {
      navigator.mediaSession.setActionHandler("pause", stopMusic);
      navigator.mediaSession.setActionHandler("play", () => {
        wantsMusic = true;
        void startMusic();
      });
    } catch {
      // Hardware media controls are optional; the on-page button remains available.
    }
  }
  renderMusic();
  if (wantsMusic) void startMusic();
}
