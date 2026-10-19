/* De Nieuwe Koers 2.0, shared bits: icons, logo, header, footer */

const Icon = ({ name, size = 20, stroke = 2 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    pin: <><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    heart: <path d="M19 14c1.5-1.5 3-3.4 3-5.5A5.5 5.5 0 0 0 12 5 5.5 5.5 0 0 0 2 8.5c0 2.1 1.5 4 3 5.5l7 7Z" />,
    spark: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M18 6l-2.5 2.5M6 18l2.5-2.5M18 18l-2.5-2.5" />,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" /></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 14 3-3 3 3 5-6" /></>,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  };
  return <svg {...p} aria-hidden="true">{paths[name]}</svg>;
};

const BrandLogo = () => (
  <span className="nav-logo" aria-label="De Nieuwe Koers">
    <img src="assets/logo-transparent.png" alt="De Nieuwe Koers" />
  </span>
);

const Header = ({ navigate, page = "home" }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "kompas", label: "Dagbesteding Het Kompas" },
    { id: "aanbod", label: "Ons aanbod" },
    { id: "overons", label: "Over ons", children: [
      { id: "overons", label: "Over ons" },
      { id: "werkenbij", label: "Werken bij" },
    ] },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <header className="site-header">
      <div className="nav-row">
        <button onClick={() => navigate("home")} aria-label="Naar home" style={{ display: "flex" }}>
          <BrandLogo />
        </button>
        <nav className="nav-links" aria-label="Hoofdmenu">
          {links.map((l) => (
            l.children ? (
              <div className="nav-dropdown" key={l.id}>
                <button className={`nav-dropdown-toggle ${l.children.some((c) => c.id === page) ? "active" : ""}`} aria-haspopup="true" onClick={() => navigate(l.id)}>
                  {l.label}
                  <svg className="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <div className="nav-dropdown-menu" role="menu">
                  {l.children.map((c) => (
                    <button key={c.id} role="menuitem" onClick={() => navigate(c.id)}>{c.label}</button>
                  ))}
                </div>
              </div>
            ) : (
              <button key={l.id} className={page === l.id ? "active" : ""} onClick={() => navigate(l.id)}>{l.label}</button>
            )
          ))}
        </nav>
        <div className="nav-cta">
          <a className="nav-portal" href="https://het-kompas.net/" target="_blank" rel="noopener noreferrer">Mijn portaal</a>
          <button className="btn btn-accent" onClick={() => navigate("aanmelden")}>Direct aanmelden</button>
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="nav-mobile-panel">
          {links.flatMap((l) => (
            l.children
              ? l.children.map((c) => (
                  <button key={c.id} onClick={() => { navigate(c.id); setMobileOpen(false); }}>{c.label}</button>
                ))
              : [<button key={l.id} onClick={() => { navigate(l.id); setMobileOpen(false); }}>{l.label}</button>]
          ))}
          <button onClick={() => { navigate("aanmelden"); setMobileOpen(false); }} className="btn btn-accent" style={{ marginTop: 8 }}>Direct aanmelden</button>
        </div>
      )}
    </header>
  );
};

const Footer = ({ navigate }) => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="assets/logo-transparent.png" alt="De Nieuwe Koers" />
          <p>Jongeren tussen 12 en 23 begeleiden naar krachtige groei. Persoonlijk, professioneel en op maat, in de regio Zoetermeer.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><Icon name="facebook" size={16} /></a>
            <a href="#" aria-label="Instagram"><Icon name="instagram" size={16} /></a>
            <a href="#" aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Aanbod</h5>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("kompas"); }}>Dagbesteding Het Kompas</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("aanbod"); }}>Ambulante &amp; gezinsbegeleiding</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("aanbod"); }}>Jeugdhulp &amp; onderwijs</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("aanbod"); }}>Trainingen &amp; diagnostiek</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Organisatie</h5>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("overons"); }}>Over ons &amp; team</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("werkenbij"); }}>Werken bij</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("faq"); }}>Veelgestelde vragen</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul style={{ color: "rgba(255,255,255,0.7)", fontSize: 14.5 }}>
            <li>Willem Dreeslaan 181</li>
            <li>2729 NE Zoetermeer</li>
            <li><a href="mailto:info@denieuwekoers.net">info@denieuwekoers.net</a></li>
            <li><a href="tel:0792340902">079 234 0902</a></li>
          </ul>
          <div className="footer-cert">
            <img src="assets/hkz-kleine-organisaties.jpg" alt="HKZ Kleine Organisaties gecertificeerd" />
            <span>HKZ Kleine Organisaties<br />gecertificeerd</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 De Nieuwe Koers B.V., KvK 96172630, AGB-code 78780874, SKJ-geregistreerd</span>
        <div className="footer-legal">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("privacy"); }}>Privacy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("av"); }}>Voorwaarden</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("klachten"); }}>Klacht melden</a>
        </div>
        <div className="footer-keurmerken">
          <span className="keurmerk">SKJ</span>
          <span className="keurmerk">NIP</span>
          <span className="keurmerk">HKZ</span>
        </div>
      </div>
    </div>
  </footer>
);

/* Scroll reveal hook */
/* Reveal is nu volledig CSS-gestuurd (load-animatie). Hook blijft als no-op
   zodat bestaande aanroepen werken. */
const useReveal = () => {};

/* CSS 3D tilt, volgt de muis, met perspectief. Respecteert reduced-motion & touch. */
const useTilt = (ref, max = 9) => {
  React.useEffect(() => {
    const el = ref && ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reduce || noHover) return;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
        el.style.setProperty("--gx", (px * 100 + 50).toFixed(1) + "%");
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", reset); cancelAnimationFrame(raf); };
  }, [ref]);
};

Object.assign(window, { Icon, BrandLogo, Header, Footer, useReveal, useTilt });
