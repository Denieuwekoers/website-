/* Ons aanbod, vijf richtingen, interactieve navigator */

const AANBOD = {
  dagbesteding: {
    label: "Dagbesteding Het Kompas",
    eyebrow: "Richting 01 · Dagbesteding Het Kompas",
    tone: "mint",
    img: "assets/poppetje-kompas.png",
    title: "Het Kompas: structuur, richting, vertrouwen en mensen die je zien.",
    lead: ["Voor jongeren die tijdelijk niet (volledig) naar school of werk kunnen. Geen prestatiedruk, wel een plek om even op adem te komen, een persoonlijk plan en begeleiders die weten wat er speelt."],
    bullets: [
      ["Kleine groepen (max. 6)", "1 op 6 begeleiding, vaste gezichten."],
      ["Persoonlijk plan", "Doelen die voor jou kloppen."],
      ["Maandag t/m vrijdag", "Dagprogramma met structuur, op jouw tempo."],
      ["Toekomst in zicht", "Praktische toekomstoriëntatie, trainingen en een eigen portfolio als bewijs van groei."],
    ],
    cta: "Lees meer over Het Kompas",
    ctaPage: "kompas",
  },
  ambulant: {
    label: "Ambulante- en gezinsbegeleiding",
    eyebrow: "Richting 02 · Ambulante- en gezinsbegeleiding",
    tone: "purple",
    img: "assets/illustration-3.png",
    title: "Ambulante- en gezinsbegeleiding.",
    lead: ["Begeleiding op de plek waar het echt gebeurt: thuis, op school of in de wijk. We werken niet alleen met de jongere, maar met het hele gezin. Want duurzame verandering begint zelden bij één persoon."],
    bullets: [
      ["Wekelijks 1-op-1", "Vaste begeleider"],
      ["Gezinsgesprekken", "Samen patronen doorbreken, niet alleen de jongere."],
      ["Praktisch & doelgericht", "Concrete stappen, geen eindeloos praten."],
      ["ZIN, PGB of particulier", "Wat past, dat regelen we."],
    ],
    cta: "Plan een kennismaking",
    ctaPage: "contact",
  },
  onderwijs: {
    label: "Jeugdhulp binnen het Onderwijs",
    eyebrow: "Richting 03 · Jeugdhulp binnen het Onderwijs",
    tone: "yellow",
    img: "assets/poppetje-onderwijs.png",
    title: "Vanuit de jongere.",
    lead: [
      "Sommige leerlingen hebben meer nodig dan een school kan bieden, maar minder dan een externe plaatsing. Precies daar zitten wij.",
      "We werken preventief en intern: op school, in de klas, naast de mentor. Niet als buitenstaander die af en toe langskomt, maar als vaste schakel in het team rondom de leerling. Samen met school bepalen we wat nodig is; shadow begeleiding, groepstraining of coaching 'Binnenboord'.",
      "Het doel is altijd hetzelfde: de leerling binnen boord houden, laten groeien en externe plaatsing voorkomen.",
    ],
    bullets: [
      ["Shadow begeleiding", "Een eigen coach naast de leerling in de klas."],
      ["Binnenboord", "Onze coaches werken actief samen met leerkrachten en mentoren: we signaleren, adviseren en stemmen af zodat school en begeleiding één lijn trekken."],
      ["Screenende diagnostiek", "Afname van bijv. WISC om betere inzichten te verkrijgen in wat een leerling nodig heeft."],
      ["Schooltrainingen", "Sociale vaardigheden, straatcultuur vs schoolcultuur, executieve functies."],
    ],
    cta: "Plan een gesprek",
    ctaPage: "contact",
  },
  trainingen: {
    label: "Trainingen & Workshops",
    eyebrow: "Richting 04 · Trainingen & Workshops",
    tone: "coral",
    img: "assets/poppetje-jeugdhulp.png",
    title: "Trainingen die echt iets veranderen.",
    lead: ["Groepstrainingen op maat, kort, praktisch en gericht op vaardigheden waar je morgen al wat aan hebt. Voor jongeren en voor de professionals die met hen werken. Geen theorie om theorie. Wat we trainen, oefenen we direct in de praktijk."],
    bullets: [
      ["Sociale vaardigheden", "Grenzen, samenwerken, gesprekken voeren."],
      ["Emotieregulatie", "Snappen wat er gebeurt vóór het te veel wordt."],
      ["Zelfvertrouwen & executieve functies", "Lef opbouwen, plannen, focus en afmaken."],
      ["Voor docententeams", "Praktische workshops voor leerkrachten en begeleiders over gedrag, communicatie en omgaan met complexe ondersteuningsvragen in de klas."],
    ],
    cta: "Plan een gesprek",
    ctaPage: "contact",
  },
  diagnostiek: {
    label: "Screenende Diagnostiek",
    eyebrow: "Richting 05 · Screenende Diagnostiek",
    tone: "green",
    img: "assets/illustration-3.png",
    title: "Beeld krijgen, zonder dat het een stempel wordt.",
    lead: ["Screenende diagnostiek door een GZ-orthopedagoog om beter te begrijpen wat er speelt en welke ondersteuning past. Helder, toegankelijk en altijd gericht op het vervolg, niet op het label."],
    bullets: [
      ["Screenend onderzoek", "Intelligentie, gedrag, sociaal-emotioneel."],
      ["Multidisciplinair team", "Orthopedagoog + jongerencoach + ouders."],
      ["Helder eindrapport", "In gewone taal, met concrete adviezen."],
      ["Direct vervolg", "Indien gewenst aansluitend begeleiding."],
    ],
    cta: "Plan een gesprek",
    ctaPage: "contact",
  },
};

const AanbodPanel = ({ s, navigate }) => (
  <div className="aanbod-panel" role="tabpanel" id={`panel-${s.key}`} aria-labelledby={`tab-${s.key}`}>
    <div className="ap-anim" key={s.key}>
      <div className="aanbod-panel-top">
        <div className="aanbod-panel-body">
          <span className={`eyebrow ${s.tone === "purple" ? "eyebrow--purple" : s.tone === "yellow" ? "eyebrow--yellow" : s.tone === "coral" ? "eyebrow--coral" : s.tone === "green" ? "eyebrow--green" : ""}`}>{s.eyebrow}</span>
          <h2>{s.title}</h2>
          {s.lead.map((para, i) => <p className="ap-lead" key={i}>{para}</p>)}
          <div className="ap-bullets">
            {s.bullets.map(([t, d]) => (
              <div className="ap-bullet" key={t}>
                <span className="ck"><Icon name="check" size={14} /></span>
                <div><strong>{t}</strong><p>{d}</p></div>
              </div>
            ))}
          </div>
          <div className="ap-actions">
            <button className="btn btn-accent btn-arrow" onClick={() => navigate(s.ctaPage)}>{s.cta} <Icon name="arrow" size={17} /></button>
            <button className="btn btn-soft" onClick={() => navigate("aanmelden")}>Direct aanmelden</button>
          </div>
        </div>
        <div className={`aanbod-panel-media tone-${s.tone}`}>
          <span className="am-blob" aria-hidden="true"></span>
          <img src={s.img} alt="" />
        </div>
      </div>
    </div>
  </div>
);

const RoutesViz = () => {
  const routes = [
    { d: "M40,46 C 190,46 250,120 432,196", c: "var(--c-primary-deep)", delay: "0s" },
    { d: "M40,123 C 210,123 270,168 432,196", c: "var(--c-purple-deep)", delay: "0.6s" },
    { d: "M40,200 C 230,200 300,200 432,200", c: "var(--c-yellow-deep)", delay: "1.2s" },
    { d: "M40,277 C 210,277 270,232 432,204", c: "var(--c-coral)", delay: "1.8s" },
    { d: "M40,354 C 190,354 250,280 432,204", c: "var(--c-green)", delay: "2.4s" },
  ];
  const starts = [46, 123, 200, 277, 354];
  return (
    <div className="routes-viz" role="img" aria-label="Vijf routes die samenkomen op één doel">
      <svg viewBox="0 0 480 400" aria-hidden="true">
        {routes.map((r, i) => (
          <path key={i} className="route-path" d={r.d} stroke={r.c} style={{ animationDelay: r.delay }} />
        ))}
        {/* start nodes */}
        {routes.map((r, i) => (
          <g key={`n${i}`} className="route-node">
            <circle cx="40" cy={starts[i]} r="11" fill="var(--c-paper)" stroke={r.c} strokeWidth="3" />
            <circle cx="40" cy={starts[i]} r="4" fill={r.c} />
          </g>
        ))}
        {/* traveling dots */}
        {routes.map((r, i) => (
          <circle key={`d${i}`} className="route-dot" r="5.5" fill={r.c}
            style={{ offsetPath: `path('${r.d}')`, animationDelay: r.delay }} />
        ))}
        {/* goal */}
        <circle className="routes-goal-ring" cx="440" cy="200" r="34" fill="none" stroke="var(--c-ink)" strokeWidth="2" opacity="0.5" style={{ transformOrigin: "440px 200px" }} />
        <circle className="routes-goal-core" cx="440" cy="200" r="24" fill="var(--c-ink)" style={{ transformOrigin: "440px 200px" }} />
        <path d="M440 188 a10 10 0 1 0 0.01 0 M440 213 v-4" stroke="var(--c-primary)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="440" cy="198" r="3.4" fill="var(--c-primary)" />
      </svg>
    </div>
  );
};

const AanbodPage = ({ navigate, initialActive }) => {
  useReveal();
  const keys = Object.keys(AANBOD);
  const [active, setActive] = React.useState(keys.includes(initialActive) ? initialActive : "dagbesteding");
  const s = { ...AANBOD[active], key: active };

  const railRef = React.useRef(null);
  const panelSectionRef = React.useRef(null);
  const onKey = (e) => {
    const i = keys.indexOf(active);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); setActive(keys[(i + 1) % keys.length]); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); setActive(keys[(i - 1 + keys.length) % keys.length]); }
  };

  // Scroll alleen vloeiend naar de info wanneer je via een Home-kaart binnenkomt
  // (dus mét een vooraf gekozen richting), niet bij een directe nav-klik.
  React.useEffect(() => {
    if (!keys.includes(initialActive)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setTimeout(() => {
      const el = panelSectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 76;
      try { window.scrollTo({ top, behavior: "smooth" }); } catch (e) { window.scrollTo(0, top); }
      const se = document.scrollingElement || document.documentElement;
      if (se && se.scrollTop < 10) {
        try { se.scrollTo({ top, behavior: "smooth" }); } catch (e) { se.scrollTop = top; }
      }
    }, 950);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page-content">
      {/* HERO */}
      <section className="aanbod-hero" style={{ padding: 0 }}>
        <div className="container" style={{ padding: "clamp(40px,6vw,72px) 24px clamp(44px,6vw,64px)" }}>
          <div className="aanbod-hero-grid">
            <div>
              <nav className="breadcrumb" aria-label="Kruimelpad">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
                <span aria-hidden="true">›</span>
                <span>Ons aanbod</span>
              </nav>
              <span className="eyebrow">Aanbod</span>
              <h1>Vijf richtingen, één doel.</h1>
              <p className="lead">Wat past bij jouw situatie? Kies een richting of bel ons en we denken samen mee.</p>
            </div>
            <RoutesViz />
          </div>
        </div>
      </section>

      {/* NAVIGATOR + PANEL */}
      <section ref={panelSectionRef}>
        <div className="container">
          <div className="aanbod-layout">
            <div className="aanbod-rail" role="tablist" aria-label="Ons aanbod" aria-orientation="vertical" ref={railRef} onKeyDown={onKey}>
              {keys.map((key, i) => {
                const v = AANBOD[key];
                const isOn = active === key;
                return (
                  <button
                    key={key}
                    id={`tab-${key}`}
                    role="tab"
                    aria-selected={isOn}
                    aria-controls={`panel-${key}`}
                    tabIndex={isOn ? 0 : -1}
                    className={`aanbod-tab tone-${v.tone} ${isOn ? "is-active" : ""}`}
                    onClick={() => setActive(key)}
                  >
                    <span className="at-num">{`0${i + 1}`}</span>
                    <span className="at-label">{v.label}</span>
                    <span className="at-arrow" aria-hidden="true"><Icon name="arrow" size={18} /></span>
                  </button>
                );
              })}
            </div>
            <AanbodPanel s={s} navigate={navigate} />
          </div>
        </div>
      </section>

      {/* WERKWIJZE */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="aanbod-werkwijze reveal">
            <div>
              <span className="eyebrow" style={{ background: "#fff" }}>Onze werkwijze</span>
              <h2>Vijf richtingen, één manier van werken.</h2>
              <p className="aw-lead">
                Of het nu gaat om dagbesteding, begeleiding thuis of ondersteuning op school de aanpak is altijd
                hetzelfde. We starten met een heldere hulpvraag, stellen meetbare doelen op en evalueren periodiek
                op basis van data. Geen losse indrukken, maar aantoonbare voortgang. Voor jongeren, ouders en
                verwijzers inzichtelijk gedurende het traject, niet achteraf.
              </p>
            </div>
            <ul className="aw-checks">
              {[
                "Bewezen methodieken als basis",
                "Meetbare doelen vanaf dag één",
                "Periodieke evaluaties, bijsturen waar nodig",
                "SKJ- en NIP-geregistreerde professionals",
                "HKZ-gecertificeerd",
              ].map((t) => (
                <li key={t}><span className="ck"><Icon name="check" size={15} /></span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="container">
          <div className="closing-cta reveal">
            <span className="eyebrow eyebrow--ghost" style={{ marginBottom: 22 }}>Twijfel je?</span>
            <h2>Weet je nog niet welk richting past?</h2>
            <p>Dat is geen probleem. Bel ons, stuur een bericht of plan een vrijblijvende kennismaking. We denken graag met je mee.</p>
            <div className="cta-row">
              <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("aanmelden")}>Direct aanmelden <Icon name="arrow" size={18} /></button>
              <button className="btn btn-soft btn-lg" onClick={() => navigate("contact")}>Eerst bellen</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { AanbodPage });
