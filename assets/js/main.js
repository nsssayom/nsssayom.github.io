// Revolutionary Portfolio Interface
class PortfolioInterface {
        constructor() {
    this.currentPanel = 'intro';
    // Use stored theme if present; otherwise fall back to system preference
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.manualThemeOverride = Boolean(storedTheme);
        this.panelScrollPositions = {}; // Store scroll positions for each panel
            this.init();
        }

        init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileNavigation();
        this.setupImageModal();
        this.setupInteractions();
        this.setupKeyboard();
        this.initPanels();
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

    setupNavigation() {
        const dockItems = document.querySelectorAll('.dock-item');
        
        // Panel order for scroll navigation
    this.panelOrder = ['intro', 'work', 'timeline', 'portfolio', 'connect'];
        
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                this.scrollToPanel(target);
                
                dockItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Setup scroll spy to update active dock item
        this.setupScrollSpy();

        // Set initial active state
        document.querySelector('[data-target="intro"]').classList.add('active');
    }

    setupMobileNavigation() {
        const fabMain = document.getElementById('fab-main');
        const mobileNav = document.getElementById('mobile-nav');
        const fabItems = document.querySelectorAll('.fab-item');
        
        if (!fabMain || !mobileNav) return;
        
        // FAB expand/collapse functionality
        fabMain.addEventListener('click', () => {
            mobileNav.classList.toggle('expanded');
        });
        
        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target)) {
                mobileNav.classList.remove('expanded');
            }
        });
        
        // FAB item navigation
        fabItems.forEach(item => {
            if (item.classList.contains('theme-switcher-mobile')) return; // Skip theme switcher
            
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                this.scrollToPanel(target);
                
                // Update active states for both desktop and mobile
                document.querySelectorAll('.dock-item, .fab-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const deskTopItem = document.querySelector(`.dock-item[data-target="${target}"]`);
                if (deskTopItem) deskTopItem.classList.add('active');
                
                // Close FAB menu after selection
                mobileNav.classList.remove('expanded');
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
                    const panelId = entry.target.id;
                    this.currentPanel = panelId;
                    
                    // Update dock active states
                    document.querySelectorAll('.dock-item, .fab-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    const dockItem = document.querySelector(`[data-target="${panelId}"]`);
                    if (dockItem) {
                        dockItem.classList.add('active');
                    }
                    
                    // Update mobile FAB if exists
                    const fabItem = document.querySelector(`.fab-item[data-target="${panelId}"]`);
                    if (fabItem) {
                        fabItem.classList.add('active');
                    }
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
        
        // Setup click handlers for research thumbnails and project thumbnails/figures
        document.addEventListener('click', (e) => {
            const isResearch = e.target.classList.contains('research-thumbnail') || e.target.closest('.research-figure');
            const isProject = e.target.classList.contains('project-thumbnail') || e.target.closest('.project-figure') || e.target.classList.contains('expand-hint');
            if (isResearch || isProject) {
                // Find the image within the figure (supports clicking on overlay/hint)
                const figure = e.target.closest('.research-figure, .project-figure');
                const img = figure ? figure.querySelector('img') : e.target;
                let caption = '';
                
                if (isResearch) {
                    const captionElement = figure ? figure.parentElement.querySelector('.figure-caption') : null;
                    caption = captionElement ? captionElement.textContent : '';
                } else if (isProject) {
                    // For project thumbnails, use the project title as caption (excluding GitHub icon)
                    const projectCard = figure ? figure.closest('.project-card') : img.closest('.project-card');
                    const titleElement = projectCard ? projectCard.querySelector('h3') : null;
                    if (titleElement) {
                        // Get only the text content, excluding the GitHub link
                        const titleText = titleElement.childNodes[0] ? titleElement.childNodes[0].textContent.trim() : titleElement.textContent.trim();
                        caption = titleText;
                    }
                }
                
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                modalCaption.textContent = caption;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    setupScrollNavigation() {
        let isScrollingContent = false;
        let lastPanelSwitch = 0;
        const switchCooldown = 1000;

        document.addEventListener('wheel', (e) => {
            const activePanel = document.querySelector('.panel.active');
            if (!activePanel) return;

            const now = Date.now();
            if (now - lastPanelSwitch < switchCooldown) {
                e.preventDefault();
                return;
            }

            const hasScrollableContent = activePanel.scrollHeight > activePanel.clientHeight;
            
            if (!hasScrollableContent) {
                // No scrollable content - switch panels immediately
                e.preventDefault();
                this.switchToNextPanel(e.deltaY > 0);
                lastPanelSwitch = now;
                return;
            }

            // Content is scrollable - check if at boundaries
            const scrollTop = activePanel.scrollTop;
            const scrollHeight = activePanel.scrollHeight;
            const clientHeight = activePanel.clientHeight;
            const isAtTop = scrollTop <= 1;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if (e.deltaY > 0 && isAtBottom) {
                // Scrolling down and at bottom - switch to next panel
                e.preventDefault();
                this.switchToNextPanel(true);
                lastPanelSwitch = now;
            } else if (e.deltaY < 0 && isAtTop) {
                // Scrolling up and at top - switch to previous panel
                e.preventDefault();
                this.switchToNextPanel(false);
                lastPanelSwitch = now;
            }
            // Otherwise, let natural scrolling happen (don't prevent default)
        });
    }

    setupSmartScrollNavigation() {
        let lastSwitchTime = 0;
        const switchCooldown = 1000;
        let currentScrollListener = null;
        
        // Function to setup scroll listener on the active panel
        const setupPanelScrollListener = () => {
            // Remove previous listener if exists
            if (currentScrollListener) {
                currentScrollListener.element.removeEventListener('scroll', currentScrollListener.handler);
            }
            
            const activePanel = document.querySelector('.panel.active');
            if (!activePanel) return;
            
            const scrollHandler = () => {
                const now = Date.now();
                if (now - lastSwitchTime < switchCooldown) return;
                
                // Get precise measurements
                const scrollTop = activePanel.scrollTop;
                const scrollHeight = activePanel.scrollHeight;
                const clientHeight = activePanel.clientHeight;
                
                // Only proceed if content is actually scrollable
                if (scrollHeight <= clientHeight) return;
                
                // Check if at boundaries with minimal tolerance
                const isAtTop = scrollTop <= 1;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
                
                // Don't do anything yet - we need wheel event to trigger action
            };
            
            activePanel.addEventListener('scroll', scrollHandler, { passive: true });
            currentScrollListener = { element: activePanel, handler: scrollHandler };
        };
        
        // Setup initial listener
        setupPanelScrollListener();
        
        // Re-setup listener when panels change
        const originalSwitchPanel = this.switchPanel.bind(this);
        this.switchPanel = (panelId) => {
            originalSwitchPanel(panelId);
            setTimeout(setupPanelScrollListener, 100); // Setup after panel switch
        };
        
        // Handle wheel events for panel switching
        document.addEventListener('wheel', (e) => {
            const activePanel = document.querySelector('.panel.active');
            if (!activePanel) return;
            
            const now = Date.now();
            if (now - lastSwitchTime < switchCooldown) return;
            
            // Get current scroll measurements
            const scrollTop = activePanel.scrollTop;
            const scrollHeight = activePanel.scrollHeight;
            const clientHeight = activePanel.clientHeight;
            
            // If content is not scrollable, switch panels immediately
            if (scrollHeight <= clientHeight) {
                e.preventDefault();
                if (e.deltaY > 0) {
                    this.switchToNextPanel(true);
                } else {
                    this.switchToNextPanel(false);
                }
                lastSwitchTime = now;
                return;
            }
            
            // Check if we're at boundaries and user is trying to scroll past them
            const isAtTop = scrollTop <= 1;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            
            if (e.deltaY > 0 && isAtBottom) {
                // User is scrolling down and we're at the bottom - switch to next panel
                e.preventDefault();
                this.switchToNextPanel(true);
                lastSwitchTime = now;
            } else if (e.deltaY < 0 && isAtTop) {
                // User is scrolling up and we're at the top - switch to previous panel
                e.preventDefault();
                this.switchToNextPanel(false);
                lastSwitchTime = now;
            }
            // Otherwise, let the wheel event scroll naturally within the panel
        });
    }

    // Clean up - no more complex scroll detection needed!

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
                    const cardCategory = card.getAttribute('data-category');
                    const show = category === 'all' || cardCategory === category;
                    card.style.opacity = show ? '1' : '0.3';
                    card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
                });
            });
        });
    }

    setupInteractions() {
        // Clean interactions without background effects

        // Simple Name Typewriter
        const typewriter = document.querySelector('.typewriter');
        if (typewriter) {
            const displayText = 'Nazmus Shakib Sayom';
            typewriter.innerHTML = '';
            
            let i = 0;
            const type = () => {
                if (i < displayText.length) {
                    typewriter.innerHTML = displayText.slice(0, i + 1);
                    i++;
                    setTimeout(type, 80);
                } else {
                    const cursor = document.createElement('span');
                    cursor.className = 'terminal-cursor';
                    cursor.innerHTML = '&nbsp;';
                    typewriter.appendChild(cursor);
                }
            };
            setTimeout(type, 500);
        }
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            const panels = { '1': 'intro', '2': 'work', '3': 'timeline', '4': 'portfolio', '5': 'connect' };
            
            if (panels[e.key]) {
            e.preventDefault();
                this.switchPanel(panels[e.key]);
                document.querySelectorAll('.dock-item').forEach(i => i.classList.remove('active'));
                document.querySelector(`[data-target="${panels[e.key]}"]`).classList.add('active');
                }
            });
        }
    }

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioInterface();
    console.log('🚀 Portfolio Ready');
});
