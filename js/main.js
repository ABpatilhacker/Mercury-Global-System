document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "☰";
  };

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 16);
    },
    { passive: true },
  );

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    document.body.classList.toggle("menu-open", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
    link.addEventListener("click", closeMenu);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(
      ".reveal-section, .card, .solution-card, .sector-card, .metric-card, .product-card",
    )
    .forEach((element) => {
      element.classList.add("reveal-item");
      revealObserver.observe(element);
    });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const filterItems = document.querySelectorAll("[data-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      filterItems.forEach((item) => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
    });
  });

  const search = document.querySelector("[data-shop-search]");
  search?.addEventListener("input", () => {
    const term = search.value.trim().toLowerCase();

    document.querySelectorAll("[data-product]").forEach((product) => {
      product.hidden = !product.textContent.toLowerCase().includes(term);
    });
  });

  document.querySelectorAll("[data-quote]").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "Added to quote";
      button.classList.add("is-added");
    });
  });

  const form = document.querySelector("#contact-form");
  const formStatus = form?.querySelector(".form-status");

  form?.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("blur", () => {
      field.classList.toggle("invalid", !field.checkValidity());
    });
    field.addEventListener("input", () => {
      if (field.checkValidity()) field.classList.remove("invalid");
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll("input, textarea, select")];
    const isValid = fields.every((field) => {
      field.classList.toggle("invalid", !field.checkValidity());
      return field.checkValidity();
    });

    if (!isValid) {
      formStatus.textContent = "Please review the highlighted fields.";
      return;
    }

    formStatus.textContent = "Thank you. Your inquiry has been received.";
    form.reset();
    fields.forEach((field) => field.classList.remove("invalid"));
  });
});
