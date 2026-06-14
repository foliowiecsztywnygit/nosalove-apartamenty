import { createIcons, icons } from "lucide";

document.addEventListener("DOMContentLoaded", () => {
  createIcons({ icons });

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const faqItems = Array.from(document.querySelectorAll("[data-faq-item]"));
  const reviewCards = Array.from(document.querySelectorAll("[data-review-card]"));
  const reviewDots = Array.from(document.querySelectorAll("[data-review-dot]"));
  const reviewPrev = document.querySelector("[data-review-prev]");
  const reviewNext = document.querySelector("[data-review-next]");
  const contactForm = document.querySelector("[data-contact-form]");
  const formMessage = document.querySelector("[data-form-message]");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState);

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu?.classList.toggle("is-open");
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  faqItems.forEach((item, index) => {
    const button = item.querySelector("[data-faq-button]");
    button?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      faqItems.forEach((faq, faqIndex) => {
        faq.classList.toggle("is-open", !isOpen && faqIndex === index);
      });
    });
  });

  if (reviewCards.length && reviewDots.length) {
    let activeReview = 0;
    let intervalId;

    const setReview = (nextIndex) => {
      activeReview = (nextIndex + reviewCards.length) % reviewCards.length;

      reviewCards.forEach((card, index) => {
        card.hidden = index !== activeReview;
      });

      reviewDots.forEach((dot, index) => {
        const isActive = index === activeReview;
        dot.classList.toggle("active", isActive);
        dot.style.width = isActive ? "40px" : "10px";
        dot.style.background = isActive ? "var(--magenta)" : "rgba(23, 21, 19, 0.18)";
      });
    };

    const restartAutoplay = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(() => setReview(activeReview + 1), 5000);
    };

    reviewDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        setReview(index);
        restartAutoplay();
      });
    });

    reviewPrev?.addEventListener("click", () => {
      setReview(activeReview - 1);
      restartAutoplay();
    });

    reviewNext?.addEventListener("click", () => {
      setReview(activeReview + 1);
      restartAutoplay();
    });

    setReview(0);
    restartAutoplay();
  }

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage?.removeAttribute("hidden");
  });
});
