// Portfolio Interface
class PortfolioInterface {
    constructor() {
        this.currentPanel = 'intro';
        // Panel order for scroll navigation / keyboard shortcuts
        this.panelOrder = ['intro', 'work', 'timeline', 'portfolio', 'connect'];

        // Use stored theme if present; otherwise fall back to system preference
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.manualThemeOverride = Boolean(storedTheme);

        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileNavigation();
        this.setupImageModal();
        this.setupInteractions();
        this.setupKeyboard();
        this.setupMotionPreferences();
        this.initPanels();
    }

    // Respect prefers-reduced-motion: freeze autoplay videos on the poster frame.
    setupMotionPreferences() {
        const prefersReducedMotion = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) return;
        document.querySelectorAll('video[autoplay]').forEach(video => {
            video.removeAttribute('autoplay');
            video.pause();
        });
    }

    setupTheme() {
        const switcher = document.getElementById('theme-switcher');
        const mobileSwitcher = document.getElementById('theme-switcher-mobile');

        const sunSvg = `\n<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n  <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>\n</svg>`;
        const moonSvg = `\n<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <path d=\"M13 6V3M18.5 12V7M14.5 4.5H11.5M21 9.5H16M15.5548 16.8151C16.7829 16.8151 17.9493 16.5506 19 16.0754C17.6867 18.9794 14.7642 21 11.3698 21C6.74731 21 3 17.2527 3 12.6302C3 9.23576 5.02061 6.31331 7.92462 5C7.44944 6.05072 7.18492 7.21708 7.18492 8.44523C7.18492 13.0678 10.9322 16.8151 15.5548 16.8151Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>\n</svg>`;

        const applyTheme = () => {
            document.documentElement.setAttribute('data-theme', this.theme);
            // Update icons/labels to reflect current theme
            const desktopIcon = switcher ? switcher.querySelector('.theme-icon') : null;
            const mobileIcon = mobileSwitcher ? mobileSwitcher.querySelector('.theme-icon') : null;
            const toSun = this.theme === 'light';
            const desktopLabel = toSun ? 'Switch to dark theme' : 'Switch to light theme';
            const mobileLabel = desktopLabel;
            const setIcon = (el) => {
                if (!el) return;
                el.innerHTML = this.theme === 'light' ? sunSvg : moonSvg;
            };
            setIcon(desktopIcon);
            setIcon(mobileIcon);
            if (switcher) switcher.setAttribute('aria-label', desktopLabel);
            if (mobileSwitcher) mobileSwitcher.setAttribute('aria-label', mobileLabel);
        };

        const toggleTheme = () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.manualThemeOverride = true;
            localStorage.setItem('theme', this.theme);
            applyTheme();
        };

        // Wire up click handlers
        if (switcher) switcher.addEventListener('click', toggleTheme);
        if (mobileSwitcher) mobileSwitcher.addEventListener('click', toggleTheme);

        // React to system theme changes only if user hasn't manually overridden
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')) {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            media.addEventListener('change', (e) => {
                if (this.manualThemeOverride) return;
                this.theme = e.matches ? 'dark' : 'light';
                applyTheme();
            });
        }

        // Initial apply
        applyTheme();
    }

    // Single source of truth for the active-nav state, shared by clicks,
    // scroll-spy and keyboard shortcuts. Also exposes state to assistive tech.
    updateActiveNav(panelId) {
        this.currentPanel = panelId;
        document.querySelectorAll('.dock-item, .fab-item').forEach(item => {
            const isActive = item.getAttribute('data-target') === panelId;
            item.classList.toggle('active', isActive);
            if (isActive) {
                item.setAttribute('aria-current', 'true');
            } else {
                item.removeAttribute('aria-current');
            }
        });
    }

    setupNavigation() {
        const dockItems = document.querySelectorAll('.dock-item');

        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                this.scrollToPanel(target);
                this.updateActiveNav(target);
            });
        });

        // Setup scroll spy to update active dock item
        this.setupScrollSpy();

        // Set initial active state
        this.updateActiveNav('intro');
    }

    setupMobileNavigation() {
        const fabMain = document.getElementById('fab-main');
        const mobileNav = document.getElementById('mobile-nav');
        const fabItems = document.querySelectorAll('.fab-item');

        if (!fabMain || !mobileNav) return;

        const setExpanded = (expanded) => {
            mobileNav.classList.toggle('expanded', expanded);
            fabMain.setAttribute('aria-expanded', String(expanded));
        };

        // FAB expand/collapse functionality
        fabMain.addEventListener('click', () => {
            setExpanded(!mobileNav.classList.contains('expanded'));
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target)) {
                setExpanded(false);
            }
        });

        // Close FAB on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('expanded')) {
                setExpanded(false);
                fabMain.focus();
            }
        });

        // FAB item navigation
        fabItems.forEach(item => {
            if (item.classList.contains('theme-switcher-mobile')) return; // Skip theme switcher

            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                this.scrollToPanel(target);
                this.updateActiveNav(target);

                // Close FAB menu after selection
                setExpanded(false);
            });
        });
    }

    scrollToPanel(panelId) {
        const targetPanel = document.getElementById(panelId);
        if (targetPanel) {
            targetPanel.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            this.currentPanel = panelId;
        }
    }

    setupScrollSpy() {
        const options = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNav(entry.target.id);
                }
            });
        }, options);

        // Observe all panels
        this.panelOrder.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                observer.observe(panel);
            }
        });
    }

    setupImageModal() {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');

        if (!modal) return;

        // Element that opened the modal, so focus can be returned on close
        let lastTrigger = null;

        const captionFor = (figure) => {
            if (figure.classList.contains('research-figure')) {
                const captionElement = figure.parentElement
                    ? figure.parentElement.querySelector('.figure-caption')
                    : null;
                return captionElement ? captionElement.textContent : '';
            }

            const customCaption = figure.getAttribute('data-caption');
            if (customCaption) return customCaption;

            // Fall back to the project title (excluding the GitHub icon link)
            const projectCard = figure.closest('.project-card');
            const titleElement = projectCard ? projectCard.querySelector('h3') : null;
            if (!titleElement) return '';
            return titleElement.childNodes[0]
                ? titleElement.childNodes[0].textContent.trim()
                : titleElement.textContent.trim();
        };

        const openModal = (figure) => {
            const img = figure ? figure.querySelector('img') : null;
            if (!img) return;

            modalImage.src = img.src;
            modalImage.alt = img.alt || '';
            modalCaption.textContent = captionFor(figure);

            lastTrigger = figure;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (modalClose) modalClose.focus();
        };

        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastTrigger && typeof lastTrigger.focus === 'function') {
                lastTrigger.focus();
            }
            lastTrigger = null;
        };

        // Make every figure operable by mouse AND keyboard.
        document.querySelectorAll('.research-figure, .project-figure').forEach(figure => {
            const img = figure.querySelector('img');
            figure.setAttribute('role', 'button');
            figure.setAttribute('tabindex', '0');
            figure.setAttribute('aria-label', img && img.alt ? `Enlarge image: ${img.alt}` : 'Enlarge image');

            figure.addEventListener('click', () => openModal(figure));
            figure.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    openModal(figure);
                }
            });
        });

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        // Keyboard handling while the dialog is open: ESC closes, Tab is trapped
        // (the close button is the only focusable control inside the dialog).
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                if (modalClose) modalClose.focus();
            }
        });
    }

    initPanels() {
        // Initialize all panels since they're all visible now
        this.setupResearchDomains();
        this.setupTimelineFilters();
        this.setupPortfolioFilters();
    }

    setupResearchDomains() {
        const cards = document.querySelectorAll('.domain-card');
        const contents = document.querySelectorAll('.domain-content');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const domain = card.getAttribute('data-domain');

                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                contents.forEach(content => content.classList.remove('active'));
                const target = document.getElementById(domain);
                if (target) target.classList.add('active');
            });
        });
    }

    setupTimelineFilters() {
        const filters = document.querySelectorAll('.timeline-filter');
        const items = document.querySelectorAll('.timeline-item');

        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-filter');

                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                items.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    item.classList.toggle('visible', category === 'all' || itemCategory === category);
                });
            });
        });

        items.forEach(item => item.classList.add('visible'));
    }

    setupPortfolioFilters() {
        const filters = document.querySelectorAll('.portfolio-filter');
        const cards = document.querySelectorAll('.project-card');

        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-filter');

                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                cards.forEach(card => {
                    const cardCategories = (card.getAttribute('data-category') || '').split(/\s+/);
                    const show = category === 'all' || cardCategories.includes(category);
                    card.style.opacity = show ? '1' : '0.3';
                    card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
                });
            });
        });
    }

    setupInteractions() {
        // Name typewriter — honour users who prefer reduced motion.
        const typewriter = document.querySelector('.typewriter');
        if (!typewriter) return;

        const displayText = 'Nazmus Shakib Sayom';
        const prefersReducedMotion = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const appendCursor = () => {
            const cursor = document.createElement('span');
            cursor.className = 'terminal-cursor';
            cursor.innerHTML = '&nbsp;';
            typewriter.appendChild(cursor);
        };

        if (prefersReducedMotion) {
            typewriter.textContent = displayText;
            appendCursor();
            return;
        }

        typewriter.textContent = '';
        let i = 0;
        const type = () => {
            if (i < displayText.length) {
                typewriter.textContent = displayText.slice(0, i + 1);
                i++;
                setTimeout(type, 80);
            } else {
                appendCursor();
            }
        };
        setTimeout(type, 500);
    }

    setupKeyboard() {
        const panels = { '1': 'intro', '2': 'work', '3': 'timeline', '4': 'portfolio', '5': 'connect' };

        document.addEventListener('keydown', (e) => {
            // Don't hijack keys while typing or when a modifier is held
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;

            const target = panels[e.key];
            if (!target) return;

            e.preventDefault();
            this.scrollToPanel(target);
            this.updateActiveNav(target);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioInterface();
});
