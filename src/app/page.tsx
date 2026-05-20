"use client";
import { CSSProperties, useState, useEffect, useRef } from "react";

// ─── Global styles (cursor blink + fonts) ─────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0a0c10; }
    ::-webkit-scrollbar-thumb { background: #2a3a50; }
    .tok-kw  { color: #ff79c6; }
    .tok-fn  { color: #50fa7b; }
    .tok-str { color: #f1fa8c; }
    .tok-cm  { color: #3a5068; font-style: italic; }
    .tok-num { color: #bd93f9; }
    .tok-type{ color: #8be9fd; }
    a.contact-link-hover:hover { border-color: #00ff88 !important; color: #00ff88 !important; }
  `}</style>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  stack: string[];
  description: string;
  features: string[];
  hasCode: boolean;
  imageSrcs?: string[];
  codeFile?: string;
  codeLang?: string;
  codeSnippet?: string;
  isDesign?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: "jeepgo",
    num: "PROJECT_01",
    title: "JeepGo",
    subtitle: "Online Jeepney Ride-Hailing & Tracking App",
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "Google Maps API"],
    description:
      "A mobile ride-hailing and tracking application for jeepneys — complete with real-time driver location, multi-modal route planning via Google Maps Directions API, and a full in-app booking flow.",
    features: [
      "Real-time driver tracking via Supabase live queries",
      "Google Maps transit route planning with polyline decode",
      "Draggable bottom sheet modal for route options",
      "Location autocomplete with Google Places API",
      "Ride booking → live tracking screen navigation",
    ],
    hasCode: true,
    imageSrcs: ["/jeepgo-1.png", "/jeepgo-2.png"],
    codeFile: "MapScreen.tsx",
    codeLang: "TSX",
    codeSnippet: `// Real-time polyline decoder
function decodePolyline(encoded: string): LatLng[] {
  let points: LatLng[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    // ... decode lng similarly
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

// Fetch online drivers from Supabase
const fetchDrivers = async () => {
  const { data } = await supabase
    .from('drivers')
    .select('driver_id,latitude,longitude,jeep_code')
    .eq('is_online', true);
  setDrivers(data || []);
};

// Book a ride
const handleBookRide = async (driverId: string) => {
  const { data } = await supabase
    .from('ride_requests')
    .insert({ passenger_id, driver_id: driverId,
      from_x: userLat, from_y: userLng,
      to_x: stopLat,  to_y: stopLng,
      status: 'pending' })
    .select('*').single();
  router.push({ pathname: '/ride_tracking',
    params: { requestId: data.request_id } });
};`,
  },
  {
    id: "pollpro",
    num: "PROJECT_02",
    title: "Sydney PollPro",
    subtitle: "Web-Based University Election & Voting System",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    description:
      "A full-stack university election platform with secure authentication, real-time vote counts, candidate management, and dual election scopes — university-wide and per-organization.",
    features: [
      "Supabase Auth with voter profile verification",
      "University-wide & org-scoped election separation",
      "Candidate approval workflow & position management",
      "Real-time vote count stats per election",
      "Detailed election modal with candidates & periods",
    ],
    hasCode: true,
    imageSrcs: ["/pollpro-1.png", "/pollpro-2.png"],
    codeFile: "dashboard/page.tsx",
    codeLang: "TSX",
    codeSnippet: `// Fetch elections for the logged-in voter
async function fetchElections() {
  const uniRes = await fetch(
    '/api/get-voting-data?scope=university'
  );
  const orgRes = await fetch(
    \`/api/get-voting-data?scope=organization
     &department_org=\${departmentOrg}\`
  );
  const uniElections = await attachPositions(
    (await uniRes.json()).elections
  );
  setUniversityElections(uniElections);
}

// Auth check on mount
useEffect(() => {
  async function checkAuth() {
    const { data: { user } } =
      await supabase.auth.getUser();
    setIsLoggedIn(!!user);
    if (user) await fetchVoterProfile(user);
  }
  checkAuth();
}, []);

// Route to voting page
const handleVoteNow = (electionId: string) => {
  router.push(
    \`/OrganizationElection?election_id=\${electionId}
     &department_org=\${userProfile?.department_org}\`
  );
};`,
  },
  {
    id: "wildmarket",
    num: "PROJECT_03",
    title: "Online Campus Wild Market",
    subtitle: "UI/UX Design — Campus Marketplace Platform",
    stack: ["Figma", "UI/UX Design", "Prototyping"],
    description:
      "A fully designed campus online marketplace where students can buy, sell, and rent items within their university. Focused on intuitive UX, clear information hierarchy, and student-friendly flows.",
    features: [
      "End-to-end Figma prototype with user flows",
      "Product listing, search & filter design",
      "Rent vs buy dual-mode item cards",
      "Student authentication & profile screens",
      "Responsive component library in Figma",
    ],
    hasCode: false,
    imageSrcs: ["/wildmarket-1.png", "/wildmarket-2.png"],
    isDesign: true,
  },
  {
    id: "adoption",
    num: "PROJECT_04",
    title: "Child Adoption Center System",
    subtitle: "Console-Based Records Management System",
    stack: ["C Programming"],
    description:
      "A console-based system for managing child adoption records and requests. Handles full CRUD operations for adoption data with structured record tracking and status management.",
    features: [
      "Console UI with menu-driven navigation",
      "CRUD operations for adoption records",
      "Request tracking and status updates",
      "File I/O for persistent data storage",
      "Structured record management in C",
    ],
    hasCode: false,
  },
  {
    id: "docmanagement",
    num: "PROJECT_05",
    title: "Student Document Management System",
    subtitle: "Desktop App with Database Integration",
    stack: ["C#", "Windows Forms", "MS Access"],
    description:
      "A desktop document request and scheduling system for students with full database integration, request tracking, and an intuitive Windows Forms interface built in C# and MS Access.",
    features: [
      "Windows Forms desktop UI",
      "MS Access database integration",
      "Document request & scheduling workflow",
      "Request status tracking per student",
      "CRUD operations with Basic ERD design",
    ],
    hasCode: false,
  },
];

const SKILLS = [
  {
    category: "// frontend",
    tags: ["React Native", "Next.js", "React.js", "TypeScript", "HTML/CSS/JS", "Tailwind CSS"],
  },
  {
    category: "// backend & db",
    tags: ["Supabase", "MS Access", "CRUD Operations", "Basic ERD Design", "Git & GitHub"],
  },
  {
    category: "// systems & hardware",
    tags: ["C Programming", "C# Windows Forms", "Arduino", "Cisco Packet Tracer"],
  },
  {
    category: "// design & tools",
    tags: ["Figma", "UI/UX Design", "Prototyping", "Expo", "VS Code"],
  },
];

// ─── Syntax highlight (no external lib needed) ────────────────────────────────
function highlight(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(\/\/.*)/g, '<span class="tok-cm">$1</span>')
    .replace(/\b(const|let|var|async|await|function|return|if|while|do)\b/g, '<span class="tok-kw">$1</span>')
    .replace(/('.*?'|`[\s\S]*?`)/g, '<span class="tok-str">$1</span>')
    .replace(/\b(\d+(?:e\d+)?)\b/g, '<span class="tok-num">$1</span>')
    .replace(/\b([a-z][a-zA-Z]+)(?=\()/g, '<span class="tok-fn">$1</span>')
    .replace(/\b(string|number|boolean|LatLng|void)\b/g, '<span class="tok-type">$1</span>');
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ImageGallery({ srcs, title }: { srcs: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const showPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveIndex((index) => (index - 1 + srcs.length) % srcs.length);
    setZoom(1);
  };

  const showNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveIndex((index) => (index + 1) % srcs.length);
    setZoom(1);
  };

  const zoomIn = (event: React.MouseEvent) => {
    event.stopPropagation();
    setZoom((value) => Math.min(2, value + 0.2));
  };

  const zoomOut = (event: React.MouseEvent) => {
    event.stopPropagation();
    setZoom((value) => Math.max(1, value - 0.2));
  };

  return (
    <>
      <div style={styles.carouselWrapper} onClick={() => setIsOpen(true)}>
        <div style={styles.carouselCard}>
          <img
            src={srcs[activeIndex]}
            alt={`${title} screenshot ${activeIndex + 1}`}
            style={styles.carouselImage}
          />
          <div style={styles.carouselLabel}>
            <span>{title}</span>
            <span>{activeIndex + 1}/{srcs.length}</span>
          </div>
          <button style={styles.carouselButtonPrev} onClick={showPrev}>
            ←
          </button>
          <button style={styles.carouselButtonNext} onClick={showNext}>
            →
          </button>
        </div>
        <div style={styles.thumbnailStack}>
          {srcs.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(idx);
              }}
              style={{
                ...styles.thumbnailCard,
                ...(activeIndex === idx ? styles.thumbnailCardActive : {}),
                transform: `translateX(${idx * 6}px) translateY(${idx * 3}px)`,
                opacity: activeIndex === idx ? 1 : 0.8,
              }}
            >
              <img
                src={src}
                alt={`${title} thumbnail ${idx + 1}`}
                style={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      </div>
      {isOpen && (
        <div style={styles.lightboxOverlay} onClick={() => { setIsOpen(false); setZoom(1); }}>
          <div style={styles.lightboxContent} onClick={(event) => event.stopPropagation()}>
            <button style={styles.lightboxClose} onClick={() => { setIsOpen(false); setZoom(1); }}>
              ×
            </button>
            <button style={styles.lightboxPrev} onClick={showPrev}>
              ←
            </button>
            <div style={styles.lightboxViewer}>
              <img
                src={srcs[activeIndex]}
                alt={`${title} screenshot ${activeIndex + 1}`}
                style={{ ...styles.lightboxImage, transform: `scale(${zoom})` }}
              />
            </div>
            <button style={styles.lightboxNext} onClick={showNext}>
              →
            </button>
            <div style={styles.lightboxZoomControls}>
              <button style={styles.lightboxZoomButton} onClick={zoomOut}>-</button>
              <span style={styles.lightboxZoomLabel}>{Math.round(zoom * 100)}%</span>
              <button style={styles.lightboxZoomButton} onClick={zoomIn}>+</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CodePanel({ file, lang, snippet }: { file: string; lang: string; snippet: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={styles.codePanel}>
      <div style={styles.codeHeader}>
        <span style={{ ...styles.codeDot, background: "#ff5f56" }} />
        <span style={{ ...styles.codeDot, background: "#ffbd2e" }} />
        <span style={{ ...styles.codeDot, background: "#27c93f" }} />
        <span style={styles.codeFilename}>{file}</span>
        <span style={styles.codeLangBadge}>{lang}</span>
        <button onClick={copy} style={styles.copyBtn}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <div style={styles.codeBody}>
        <pre
          style={styles.codePre}
          dangerouslySetInnerHTML={{ __html: highlight(snippet) }}
        />
      </div>
    </div>
  );
}

function DesignPreview() {
  return (
    <div style={styles.figmaPanel}>
      <div style={styles.figmaMockup}>
        <div style={styles.mockTopbar}>
          <span style={styles.mockLogo}>WildMarket</span>
          <div style={{ display: "flex", gap: 12 }}>
            {["Browse", "Sell", "Rent", "Profile"].map((n) => (
              <span key={n} style={styles.mockNavItem}>{n}</span>
            ))}
          </div>
        </div>
        <div style={styles.mockHero}>
          <div style={styles.mockTitle}>Campus Marketplace</div>
          <div style={styles.mockSub}>// buy · sell · rent — students only</div>
          <span style={styles.mockBtn}>Browse Items</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["TEXTBOOKS", "142 listings"], ["GADGETS", "89 listings"], ["FOR RENT", "37 items"]].map(
            ([label, val]) => (
              <div key={label} style={styles.mockCard}>
                <div style={styles.mockCardLabel}>{label}</div>
                <div style={styles.mockCardVal}>{val}</div>
              </div>
            )
          )}
        </div>
      </div>
      <div style={styles.figmaNote}>// UI/UX prototype — Figma design, not yet developed</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        {["Auto Layout", "Component Library", "Prototype Flow", "Design System"].map((t) => (
          <span key={t} style={styles.figmaTool}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function NoCodePreview({ title }: { title: string }) {
  const isC = title.toLowerCase().includes("adoption");
  return (
    <div style={styles.noCodePanel}>
      <div style={styles.codeHeader}>
        <span style={{ ...styles.codeDot, background: "#ff5f56" }} />
        <span style={{ ...styles.codeDot, background: "#ffbd2e" }} />
        <span style={{ ...styles.codeDot, background: "#27c93f" }} />
        <span style={styles.codeFilename}>{isC ? "main.c" : "MainForm.cs"}</span>
        <span style={styles.codeLangBadge}>{isC ? "C" : "C#"}</span>
      </div>
      <div style={{ ...styles.codeBody, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>{isC ? "🖥️" : "📋"}</span>
        <span style={{ fontFamily: "var(--mono, monospace)", fontSize: 12, color: "#3a5068", textAlign: "center" as const }}>
          // code snippet not available
        </span>
        <span style={{ fontFamily: "var(--mono, monospace)", fontSize: 11, color: "#2a3a50", textAlign: "center" as const }}>
          {isC ? "C console application" : "C# Windows Forms desktop app"}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [typedName, setTypedName] = useState("");
  const [activeSection, setActiveSection] = useState("about");
  const fullName = "Harlie Khurt T. Cañas";
  const mountedRef = useRef(false);

  // Typewriter
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullName.length) {
        setTypedName(fullName.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 65);
    return () => clearInterval(timer);
  }, []);

  // Scroll spy
  useEffect(() => {
    const handler = () => {
      const sections = ["about", "projects", "skills", "contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={styles.root}>
      <GlobalStyles />
      {/* Scanline overlay */}
      <div style={styles.scanline} />

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={{ color: "#7a94aa" }}>~/</span>my_portfolio<span style={{ color: "#7a94aa" }}>.dev</span>
        </div>
        <div style={styles.navLinks}>
          {[
            { id: "about", label: "about" },
            { id: "projects", label: "projects" },
            { id: "skills", label: "skills" },
            { id: "contact", label: "contact" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                ...styles.navLink,
                color: activeSection === id ? "#00ff88" : "#7a94aa",
              }}
            >
              {activeSection === id && <span style={styles.navDot} />}
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={styles.hero}>
        <div style={styles.heroTag}>// Looking for OJT</div>
        <h1 style={styles.heroName}>
          {typedName}
          <span style={styles.cursor} />
        </h1>
        <div style={styles.heroTitle}>Computer Engineer — Full Stack &amp; Mobile Dev</div>
        <p style={styles.heroDesc}>
          BS Computer Engineering student at Cebu Institute of Technology. I build real-time mobile apps,
          data-driven web platforms, and user-centered interfaces. Currently seeking OJT opportunities to
          grow and contribute.
        </p>
        <div style={styles.heroBtns}>
          <button onClick={() => scrollTo("projects")} style={styles.btnPrimary}>view my work</button>
          <button onClick={() => scrollTo("contact")} style={styles.btnSec}>contact info</button>
        </div>
        <div style={styles.heroStats}>
          {[["5", "projects"], ["6+", "languages"], ["OJT", "ready"]].map(([num, label]) => (
            <div key={label} style={styles.statBox}>
              <div style={styles.statNum}>{num}</div>
              <div style={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" style={styles.section}>
        <SectionHeader num="01." title="About me" />
        <div style={styles.aboutGrid}>
          <div style={styles.terminalBox}>
            <div style={styles.termTitle}>// who am I</div>
            {[
              ["role", "CompE Student"],
              ["school", "CIT-U"],
              ["location", "Talisay City, Cebu"],
              ["contact", "harliekhurt009@gmail.com"],
            ].map(([key, val]) => (
              <div key={key}>
                <div style={styles.termLine}>
                  <span style={styles.prompt}>$</span>
                  <span style={{ color: "#fff" }}>{key}</span>
                </div>
                <div style={{ ...styles.termLine, paddingLeft: 16, color: "#7a94aa", fontSize: 11 }}>{val}</div>
              </div>
            ))}
            <div style={styles.termLine}>
              <span style={styles.prompt}>$</span>
              <span style={{ color: "#fff" }}>status</span>
            </div>
            <div style={{ ...styles.termLine, paddingLeft: 16, color: "#00ff88", fontSize: 11 }}>open to OJT ✓</div>
          </div>
          <div style={styles.aboutText}>
            <p style={{ marginBottom: "1rem" }}>
              I'm a BS Computer Engineering student at Cebu Institute of Technology (2023 – Present),
              previously a STEM graduate from Asian College of Technology (2021 – 2023). I have a passion
              for building things people actually use.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              From real-time mobile ride-hailing apps to secure university voting systems — I enjoy solving
              real problems with clean code. My experience spans mobile development with{" "}
              <strong style={{ color: "#fff" }}>React Native & Expo</strong>, full-stack web development
              with <strong style={{ color: "#fff" }}>Next.js & TypeScript</strong>, backend with{" "}
              <strong style={{ color: "#fff" }}>Supabase & MS Access</strong>, systems programming in{" "}
              <strong style={{ color: "#fff" }}>C & C#</strong>, and UI/UX design with{" "}
              <strong style={{ color: "#fff" }}>Figma</strong>.
            </p>
            <p>
              I'm looking for an OJT where I can contribute, learn from experienced engineers, and ship
              real software in a professional environment.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={styles.section}>
        <SectionHeader num="02." title="Featured Projects" />
        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#1e2a38" }}>
          {PROJECTS.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={styles.section}>
        <SectionHeader num="03." title="Skills & Tools" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: "#1e2a38" }}>
          {SKILLS.map((cat) => (
            <div key={cat.category} style={styles.skillCat}>
              <div style={styles.skillCatTitle}>{cat.category}</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                {cat.tags.map((tag) => (
                  <span key={tag} style={styles.skillTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={styles.section}>
        <SectionHeader num="04." title="Contact" />
        <div style={styles.contactBox}>
          <div style={styles.contactTitle}>// Seeking for OJT</div>
          <div style={styles.contactSub}>Looking for internship opportunities. Let's build something together.</div>
          <div style={styles.contactLinks}>
            {[
              { label: "Email me", href: "mailto:harliekhurt009@gmail.com" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/harlie-khurt-cañas-23aa183a2" },
              { label: "GitHub", href: "https://github.com/major119791" },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={styles.contactLink}>{label}</a>
            ))}
          </div>
          <div style={{ marginTop: "2rem", fontFamily: "monospace", fontSize: 12, color: "#3a5068" }}>
            09935567055 &nbsp;·&nbsp; Talisay City, Cebu
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        build with passion &nbsp;—&nbsp;{" "}
        <span style={{ color: "#00ff88" }}>Harlie Khurt T. Cañas</span>
        &nbsp;|&nbsp; BS Computer Engineering &nbsp;|&nbsp; seeking OJT
      </footer>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5rem" }}>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#00ff88", letterSpacing: 1 }}>{num}</span>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff" }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "#1e2a38", maxWidth: 200 }} />
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  return (
    <div style={styles.projectCard}>
      <div style={styles.projHeader}>
        <div>
          <div style={styles.projNum}>{project.num}</div>
          <div style={styles.projTitle}>{project.title}</div>
          <div style={styles.projSub}>{project.subtitle}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, justifyContent: "flex-end", maxWidth: 260 }}>
          {project.stack.map((s) => (
            <span key={s} style={styles.badge}>{s}</span>
          ))}
        </div>
      </div>
      <div style={styles.projBody}>
        <div>
          <p style={styles.projDesc}>{project.description}</p>
          <ul style={styles.featureList}>
            {project.features.map((f) => (
              <li key={f} style={styles.featureItem}>
                <span style={{ color: "#00ff88", marginRight: 8 }}>&gt;</span>{f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {project.imageSrcs ? (
            <ImageGallery srcs={project.imageSrcs} title={project.title} />
          ) : project.hasCode && project.codeSnippet ? (
            <CodePanel
              file={project.codeFile!}
              lang={project.codeLang!}
              snippet={project.codeSnippet}
            />
          ) : project.isDesign ? (
            <DesignPreview />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const mono = "'Share Tech Mono', 'Courier New', monospace";
const sans = "'Rajdhani', 'Segoe UI', sans-serif";

const styles: Record<string, CSSProperties> = {
  root: {
    background: "#0a0c10",
    color: "#c9d6e3",
    fontFamily: sans,
    minHeight: "100vh",
    overflowX: "hidden",
  },
  scanline: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,0.012) 2px,rgba(0,255,136,0.012) 4px)",
    pointerEvents: "none",
    zIndex: 999,
  },
  // NAV
  nav: {
    position: "sticky",
    top: 0, zIndex: 100,
    background: "rgba(10,12,16,0.96)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #1e2a38",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
  },
  navLogo: {
    fontFamily: mono,
    color: "#00ff88",
    fontSize: 15,
    letterSpacing: 1,
  },
  navLinks: { display: "flex", gap: "2rem", alignItems: "center" },
  navLink: {
    fontFamily: mono,
    fontSize: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    letterSpacing: 1,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: 0,
    transition: "color .2s",
  },
  navDot: {
    display: "inline-block",
    width: 6, height: 6,
    background: "#00ff88",
    borderRadius: "50%",
  },
  // HERO
  hero: {
    padding: "5rem 2rem 4rem",
    maxWidth: 960,
    margin: "0 auto",
  },
  heroTag: {
    fontFamily: mono,
    fontSize: 12,
    color: "#00ff88",
    letterSpacing: 2,
    marginBottom: "1rem",
  },
  heroName: {
    fontFamily: sans,
    fontSize: "clamp(2rem, 5vw, 4rem)",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.05,
    marginBottom: ".5rem",
    letterSpacing: -1,
  },
  cursor: {
    display: "inline-block",
    width: 3, height: "0.85em",
    background: "#00ff88",
    marginLeft: 4,
    verticalAlign: "middle",
    animation: "blink .8s infinite",
  },
  heroTitle: {
    fontFamily: mono,
    fontSize: "1rem",
    color: "#b36cff",
    marginBottom: "1.5rem",
    letterSpacing: 1,
  },
  heroDesc: {
    fontSize: "1.05rem",
    color: "#7a94aa",
    maxWidth: 540,
    lineHeight: 1.7,
    marginBottom: "2.5rem",
  },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "2rem" },
  btnPrimary: {
    fontFamily: mono, fontSize: 13,
    padding: ".6rem 1.5rem",
    background: "transparent",
    border: "1px solid #00ff88",
    color: "#00ff88",
    cursor: "pointer",
    letterSpacing: 1,
  },
  btnSec: {
    fontFamily: mono, fontSize: 13,
    padding: ".6rem 1.5rem",
    background: "transparent",
    border: "1px solid #2a3a50",
    color: "#7a94aa",
    cursor: "pointer",
    letterSpacing: 1,
  },
  heroStats: { display: "flex", gap: "1.5rem", flexWrap: "wrap" },
  statBox: {
    border: "1px solid #1e2a38",
    padding: "1rem 1.5rem",
  },
  statNum: { fontFamily: mono, fontSize: "1.8rem", color: "#00ff88", fontWeight: 700 },
  statLabel: { fontFamily: mono, fontSize: 11, color: "#3a5068", letterSpacing: 1, marginTop: ".2rem" },
  // SECTIONS
  section: { padding: "4rem 2rem", maxWidth: 960, margin: "0 auto" },
  // ABOUT
  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "2rem",
  },
  terminalBox: {
    background: "#0f1117",
    border: "1px solid #1e2a38",
    padding: "1.25rem",
  },
  termTitle: { fontFamily: mono, fontSize: 11, color: "#3a5068", marginBottom: "1rem", letterSpacing: 1 },
  termLine: { fontFamily: mono, fontSize: 12, color: "#c9d6e3", marginBottom: ".4rem" },
  prompt: { color: "#00ff88", marginRight: 8 },
  aboutText: { fontSize: "1rem", color: "#7a94aa", lineHeight: 1.8 },
  // PROJECTS
  projectCard: { background: "#0f1117" },
  projHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #1e2a38",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  projNum: { fontFamily: mono, fontSize: 11, color: "#00ff88", letterSpacing: 2, marginBottom: ".4rem" },
  projTitle: { fontFamily: sans, fontSize: "1.35rem", fontWeight: 700, color: "#fff", marginBottom: ".25rem" },
  projSub: { fontFamily: mono, fontSize: 11, color: "#b36cff", letterSpacing: 1 },
  badge: {
    fontFamily: mono, fontSize: 10,
    padding: ".2rem .5rem",
    border: "1px solid #2a3a50",
    color: "#3a5068",
    whiteSpace: "nowrap",
  },
  projBody: {
    padding: "1.5rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  projDesc: { fontSize: "1rem", color: "#7a94aa", lineHeight: 1.7, marginBottom: "1rem" },
  featureList: { listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 },
  featureItem: { fontFamily: mono, fontSize: 11, color: "#7a94aa", display: "flex", alignItems: "flex-start" },
  carouselWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    marginTop: "1rem",
    width: "100%",
  },
  carouselCard: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #1e2a38",
    cursor: "pointer",
    minHeight: 260,
    background: "#0f1117",
    boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
    transition: "transform .25s ease, box-shadow .25s ease",
  },
  carouselCardHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
  },
  carouselImage: {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform .3s ease, opacity .35s ease",
    objectFit: "cover",
  },
  carouselLabel: {
    position: "absolute",
    left: 16,
    bottom: 16,
    right: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: mono,
    fontSize: 12,
    color: "#c9d6e3",
    background: "rgba(10, 12, 16, 0.78)",
    padding: "0.7rem 1rem",
    borderRadius: 999,
    gap: "0.5rem",
  },
  carouselButtonPrev: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "rgba(0, 0, 0, 0.55)",
    color: "#00ff88",
    fontSize: 18,
    width: 42,
    height: 42,
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background .2s ease, transform .2s ease",
  },
  carouselButtonNext: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "rgba(0, 0, 0, 0.55)",
    color: "#00ff88",
    fontSize: 18,
    width: 42,
    height: 42,
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background .2s ease, transform .2s ease",
  },
  thumbnailStack: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
    overflowX: "auto",
    paddingBottom: "0.25rem",
  },
  thumbnailCard: {
    border: "1px solid #1e2a38",
    borderRadius: 14,
    overflow: "hidden",
    width: 120,
    minWidth: 120,
    height: 84,
    padding: 0,
    background: "#0f1117",
    cursor: "pointer",
    transition: "transform .2s ease, box-shadow .2s ease, opacity .2s ease",
  },
  thumbnailCardActive: {
    transform: "scale(1.03)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  lightboxOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "1.5rem",
  },
  lightboxContent: {
    position: "relative",
    maxWidth: "92vw",
    maxHeight: "92vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  lightboxViewer: {
    position: "relative",
    width: "100%",
    maxWidth: "88vw",
    maxHeight: "78vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 16,
    background: "#0a0c10",
  },
  lightboxImage: {
    width: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 16,
    display: "block",
    transition: "transform .2s ease",
  },
  lightboxZoomControls: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(10, 12, 16, 0.72)",
    padding: "0.65rem 1rem",
    borderRadius: 999,
    fontFamily: mono,
    color: "#c9d6e3",
  },
  lightboxZoomButton: {
    border: "none",
    background: "rgba(0, 0, 0, 0.75)",
    color: "#00ff88",
    fontSize: 18,
    width: 36,
    height: 36,
    borderRadius: "50%",
    cursor: "pointer",
  },
  lightboxZoomLabel: {
    minWidth: 44,
    textAlign: "center",
    fontFamily: mono,
    fontSize: 12,
  },
  lightboxClose: {
    position: "absolute",
    top: 12,
    right: 12,
    border: "none",
    background: "rgba(0, 0, 0, 0.75)",
    color: "#fff",
    fontSize: 24,
    width: 44,
    height: 44,
    borderRadius: "50%",
    cursor: "pointer",
  },
  lightboxPrev: {
    position: "absolute",
    top: "50%",
    left: 12,
    transform: "translateY(-50%)",
    border: "none",
    background: "rgba(0, 0, 0, 0.75)",
    color: "#00ff88",
    fontSize: 20,
    width: 44,
    height: 44,
    borderRadius: "50%",
    cursor: "pointer",
  },
  lightboxNext: {
    position: "absolute",
    top: "50%",
    right: 12,
    transform: "translateY(-50%)",
    border: "none",
    background: "rgba(0, 0, 0, 0.75)",
    color: "#00ff88",
    fontSize: 20,
    width: 44,
    height: 44,
    borderRadius: "50%",
    cursor: "pointer",
  },
  // CODE PANEL
  codePanel: { background: "#060809", border: "1px solid #1e2a38", overflow: "hidden" },
  noCodePanel: { background: "#060809", border: "1px solid #1e2a38", overflow: "hidden", minHeight: 220 },
  codeHeader: {
    background: "#161b24",
    padding: ".5rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderBottom: "1px solid #1e2a38",
  },
  codeDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  codeFilename: { fontFamily: mono, fontSize: 11, color: "#3a5068", marginLeft: 6, flex: 1 },
  codeLangBadge: {
    fontFamily: mono, fontSize: 10,
    color: "#00ff88",
    padding: ".1rem .5rem",
    border: "1px solid #009944",
  },
  copyBtn: {
    fontFamily: mono, fontSize: 10,
    background: "transparent",
    border: "1px solid #2a3a50",
    color: "#3a5068",
    cursor: "pointer",
    padding: ".15rem .5rem",
    marginLeft: 4,
  },
  codeBody: {
    padding: "1rem",
    maxHeight: 240,
    overflowY: "auto",
    overflowX: "auto",
  },
  codePre: {
    fontFamily: mono,
    fontSize: 11,
    lineHeight: 1.75,
    color: "#7a94aa",
    margin: 0,
    whiteSpace: "pre",
  },
  // FIGMA PREVIEW
  figmaPanel: {
    background: "#060809",
    border: "1px solid #1e2a38",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  figmaMockup: {
    background: "#161b24",
    border: "1px solid #2a3a50",
    borderRadius: 4,
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  mockTopbar: { display: "flex", alignItems: "center", gap: 8 },
  mockLogo: { fontFamily: mono, fontSize: 12, color: "#00ff88", fontWeight: 700 },
  mockNavItem: { fontFamily: mono, fontSize: 10, color: "#3a5068" },
  mockHero: {
    background: "linear-gradient(135deg,#1a1030 0%,#0f1a2a 100%)",
    borderRadius: 4,
    padding: "1rem",
    border: "1px solid #2a3a50",
  },
  mockTitle: { fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: ".25rem" },
  mockSub: { fontFamily: mono, fontSize: 10, color: "#3a5068", marginBottom: ".6rem" },
  mockBtn: {
    display: "inline-block",
    fontFamily: mono, fontSize: 10,
    padding: ".3rem .7rem",
    background: "#009944",
    color: "#000",
    borderRadius: 2,
    fontWeight: 700,
  },
  mockCard: {
    flex: 1,
    minWidth: 70,
    background: "#0f1117",
    border: "1px solid #1e2a38",
    borderRadius: 2,
    padding: ".5rem",
  },
  mockCardLabel: { fontFamily: mono, fontSize: 9, color: "#3a5068", marginBottom: ".25rem" },
  mockCardVal: { fontSize: 12, fontWeight: 600, color: "#c9d6e3" },
  figmaNote: { fontFamily: mono, fontSize: 11, color: "#3a5068" },
  figmaTool: {
    fontFamily: mono, fontSize: 10,
    padding: ".2rem .5rem",
    border: "1px solid #2a3a50",
    color: "#3a5068",
  },
  // SKILLS
  skillCat: { background: "#0f1117", padding: "1.25rem" },
  skillCatTitle: { fontFamily: mono, fontSize: 11, color: "#00ff88", letterSpacing: 2, marginBottom: "1rem" },
  skillTag: {
    fontFamily: mono, fontSize: 11,
    padding: ".3rem .7rem",
    border: "1px solid #2a3a50",
    color: "#7a94aa",
    letterSpacing: .5,
  },
  // CONTACT
  contactBox: {
    background: "#0f1117",
    border: "1px solid #1e2a38",
    padding: "2.5rem",
    textAlign: "center",
  },
  contactTitle: { fontFamily: mono, fontSize: "1.4rem", color: "#00ff88", marginBottom: ".5rem" },
  contactSub: { fontFamily: mono, fontSize: 13, color: "#7a94aa", marginBottom: "2rem" },
  contactLinks: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  contactLink: {
    fontFamily: mono, fontSize: 12,
    padding: ".7rem 1.5rem",
    border: "1px solid #2a3a50",
    color: "#7a94aa",
    textDecoration: "none",
    letterSpacing: 1,
    display: "inline-block",
  },
  // FOOTER
  footer: {
    borderTop: "1px solid #1e2a38",
    padding: "1.5rem 2rem",
    textAlign: "center",
    fontFamily: mono,
    fontSize: 11,
    color: "#3a5068",
  },
};