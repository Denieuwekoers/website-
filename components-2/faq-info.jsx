/* FAQ + info/juridische pagina's, exacte teksten van de huidige site */

const FAQ_ITEMS = [
  { cat: "Algemeen", q: "Wat is De Nieuwe Koers?", a: "We begeleiden jongeren tussen 12 en 23 met specifieke ondersteuningsbehoeften, op school, thuis en in hun persoonlijke ontwikkeling. Denk aan dagbesteding, individuele begeleiding, intercoaching, trainingen en screenende diagnostiek." },
  { cat: "Algemeen", q: "Voor wie zijn jullie diensten bedoeld?", a: "Voor jongeren van 12 tot 23 jaar die te maken hebben met schooluitval, milde verstandelijke beperking (LVB), autisme, ADHD of gedragsproblematiek. Twijfel? Bel of mail ons gerust, we denken mee." },
  { cat: "Aanmelden", q: "Hoe meld ik een jongere aan?", a: "Aanmelden kan via het formulier op deze site, per e-mail of telefonisch. We nemen binnen 2 werkdagen contact op om de specifieke behoeften te bespreken." },
  { cat: "Aanmelden", q: "Hoe snel kan een traject starten?", a: "Meestal binnen 2 weken na aanmelding. Bij urgente situaties kijken we altijd of het sneller kan." },
  { cat: "Aanbod", q: "Welke groepstrainingen bieden jullie aan?", a: "Sociale vaardigheidstraining, emotieregulatie, zelfvertrouwenstraining en trainingen gericht op executieve functies. Daarnaast ontwikkelen we trainingen op maat voor scholen en groepen." },
  { cat: "Aanbod", q: "Doen jullie ook diagnostiek?", a: "Ja, screenende diagnostiek door onze GZ-orthopedagoog. We kijken naar wat er speelt en geven concrete adviezen, geen labels om hun stempel." },
  { cat: "Financiering", q: "Hoe is de financiering geregeld?", a: "We werken met ZIN (Zorg in Natura) via gemeentelijke beschikkingen, PGB (Persoonsgebonden Budget) en in sommige gevallen particulier. We helpen je graag bij het regelen van de juiste route." },
  { cat: "Financiering", q: "Wat als mijn gemeente geen contract met jullie heeft?", a: "We zijn op dit moment nog niet bij gemeenten gecontracteerd. Wel staan we open voor maatwerkovereenkomsten. Neem gerust contact op, dan kijken we samen naar de mogelijkheden." },
  { cat: "Voor verwijzers", q: "Hoe verlopen rapportages?", a: "We werken met het cliëntregistratiesysteem Cliendo: daarin stellen we de rapportages op en bouwen we het dossier zorgvuldig op. Zo is de voortgang overzichtelijk vastgelegd en inzichtelijk voor de betrokkenen." },
  { cat: "Voor verwijzers", q: "Zijn jullie SKJ-geregistreerd?", a: "Ja, ons hele begeleidende team is SKJ-geregistreerd. De orthopedagoog is daarnaast NIP-geregistreerd." },
];

const FaqSection = ({ navigate }) => {
  const [open, setOpen] = React.useState(0);
  const items = FAQ_ITEMS.slice(0, 6);
  return (
    <section>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Veelgestelde vragen</span>
          <h2>Antwoord op wat je je afvraagt.</h2>
        </div>
        <div className="faq-list reveal" style={{ maxWidth: 860, margin: "0 auto" }}>
          {items.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{item.q}</span>
                <span className="icon" aria-hidden="true">+</span>
              </button>
              <div className="faq-a"><p>{item.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqPage = ({ navigate }) => {
  useReveal();
  const [open, setOpen] = React.useState(0);
  const [filter, setFilter] = React.useState("Alle");
  const cats = ["Alle", ...Array.from(new Set(FAQ_ITEMS.map((i) => i.cat)))];
  const filtered = filter === "Alle" ? FAQ_ITEMS : FAQ_ITEMS.filter((i) => i.cat === filter);

  return (
    <div className="page-content">
      <section className="faq-hero" style={{ padding: 0 }}>
        <div className="container" style={{ padding: "clamp(40px,6vw,72px) 24px clamp(36px,5vw,56px)" }}>
          <nav className="breadcrumb" aria-label="Kruimelpad">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
            <span aria-hidden="true">›</span>
            <span>FAQ</span>
          </nav>
          <span className="eyebrow eyebrow--purple">Veelgestelde vragen</span>
          <h1>Vraag het ons.</h1>
          <p className="lead">Hieronder de meest gestelde vragen, staat het antwoord er niet bij? Bel of mail.</p>
        </div>
      </section>

      <section style={{ paddingTop: "clamp(40px,6vw,64px)" }}>
        <div className="container">
          <div className="faq-cat-row" role="tablist" aria-label="Filter op categorie">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={filter === c} className={`faq-cat ${filter === c ? "is-active" : ""}`} onClick={() => { setFilter(c); setOpen(0); }}>{c}</button>
            ))}
          </div>

          <div className="faq-list" style={{ maxWidth: 900, margin: "0 auto" }}>
            {filtered.map((item, i) => (
              <div key={`${filter}-${i}`} className={`faq-item ${open === i ? "open" : ""}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  <span>{item.q}</span>
                  <span className="icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a"><p>{item.a}</p></div>
              </div>
            ))}
          </div>

          <div className="faq-help reveal">
            <h3>Geen antwoord gevonden?</h3>
            <p>We pakken de telefoon op. Geen voicemail, geen keuzemenu.</p>
            <button className="btn btn-primary btn-arrow" onClick={() => navigate("contact")}>Stel je vraag <Icon name="arrow" size={17} /></button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== Gedeelde info-hero ===== */
const InfoHero = ({ crumb, eyebrow, title, lead, navigate }) => (
  <section className="info-hero" style={{ padding: 0 }}>
    <div className="container" style={{ padding: "clamp(40px,6vw,72px) 24px clamp(32px,4vw,48px)" }}>
      <nav className="breadcrumb" aria-label="Kruimelpad">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
        <span aria-hidden="true">›</span>
        <span>{crumb}</span>
      </nav>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
    </div>
  </section>
);

/* ===== Werken bij ===== */
const WerkenBijIllustration = () => (
  <svg className="wb-illu" viewBox="0 0 240 220" role="img" aria-label="Een teamlid van De Nieuwe Koers zwaait je welkom">
    <circle cx="120" cy="116" r="92" fill="var(--c-primary-tint)" />
    <ellipse cx="120" cy="200" rx="78" ry="12" fill="rgba(10,10,20,0.06)" />
    <g stroke="#0a0a14" strokeWidth="2.6" strokeLinejoin="round">
      <rect x="111" y="120" width="18" height="22" rx="7" fill="#f3d9c0" />
      <path d="M82,168 Q82,144 106,140 L134,140 Q158,144 158,168 L162,214 L78,214 Z" fill="#8b5cf6" />
      <path d="M107,142 L120,160 L133,142" fill="#7c4ddb" stroke="none" />
      <path d="M86,168 Q72,196 84,214" fill="none" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx="86" cy="214" rx="10" ry="8.5" fill="#f3d9c0" />
      <path d="M152,166 Q166,164 176,158" fill="none" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" />
      <g className="wb-wave">
        <path d="M176,158 Q186,120 182,92" fill="none" stroke="#8b5cf6" strokeWidth="18" strokeLinecap="round" />
        <circle cx="182" cy="84" r="13" fill="#f3d9c0" />
      </g>
      <ellipse cx="98" cy="100" rx="4.6" ry="6.6" fill="#f3d9c0" />
      <ellipse cx="142" cy="100" rx="4.6" ry="6.6" fill="#f3d9c0" />
      <ellipse cx="120" cy="99" rx="22" ry="25" fill="#f3d9c0" />
      <path d="M97,99 Q90,62 124,60 Q150,62 143,98 Q141,82 122,78 Q103,82 97,99 Z" fill="#2a1c12" stroke="none" />
      <circle cx="112" cy="100" r="2.2" fill="#0a0a14" stroke="none" />
      <circle cx="130" cy="100" r="2.2" fill="#0a0a14" stroke="none" />
      <path d="M109,91 q3,-2 6,0 M125,91 q3,-2 6,0" strokeWidth="2" fill="none" />
      <path d="M112,112 Q120,118 128,112" fill="none" strokeWidth="2.2" />
    </g>
    <g className="wb-spark" fill="#fde047" stroke="#0a0a14" strokeWidth="1.6">
      <path d="M200,70 l3,7 7,3 -7,3 -3,7 -3,-7 -7,-3 7,-3 z" />
    </g>
    <circle className="wb-spark" cx="56" cy="84" r="5" fill="#2dd4bf" stroke="#0a0a14" strokeWidth="1.6" style={{ animationDelay: ".8s" }} />
  </svg>
);

const WerkenBijPage = ({ navigate }) => {
  useReveal();
  return (
    <div className="page-content">
      <section className="info-hero" style={{ padding: 0 }}>
        <div className="container" style={{ padding: "clamp(40px,6vw,72px) 24px clamp(32px,4vw,48px)" }}>
          <div className="werkenbij-hero-grid">
            <div>
              <nav className="breadcrumb" aria-label="Kruimelpad">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
                <span aria-hidden="true">›</span>
                <span>Werken bij</span>
              </nav>
              <span className="eyebrow">Vacatures</span>
              <h1>Werken bij De Nieuwe Koers.</h1>
              <p className="lead">We zoeken mensen die graag dichtbij staan, lef hebben om te zeggen wat nodig is, en lol hebben in samenwerken met jongeren die het even moeilijk hebben.</p>
            </div>
            <div className="werkenbij-illu-wrap">
              <WerkenBijIllustration />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="empty-state reveal">
            <span className="eyebrow">Geen vacatures</span>
            <h3>Momenteel staan er geen vacatures open.</h3>
            <p>We zijn niet actief op zoek, maar we leren mensen graag kennen. Stuur een open sollicitatie en wie weet matcht het.</p>
            <button className="btn btn-primary btn-arrow" onClick={() => navigate("contact")}>Stuur een open sollicitatie <Icon name="arrow" size={17} /></button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== Klachten ===== */
const KlachtenPage = ({ navigate }) => {
  useReveal();
  const steps = [
    { n: "1", t: "Praat met je begeleider", d: "De snelste route is meestal direct: vertel je begeleider wat er speelt. Negen van de tien keer komen we er samen uit." },
    { n: "2", t: "Klacht bij de directie", d: <>Lukt dat niet, of past dat niet? Dien een formele klacht in bij de directie via <a href="mailto:klacht@denieuwekoers.net">klacht@denieuwekoers.net</a>. Je krijgt binnen 5 werkdagen een reactie.</> },
    { n: "3", t: "Onafhankelijke klachtenregeling", d: <>Komen we er nog niet uit, dan kun je je klacht voorleggen aan onze onafhankelijke klachtenpartij <strong>Erisietsmisgegaan.nl</strong>. Je vindt de procedure op <a href="https://erisietsmisgegaan.nl" target="_blank" rel="noopener noreferrer">erisietsmisgegaan.nl</a>.</> },
  ];
  return (
    <div className="page-content">
      <InfoHero navigate={navigate} crumb="Klacht melden" eyebrow="Klachten"
        title="Loopt er iets niet zoals het hoort?"
        lead="Vertel het ons. We nemen klachten serieus, niet omdat het moet, maar omdat we beter willen worden van wat misgaat." />
      <section>
        <div className="container">
          <div className="legal-content reveal">
            {steps.map((s) => (
              <div key={s.n} className="legal-block legal-step">
                <span className="ls-num">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
            <div className="legal-block">
              <h3>Vertrouwenspersoon</h3>
              <p>Liever eerst sparren met iemand buiten onze organisatie? Het AKJ (Advies- en Klachtenbureau Jeugdzorg) heeft vertrouwenspersonen die gratis met je meedenken: <strong>088-555 1000</strong>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== Privacy ===== */
const PrivacyPage = ({ navigate }) => {
  useReveal();
  const blocks = [
    ["Wie is verantwoordelijk?", "De Nieuwe Koers B.V., gevestigd aan de Willem Dreeslaan 181 te Zoetermeer (KvK 96172630, AGB-code 78780874), is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring."],
    ["Welke gegevens verwerken we?", "Naam, contactgegevens, geboortedatum, BSN (alleen voor ZIN-trajecten), gegevens over je hulpvraag en voortgang. Voor stagiaires en medewerkers ook personeelsgegevens."],
    ["Waarom?", "Om begeleiding te kunnen bieden, te factureren, te rapporteren aan verwijzers, en om wettelijke verplichtingen na te komen."],
    ["Hoe lang bewaren we?", "Dossiers minimaal 20 jaar (wettelijke bewaartermijn jeugdzorg). Sollicitatiegegevens maximaal 4 weken na afronding sollicitatieprocedure."],
    ["Met wie delen we?", "Alleen met direct betrokkenen: ouders/jongere, verwijzer, samenwerkende behandelaars, en altijd met expliciete toestemming, tenzij wettelijk verplicht."],
    ["Jouw rechten", "Inzage, correctie, verwijdering, dataportabiliteit en bezwaar. Stuur een mail naar privacy@denieuwekoers.net en je krijgt binnen 4 weken antwoord."],
  ];
  return (
    <div className="page-content">
      <InfoHero navigate={navigate} crumb="Privacy" eyebrow="Privacyverklaring"
        title="Hoe we omgaan met jouw gegevens."
        lead="Kort en helder, geen juridisch geneuzel waar het niet hoeft." />
      <section>
        <div className="container">
          <div className="legal-content reveal">
            {blocks.map(([t, d]) => (
              <div key={t} className="legal-block"><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== Algemene Voorwaarden ===== */
const AVPage = ({ navigate }) => {
  useReveal();
  const blocks = [
    ["Toepasselijkheid", "Deze voorwaarden gelden voor alle overeenkomsten tussen De Nieuwe Koers B.V. en cliënten, ouders of opdrachtgevers."],
    ["Aanmelding & intake", "Een traject start altijd met een vrijblijvende kennismaking. Pas na een schriftelijke overeenkomst en (bij minderjarigen) toestemming van beide gezaghebbende ouders gaan we van start."],
    ["Annulering", "Afspraken kunnen tot 24 uur van tevoren kosteloos worden geannuleerd. Daarna brengen we de gereserveerde tijd in rekening."],
    ["Tarieven", "Onze tarieven worden jaarlijks geïndexeerd. Voor ZIN-trajecten gelden de tarieven van de inkopende gemeente."],
    ["Beëindiging", "Beide partijen kunnen het traject beëindigen met inachtneming van een opzegtermijn van 4 weken. In acute situaties kan dat eerder, in goed overleg."],
    ["Aansprakelijkheid", "We zijn beroepsaansprakelijk verzekerd. Onze aansprakelijkheid is beperkt tot het bedrag dat de verzekering uitkeert."],
  ];
  return (
    <div className="page-content">
      <InfoHero navigate={navigate} crumb="Algemene voorwaarden" eyebrow="Algemene voorwaarden"
        title="De afspraken op een rij."
        lead="Wat mag je van ons verwachten, en wat verwachten wij van jou?" />
      <section>
        <div className="container">
          <div className="legal-content reveal">
            {blocks.map(([t, d]) => (
              <div key={t} className="legal-block"><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== 404 ===== */
const NotFoundPage = ({ navigate }) => (
  <div className="page-content">
    <section>
      <div className="container">
        <div className="nf-wrap">
          <div className="nf-code" aria-hidden="true">404</div>
          <span className="eyebrow">Ergens fout afgeslagen</span>
          <h1>Deze pagina is van het pad geraakt.</h1>
          <p>Geen zorgen, gebeurt de besten. Hieronder een paar routes terug.</p>
          <div className="nf-actions">
            <button className="btn btn-accent btn-arrow" onClick={() => navigate("home")}>Terug naar home <Icon name="arrow" size={17} /></button>
            <button className="btn btn-soft" onClick={() => navigate("aanbod")}>Bekijk ons aanbod</button>
            <button className="btn btn-soft" onClick={() => navigate("contact")}>Neem contact op</button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

Object.assign(window, { FAQ_ITEMS, FaqSection, FaqPage, WerkenBijPage, KlachtenPage, PrivacyPage, AVPage, NotFoundPage });
