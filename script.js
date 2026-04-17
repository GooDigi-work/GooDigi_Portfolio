/* ============================================================
   NEXORA — Main JavaScript
   Handles: Preloader, Cursor, Scroll, Navbar, Carousel,
            Hamburger Menu, Reveal Animations, Canvas Particles,
            Contact Form, Magnetic Buttons
   ============================================================ */

"use strict";

/* ============================================================
   1. PRELOADER
   ============================================================ */
const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hidden");
    document.body.style.overflow = "";
    // Trigger hero reveal after preloader
    document.querySelectorAll(".hero .reveal-up").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 120);
    });
  }, 2400); // matches the preloader animation duration
});
document.body.style.overflow = "hidden";


/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
});

// Smooth follower animation using RAF
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor interactions
document.querySelectorAll("a, button, .service-card, .dot, .carousel-btn").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "16px";
    cursor.style.height = "16px";
    cursorFollower.style.width = "52px";
    cursorFollower.style.height = "52px";
    cursorFollower.style.borderColor = "var(--accent)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "10px";
    cursor.style.height = "10px";
    cursorFollower.style.width = "32px";
    cursorFollower.style.height = "32px";
    cursorFollower.style.borderColor = "rgba(255,107,43,0.5)";
  });
});


/* ============================================================
   3. SCROLL PROGRESS
   ============================================================ */
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = `${progress}%`;
}, { passive: true });


/* ============================================================
   4. STICKY NAVBAR
   ============================================================ */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });


/* ============================================================
   5. HAMBURGER / MOBILE NAV
   ============================================================ */
const hamburger    = document.getElementById("hamburger");
const mobileNav    = document.getElementById("mobileNav");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
const mobileNavClose   = document.getElementById("mobileNavClose");

function openMobileNav() {
  mobileNav.classList.add("open");
  mobileNavOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeMobileNav() {
  mobileNav.classList.remove("open");
  mobileNavOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", openMobileNav);
mobileNavClose.addEventListener("click", closeMobileNav);
mobileNavOverlay.addEventListener("click", closeMobileNav);

// Close on link click
document.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeMobileNav);
});


/* ============================================================
   6. SMOOTH SCROLL (anchor links)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Check for data-delay
        const delay = entry.target.dataset.delay;
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal-up:not(.hero .reveal-up)").forEach((el) => {
  revealObserver.observe(el);
});


/* ============================================================
   8. CAROUSEL
   ============================================================ */
const slides      = document.querySelectorAll(".carousel-slide");
const dots        = document.querySelectorAll(".dot");
const prevBtn     = document.getElementById("prevBtn");
const nextBtn     = document.getElementById("nextBtn");
let currentSlide  = 0;
let isAnimating   = false;

function goToSlide(index) {
  if (isAnimating) return;
  isAnimating = true;

  // Exit current
  slides[currentSlide].classList.remove("active");
  slides[currentSlide].classList.add("exit-left");
  dots[currentSlide].classList.remove("active");

  // Enter new
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");

  setTimeout(() => {
    slides.forEach((s) => s.classList.remove("exit-left"));
    isAnimating = false;
  }, 700);
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Dot navigation
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => goToSlide(i));
});

// Auto-advance
let autoPlay = setInterval(nextSlide, 5000);
[prevBtn, nextBtn, ...dots].forEach((el) => {
  el.addEventListener("click", () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 5000);
  });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft")  prevSlide();
});

// Touch/swipe support
let touchStartX = 0;
document.querySelector(".carousel-wrapper").addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
document.querySelector(".carousel-wrapper").addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextSlide() : prevSlide();
  }
}, { passive: true });


/* ============================================================
   9. HERO CANVAS — Particle Grid
   ============================================================ */
const canvas = document.getElementById("heroCanvas");
const ctx    = canvas.getContext("2d");
const particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, { passive: true });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 107, 43, ${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 107, 43, ${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();


/* ============================================================
   10. MAGNETIC BUTTONS
   ============================================================ */
document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});


/* ============================================================
   11. FAQ ACCORDION
   ============================================================ */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    // Close all
    document.querySelectorAll(".faq-question").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
      b.nextElementSibling.classList.remove("open");
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      btn.setAttribute("aria-expanded", "true");
      btn.nextElementSibling.classList.add("open");
    }
  });
});


/* ============================================================
   12. PARALLAX — Hero elements on scroll
   ============================================================ */
const heroContent = document.querySelector(".hero-content");
window.addEventListener("scroll", () => {
  if (window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    heroContent.style.opacity   = `${1 - window.scrollY / (window.innerHeight * 0.8)}`;
  }
}, { passive: true });


/* ============================================================
   13. SERVICE CARD 3D TILT
   ============================================================ */
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* ============================================================
   14. CSS — Shake keyframe injection (kept for future use)
   ============================================================ */
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX( 8px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX( 4px); }
  }
`;
document.head.appendChild(style);
