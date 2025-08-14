import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  return (
    <button
      aria-label="Toggle dark mode"
      className="ring-focus rounded-md p-2 text-neutral-600 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      {/* Sun/Moon icon */}
      <svg className="h-5 w-5 block dark:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 4.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-.75.75h-.5A.75.75 0 0 1 12 6.75v-2zM4.47 6.22a.75.75 0 0 1 1.06 0l1.42 1.42a.75.75 0 0 1-1.06 1.06L4.47 7.28a.75.75 0 0 1 0-1.06ZM4.75 12A7.25 7.25 0 1 1 12 19.25 7.26 7.26 0 0 1 4.75 12ZM18 11.25a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5h-2Zm-1.05-4.61a.75.75 0 1 0-1.06-1.06l-1.42 1.42a.75.75 0 1 0 1.06 1.06l1.42-1.42ZM6.75 18a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2Zm11.03-1.53a.75.75 0 1 0-1.06-1.06l-1.42 1.42a.75.75 0 1 0 1.06 1.06l1.42-1.42Z"/>
      </svg>
      <svg className="hidden h-5 w-5 dark:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.257 2.7-7.872 6.48-9.188a.75.75 0 0 1 .96.96A8.234 8.234 0 0 0 9 6.75c0 4.556 3.694 8.25 8.25 8.25 1.46 0 2.833-.384 4.227-1.058a.75.75 0 0 1 .275 1.06Z"/>
      </svg>
    </button>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#home" className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-600 dark:bg-brand-500"></span>
          <span className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-white/90">sayom.me</span>
        </a>
        <nav className="flex items-center gap-1">
          {[
            {label:'About',href:'#about'},
            {label:'Research',href:'#research'},
            {label:'Experience',href:'#experience'},
            {label:'Projects',href:'#projects'},
            {label:'CV',href:'#cv'}
          ].map(({label,href}) => (
            <a key={label} href={href} className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white ring-focus rounded-md">
              {label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative">
      {/* background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]"></div>

      <div className="container-prose py-16 sm:py-24">
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div>
            <h1 className="text-4xl/tight sm:text-5xl/tight font-semibold tracking-tight text-neutral-900 dark:text-white">
              Cyber-Physical Systems Security
            </h1>
            <p className="mt-5 text-base sm:text-lg text-neutral-700 dark:text-white/70">
              Ph.D. student in Computer Science at the University of Utah. Researching surrogate-based falsification for autonomous systems and safety policy verification for multi-robot systems.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a className="ring-focus inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium shadow hover:translate-y-[-1px] transition dark:bg-white dark:text-neutral-900" href="#research">
                Current Research
              </a>
              <a className="ring-focus inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium shadow hover:bg-brand-500 transition text-white" href="#projects">
                Selected Projects
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-white/60">
              <li><a className="link-underline" href="mailto:nsssayom@gmail.com">nsssayom@gmail.com</a></li>
              <li><a className="link-underline" href="https://github.com/nsssayom" target="_blank" rel="noreferrer">github.com/nsssayom</a></li>
              <li><a className="link-underline" href="https://www.linkedin.com/in/nsssayom/" target="_blank" rel="noreferrer">linkedin.com/in/nsssayom</a></li>
            </ul>
          </div>

          {/* Artistic image panel */}
          <figure className="relative">
            <div className="card overflow-hidden p-0">
              <img
                src="/images/sayom-ens-p.jpg"
                alt="Silhouette portrait against sunset"
                width="800"
                height="1000"
                loading="eager"
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
            </div>
            <figcaption className="sr-only">Portrait</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="container-prose py-12 sm:py-16">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white/90">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-neutral-600 dark:text-white/60">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}

function Card({ title, meta, children }) {
  return (
    <article className="card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white/90">{title}</h3>
        {meta && <span className="tag">{meta}</span>}
      </div>
      <div className="mt-3 text-sm text-neutral-700 dark:text-white/70">
        {children}
      </div>
    </article>
  )
}

function Research() {
  return (
    <Section id="research" title="Current Research" subtitle="Focused, measurable, reproducible.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Surrogate-based falsification for autonomous systems" meta="2025">
          Build property-scoped reductions of control and physical dynamics to accelerate violation discovery; validate counterexamples on full systems (PX4, ArduPilot).
        </Card>
        <Card title="Safety policy verification in multi-robot systems" meta="2025">
          Formalize stakeholder policies, model role/permission constraints, analyze conflicts, and assess runtime monitoring for fleets.
        </Card>
      </div>
    </Section>
  )
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Graduate Research Assistant — University of Utah" meta="Aug 2024 – Present">
          Property-guided falsification for CPS control stacks and safety policy verification for multi-robot systems.
        </Card>
        <Card title="Linux Developer — meldCX" meta="Jan 2023 – Jul 2024">
          Built embedded Linux distributions for ARM SoCs and network-accessible abstractions for device drivers.
        </Card>
        <Card title="Lecturer — Daffodil International University" meta="Jan 2022 – Dec 2022">
          Taught Operating Systems, Embedded Systems; co-authored conference papers in deep learning.
        </Card>
        <Card title="Senior/Embedded Engineer — HelloTask" meta="Jun 2020 – Dec 2021">
          Prototyped self-checkout store network; built IVR broadcasting for users without internet access.
        </Card>
      </div>
    </Section>
  )
}

function Projects() {
  return (
    <Section id="projects" title="Selected Projects">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Disaster Victim Tracking">
          Multi-layer communications (ESP32, LoRaWAN, BLE, GSM) for resilient search-and-rescue.
        </Card>
        <Card title="Voice Remote (AOSP TV)">
          Arduino + nRF24 with cloud speech-to-text.
        </Card>
        <Card title="Depen">
          Raspberry Pi Zero OCR-centric tangible interface.
        </Card>
        <Card title="TALK-E">
          Long-range digital walkie-talkie on nRF24L01+.
        </Card>
      </div>
    </Section>
  )
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="card">
        <p className="text-sm text-neutral-700 dark:text-white/70">
          Ph.D. student in Computer Science at the University of Utah. Researching cyber-physical systems security with emphasis on falsification for autonomous systems and safety policy verification for multi-robot systems. Experienced in embedded systems, secure systems programming, and IoT architectures.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['C/C++','Python','JavaScript/TypeScript','Yocto','FastAPI','PyTorch','Docker','OpenCV','LoRaWAN','BLE'].map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="container-prose py-14 text-sm text-neutral-600 dark:text-white/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Sayom.</p>
        <div className="flex items-center gap-4">
          <a className="link-underline" href="https://scholar.google.com/citations?user=RLNbdK4AAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar</a>
          <a className="link-underline" href="https://stackoverflow.com/users/2392537/nsssayom" target="_blank" rel="noreferrer">Stack Overflow</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div>
      <a href="#home" className="sr-only focus:not-sr-only ring-focus absolute left-2 top-2 rounded bg-white px-3 py-2 text-sm text-neutral-900 dark:bg-neutral-900 dark:text-white">Skip to content</a>
      <Nav />
      <Hero />
      <About />
      <Research />
      <Experience />
      <Projects />
      {/* No publications section per requirement */}
      <section id="cv" className="container-prose pb-10">
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-700 dark:text-white/70">Need the full details?</p>
            <a className="ring-focus inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium dark:bg-white dark:text-neutral-900" href="/resume.pdf">
              Download CV
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
