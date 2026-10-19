/* Over ons, editorial, met exacte teksten van de huidige site */

/* Over ons — teamfoto met subtiele animatie-accenten */
const FoundersIllustration = () =>
<div className="over-trio" role="img" aria-label="Het team van De Nieuwe Koers: drie mannen met een duim omhoog">
    <img className="over-illu-img over-breathe" src="assets/oprichters-foto.png" alt="Het team van De Nieuwe Koers" />
    {/* speelse merk-accenten bij de duimen-omhoog */}
    <span className="over-spark over-spark--tr" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="#65a30d" stroke="#0a0a14" strokeWidth="1.4" strokeLinejoin="round"><path d="M12 2l2.2 5.6L20 9.8l-5.8 2.2L12 18l-2.2-6L4 9.8l5.8-2.2z" /></svg>
    </span>
    <span className="over-spark over-spark--bl" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="#eab308" stroke="#0a0a14" strokeWidth="1.4" strokeLinejoin="round"><path d="M12 2l2.2 5.6L20 9.8l-5.8 2.2L12 18l-2.2-6L4 9.8l5.8-2.2z" /></svg>
    </span>
    <span className="over-dot over-dot--1" aria-hidden="true"></span>
    <span className="over-dot over-dot--2" aria-hidden="true"></span>
  </div>;


const OverOnsPage = ({ navigate }) => {
  useReveal();
  const illuRef = React.useRef(null);
  useTilt(illuRef);
  const principes = [
  { icon: "pin", t: "Nabijheid", d: "We komen naar je toe, niet andersom.", tone: "mint" },
  { icon: "clock", t: "Ritme", d: "Kleine stappen, maar consequent.", tone: "yellow" },
  { icon: "spark", t: "Regie", d: "Jij bepaalt mee, altijd.", tone: "purple" }];

  const team = [
  { initials: "MA", photo: null, n: "Mohammed Amin Al Hashime", r: "Gedragswetenschapper & mede-oprichter", tone: "mint", b: "Verbindt wetenschap met de praktijk van alledag. Geen theorie zonder toepassing." },
  { initials: "MM", photo: null, n: "Marwan Moradi", r: "Beleidscoördinator & mede-oprichter", tone: "yellow", b: "Zorgt dat alles klopt, voor jongeren, verwijzers én gemeenten." },
  { initials: "AC", photo: null, n: "Abdellah Chouaibi", r: "Teamcoördinator & mede-oprichter", tone: "purple", b: "Houdt het team scherp en de lijnen kort. Altijd bereikbaar, altijd betrokken." }];

  const staff = [
  { initials: "MF", n: "Mohammed Faloun", r: "SKJ-geregistreerd begeleider", tone: "mint", b: "Al 6 jaar actief in de jeugdhulpverlening; begeleidt jongeren ambulant en coacht op scholen." },
  { initials: "AH", n: "Ari Halou", r: "Sportcoach", tone: "purple", b: "Werkt via sport aan zelfvertrouwen en ritme." },
  { initials: "FM", n: "Fatima Moradi", r: "Docente & onderwijsdeskundige", tone: "yellow", b: "Met 12 jaar ervaring in het onderwijs voelt ze de behoeften van jongeren van dichtbij." },
  { initials: "ML", n: "Mourad Loukili", r: "Huiswerkbegeleider", tone: "mint", b: "Geeft huiswerkbegeleiding op locatie." }];

  const story = [
  { y: "2020", t: "De basis", d: "Mohammed Amin, Marwan en Abdellah starten elk afzonderlijk in de jeugdhulpverlening en het onderwijs. Drie mensen, één overtuiging: het kan anders." },
  { y: "2025", t: "De start", d: "De Nieuwe Koers is een feit. Met drie jongeren op de groep 'Het Kompas', veel ambitie en een aanpak die meetbaar maakt wat anderen alleen beschrijven." },
  { y: "2026", t: "HKZ-gecertificeerd & eigen software", d: "Kiwa kent ons het HKZ-certificaat toe, een bevestiging van de kwaliteit die we dagelijks nastreven. In hetzelfde jaar ontwikkelen we onze eigen software en passen die toe in de praktijk, zodat voortgang zichtbaar en meetbaar wordt." },
  { y: "Vandaag", t: "Groeiende koers", d: "Een hecht team, vijf sporen, samenwerking met meerdere scholen in Haaglanden en gemeente Pijnacker-Nootdorp, en elke dag nieuwe jongeren die weer perspectief ervaren." }];

  const onderscheid = [
  { icon: "chart", t: "Aantoonbare groei", d: "We meten wat we doen. Doelen, voortgang en resultaten zijn zichtbaar voor iedereen aan tafel, niet achteraf, maar onderweg.", tone: "mint" },
  { icon: "users", t: "Cultuursensitief & op maat", d: "We sluiten aan bij de unieke context van elke jongere. Geen standaardaanpak, maar begeleiding die past bij wie je bent en waar je vandaan komt.", tone: "yellow" },
  { icon: "phone", t: "Korte lijnen, grote betrokkenheid", d: "Ons team is klein genoeg om écht betrokken te zijn en groot genoeg om het verschil te maken. Je weet altijd met wie je te maken hebt.", tone: "purple" }];


  return (
    <div className="page-content">
      {/* HERO */}
      <section className="over-hero" style={{ padding: 0 }}>
        <div className="container">
          <div className="over-hero-inner">
            <div className="over-hero-grid">
              <div>
                <nav className="breadcrumb" aria-label="Kruimelpad">
                  <a href="#" onClick={(e) => {e.preventDefault();navigate("home");}}>Home</a>
                  <span aria-hidden="true">›</span>
                  <span>Over ons</span>
                </nav>
                <span className="eyebrow">Over ons</span>
                <h1>Mensen, geen methodes.</h1>
                <p className="lead">Wat begon als een droom van drie vrienden, groeide uit tot De Nieuwe Koers, een plek waar jongeren weer richting, rust en groei vinden. Met onze achtergrond in jeugdhulp, onderwijs en gedragswetenschappen geloven we dat echte verandering begint bij echte verbinding: persoonlijk, praktisch en professioneel.</p>
                <div className="over-cred">
                  <span className="cred"><Icon name="shield" size={16} /> SKJ-geregistreerd</span>
                  <span className="cred"><Icon name="check" size={16} /> HKZ-gecertificeerd</span>
                  <span className="cred"><Icon name="pin" size={16} /> Zoetermeer &amp; Haaglanden</span>
                </div>
              </div>
              <div className="over-illu">
                <div className="over-illu-card tilt3d" ref={illuRef}>
                  <div className="tilt-sheen" aria-hidden="true"></div>
                  <FoundersIllustration />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIE + VISIE */}
      <section>
        <div className="container">
          <div className="mv-editorial reveal">
            <div className="mv-col mv-col--missie">
              <div className="mv-num">01</div>
              <span className="eyebrow">Onze missie</span>
              <h2>Jongeren weer aan zet, met de mensen om hen heen.</h2>
              <p>Wij geven jongeren met een afstand tot school of de maatschappij de handvatten om succesvol terug te keren, naar onderwijs, werk of een andere plek waar ze meedoen. Met begeleiding op maat helpen we hen sterker in het leven te staan en hun eigen talenten te benutten.</p>
            </div>
            <div className="mv-divider" aria-hidden="true"></div>
            <div className="mv-col mv-col--visie">
              <div className="mv-num">02</div>
              <span className="eyebrow eyebrow--purple">Onze visie</span>
              <h2>Geen probleem dat opgelost moet worden, een mens dat gezien moet worden.</h2>
              <p>We geloven dat elke jongere, wat zijn achtergrond ook is, de kracht in zich draagt om zijn leven een positieve wending te geven. Wie tijdelijk vastloopt, hoort niet uitgesloten te worden, maar gezien, gehoord en ondersteund. Daarom begint elk traject met luisteren, en werken we vanuit drie principes: nabijheid, ritme en regie.</p>
            </div>
          </div>

          <div className="principes-grid">
            {principes.map((p, i) =>
            <div key={p.t} className={`principe-card tone-${p.tone} reveal`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="principe-icon" aria-hidden="true"><Icon name={p.icon} size={24} /></div>
                <h4>{p.t}</h4>
                <p>{p.d}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Ons team</span>
            <h2>De mensen die naast je staan.</h2>
            <p>SKJ-geregistreerd, vakkundig en, bovenal, mens.</p>
          </div>
          <div className="team-grid">
            {team.map((p) =>
            <div key={p.n} className={`team-card tone-${p.tone} reveal`}>
                <div className="photo">
                  {p.photo ? <img src={p.photo} alt={p.n} /> : <span className="placeholder">{p.initials}</span>}
                </div>
                <div className="tc-body">
                  <h4>{p.n}</h4>
                  <p className="team-role">{p.r}</p>
                  <p className="team-bio">{p.b}</p>
                </div>
              </div>
            )}
          </div>
          <div className="team-staff reveal">
            {staff.map((p) =>
            <div key={p.n} className={`staff-card tone-${p.tone}`}>
                <span className="staff-ava">{p.initials}</span>
                <div>
                  <h4>{p.n}</h4>
                  <p className="staff-role">{p.r}</p>
                  <p className="staff-bio">{p.b}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TIJDLIJN */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow eyebrow--yellow">Ons verhaal</span>
            <h2>Hoe het begon, en waar we naartoe gaan.</h2>
          </div>
          <div className="story-timeline reveal">
            {story.map((x) =>
            <div key={x.y} className="story-row">
                <div className="story-year">{x.y}</div>
                <div className="story-line"><span className="story-dot"></span></div>
                <div className="story-content">
                  <h4><span className="story-year-inline">{x.y}</span>{x.t}</h4>
                  <p>{x.d}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WAT ONS ONDERSCHEIDT */}
      <section>
        <div className="container">
          <div className="section-head reveal" style={{ maxWidth: 820 }}>
            <span className="eyebrow eyebrow--purple">Waarom De Nieuwe Koers</span>
            <h2 style={{ margin: "16px 0" }}>Warm van aanpak. Scherp op resultaat.</h2>
            <p style={{ fontSize: 17 }}>Veel organisaties zeggen dat het goed gaat. Wij kunnen het aantonen. Bij De Nieuwe Koers werken we met meetbare doelen en concrete data. Geen onderbuikgevoel, maar cijfers die laten zien welke groei er plaatsvindt, voor de jongere, voor ouders en voor verwijzers. Transparant, onderbouwd en altijd inzichtelijk.</p>
          </div>
          <div className="onderscheid-grid">
            {onderscheid.map((c, i) =>
            <div key={c.t} className={`onderscheid-card tone-${c.tone} reveal`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="onderscheid-icon" aria-hidden="true"><Icon name={c.icon} size={24} /></div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="container">
          <div className="closing-cta reveal">
            <span className="eyebrow eyebrow--ghost" style={{ marginBottom: 22 }}>Kennismaken</span>
            <h2>Wil je kennismaken met ons team?</h2>
            <p>We vertellen je graag meer over onze aanpak, ons team en wat we voor jouw situatie kunnen betekenen.</p>
            <div className="cta-row">
              <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("contact")}>Plan een kennismaking <Icon name="arrow" size={18} /></button>
              <button className="btn btn-soft btn-lg" onClick={() => navigate("aanbod")}>Bekijk ons aanbod</button>
            </div>
          </div>
        </div>
      </section>
    </div>);

};

Object.assign(window, { OverOnsPage });