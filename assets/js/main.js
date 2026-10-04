/* Progressive enhancement: reading and section navigation work without JS. */
class PortfolioInterface {
  constructor() {
    this.setupTypewriter();
    this.setupTheme();
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupEmail();
    this.setupFilters();
    this.setupImageModal();
  }

  setupTypewriter() {
    const name = document.querySelector(".typewriter-text");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const fullName = name.textContent;
    let index = 0;
    let timer;
    name.textContent = "";
    const type = () => {
      name.textContent = fullName.slice(0, ++index);
      if (index < fullName.length) timer = setTimeout(type, 80);
    };
    timer = setTimeout(type, 350);
    motion.addEventListener("change", (event) => {
      if (event.matches) {
        clearTimeout(timer);
        name.textContent = fullName;
      }
    });
  }

  setupTheme() {
    const button = document.querySelector(".theme-switcher");
    const sun =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
    const moon =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20.8 13a8.8 8.8 0 0 1-9.8-9.8A9 9 0 1 0 20.8 13Z"/></svg>';
    const apply = (theme) => {
      document.documentElement.dataset.theme = theme;
      button.querySelector(".theme-icon").innerHTML =
        theme === "dark" ? moon : sun;
      button.setAttribute(
        "aria-label",
        `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
      );
      document.querySelector('meta[name="theme-color"]').content =
        theme === "dark" ? "#101010" : "#f8fafc";
      document.querySelectorAll("img[data-light-src]").forEach((image) => {
        if (image.dataset.lightSrcset) {
          image.srcset =
            theme === "light"
              ? image.dataset.lightSrcset
              : image.dataset.darkSrcset;
        }
        image.src =
          theme === "light" ? image.dataset.lightSrc : image.dataset.darkSrc;
      });
    };
    apply(document.documentElement.dataset.theme || "dark");
    button.hidden = false;
    button.addEventListener("click", () => {
      const theme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      apply(theme);
      try {
        localStorage.setItem("theme", theme);
      } catch (_) {
        /* Keep working for this visit. */
      }
    });
  }

  setupNavigation() {
    const links = [...document.querySelectorAll(".nav-dock a")];
    const sections = [...document.querySelectorAll("main > section[id]")];
    const update = () => {
      const marker = window.innerHeight * 0.3;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8
      ) {
        current = sections[sections.length - 1].id;
      }
      links.forEach((link) => {
        if (link.hash === `#${current}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        update();
        scheduled = false;
      });
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("hashchange", () => {
      // A direct project link should reveal a card hidden by a filter.
      const target = document.getElementById(location.hash.slice(1));
      if (target?.matches(".project-card[hidden]")) {
        document.querySelector('[data-filter="all"]').click();
        target.scrollIntoView();
      }
      schedule();
    });
    update();
  }

  setupMobileMenu() {
    const nav = document.getElementById("primary-nav");
    const toggle = document.querySelector(".menu-toggle");
    const mobile = matchMedia(
      "(max-width: 760px), (max-width: 1000px) and (max-height: 500px)",
    );
    const setOpen = (open, returnFocus = false) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu",
      );
      if (returnFocus) toggle.focus();
    };
    document.body.classList.add("has-mobile-menu");
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
      if (open) nav.querySelector("a").focus();
    });
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        if (!mobile.matches) return;
        setOpen(false);
        const section = document.querySelector(link.hash);
        section.setAttribute("tabindex", "-1");
        section.focus({ preventScroll: true });
      }),
    );
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false, true);
      }
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target))
        setOpen(false);
    });
    nav.addEventListener("focusout", (event) => {
      if (
        event.relatedTarget &&
        !nav.contains(event.relatedTarget) &&
        !toggle.contains(event.relatedTarget)
      )
        setOpen(false);
    });
    mobile.addEventListener("change", () => setOpen(false));
    let menuWidth = innerWidth;
    addEventListener("resize", () => {
      if (innerWidth !== menuWidth) {
        setOpen(false);
        menuWidth = innerWidth;
      }
    });
  }

  setupEmail() {
    // Keep the address out of the HTML source while using native email links.
    const address = atob("c2F5b20uc2hha2liQHV0YWguZWR1");
    document.querySelectorAll("[data-email]").forEach((link) => {
      link.href = `mailto:${address}`;
      if (link.hasAttribute("data-email-address")) link.textContent = address;
      link.hidden = false;
    });
  }

  setupFilters() {
    const group = document.querySelector(".portfolio-filters");
    const filters = [...group.querySelectorAll("button")];
    const cards = [...document.querySelectorAll(".project-card")];
    group.hidden = false;
    filters.forEach((button) =>
      button.addEventListener("click", () => {
        filters.forEach((filter) => {
          const active = filter === button;
          filter.setAttribute("aria-pressed", String(active));
          filter.classList.toggle("active", active);
        });
        let shown = 0;
        cards.forEach((card) => {
          const matches =
            button.dataset.filter === "all" ||
            card.dataset.category.split(" ").includes(button.dataset.filter);
          card.hidden = !matches;
          if (matches) shown++;
        });
        document.getElementById("filter-status").textContent =
          `${shown} ${shown === 1 ? "project" : "projects"} shown`;
      }),
    );
  }

  setupImageModal() {
    const modal = document.getElementById("image-modal");
    const image = document.getElementById("modal-image");
    const caption = document.getElementById("modal-caption");
    let trigger;
    document.querySelectorAll(".image-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.querySelector("img");
        trigger = button;
        const lightTheme = document.documentElement.dataset.theme === "light";
        image.src =
          (lightTheme && source.dataset.lightFullSrc) ||
          source.dataset.fullSrc ||
          source.currentSrc ||
          source.src;
        image.classList.toggle(
          "sage-art",
          source.classList.contains("sage-art"),
        );
        image.classList.toggle(
          "concept-art",
          source.classList.contains("concept-art"),
        );
        image.alt = source.alt.replace(/^Enlarge\s+/i, "");
        caption.textContent = button.dataset.caption || image.alt;
        if (button.dataset.originals) {
          const originals = JSON.parse(button.dataset.originals);
          const projectName = button
            .closest(".project-card")
            .querySelector("h3").textContent;
          const description = document.createTextNode(
            "Concept artwork based on original prototype photographs. ",
          );
          caption.replaceChildren(description);
          originals.forEach((photo, index) => {
            if (index) caption.append(" · ");
            const link = document.createElement("a");
            link.href = photo.src;
            link.textContent = `Original ${photo.label}`;
            link.addEventListener("click", (event) => {
              event.preventDefault();
              image.src = link.href;
              image.classList.remove("concept-art", "sage-art");
              image.alt = `${projectName} original ${photo.label} prototype photograph`;
              description.textContent = `${image.alt}. `;
            });
            caption.append(link);
          });
        }
        if (button.dataset.original) {
          const original = document.createElement("a");
          original.href = button.dataset.original;
          original.textContent = "original prototype photograph";
          original.addEventListener("click", (event) => {
            event.preventDefault();
            image.src = original.href;
            const projectName = button
              .closest(".project-card")
              .querySelector("h3").textContent;
            image.alt = `${projectName} original prototype photograph`;
            caption.textContent = image.alt;
            modal.querySelector(".modal-close").focus();
          });
          caption.replaceChildren(
            "AI-assisted presentation based on the ",
            original,
          );
        }
        modal.showModal();
      });
    });
    modal
      .querySelector(".modal-close")
      .addEventListener("click", () => modal.close());
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const controls = [...modal.querySelectorAll("button, a[href]")];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;
      const rect = modal.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        modal.close();
    });
    modal.addEventListener("close", () =>
      trigger?.focus({ preventScroll: true }),
    );
  }
}
new PortfolioInterface();
