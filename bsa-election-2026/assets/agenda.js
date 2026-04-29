const root = document.documentElement;
root.classList.add("reveal-ready");

const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
const shareButton = document.querySelector("[data-share]");
const siteHeader = document.querySelector(".site-header");

function updateScrollProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function setActiveSection(id) {
    navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
}

function scrollToTarget(target, behavior = "smooth") {
    if (!target) {
        return;
    }

    const headerHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offset = headerHeight + 24;
    const top = Math.max(targetTop - offset, 0);

    if (behavior === "instant") {
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, top);
        root.style.scrollBehavior = previousBehavior;
        return;
    }

    window.scrollTo({
        top,
        behavior
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));

        if (!target) {
            return;
        }

        event.preventDefault();
        history.pushState(null, "", link.getAttribute("href"));
        scrollToTarget(target);
        setActiveSection(target.id);
    });
});

if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    scrollToTarget(initialTarget, "instant");
}

window.addEventListener("load", () => {
    if (!window.location.hash) {
        return;
    }

    const target = document.querySelector(window.location.hash);
    window.setTimeout(() => scrollToTarget(target, "instant"), 40);
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 }
);

revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        item.classList.add("is-visible");
    }

    revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
            }
        });
    },
    {
        rootMargin: "-38% 0px -54% 0px",
        threshold: 0
    }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if (shareButton) {
    shareButton.addEventListener("click", async () => {
        const shareData = {
            title: "Vote Nazmus Shakib Sayom | BSAUU Election 2026",
            text: "Reach further. Together. Read Nazmus Shakib Sayom's Outreach Secretary agenda.",
            url: "https://sayom.me/bsa-election-2026/"
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(shareData.url);
            shareButton.textContent = "Link copied";
            window.setTimeout(() => {
                shareButton.textContent = "Share agenda";
            }, 1800);
        } catch (error) {
            if (error.name !== "AbortError") {
                window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`;
            }
        }
    });
}
