/* De Nieuwe Koers 2.0, Home page */

const HeroScene = () => {
  const tiltRef = React.useRef(null);
  useTilt(tiltRef, 6);
  return (
    <div className="hero-scene tilt3d" ref={tiltRef}>
      <div className="tilt-sheen" aria-hidden="true"></div>
      <svg viewBox="0 0 480 480" role="img" aria-label="Animatie: een jongere die vastloopt en met een kompas weer zijn koers vindt">
        {/* lucht */}
        <circle className="hs-sun" cx="392" cy="86" r="30" fill="#fde047" />
        <circle className="hs-sun" cx="392" cy="86" r="44" fill="#fde047" opacity="0.22" />
        <g className="hs-cloud" fill="#ffffff">
          <ellipse cx="104" cy="92" rx="28" ry="15" />
          <ellipse cx="126" cy="85" rx="20" ry="13" />
          <ellipse cx="84" cy="86" rx="16" ry="11" />
        </g>
        <g className="hs-cloud hs-cloud--2" fill="#ffffff" opacity="0.9">
          <ellipse cx="322" cy="158" rx="22" ry="12" />
          <ellipse cx="340" cy="152" rx="15" ry="10" />
        </g>

        {/* === verre heuvels (parallax, traag) === */}
        <g className="hs-hills-far">
          <path d="M-30,372 Q90,320 230,360 Q360,396 520,344 L520,420 L-30,420 Z" fill="#d6ead0" />
        </g>
        <g className="hs-hills-mid">
          <path d="M-30,392 Q120,348 270,384 Q400,414 520,372 L520,440 L-30,440 Z" fill="#cfe6c4" />
          {/* boompjes op de mid-heuvel */}
          <g fill="#8fbf78" stroke="#0a0a14" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M70,372 q-13,-2 -13,-15 q0,-15 13,-16 q13,1 13,16 q0,13 -13,15 z" />
            <line x1="70" y1="372" x2="70" y2="388" stroke="#0a0a14" strokeWidth="2.4" />
            <path d="M408,366 q-12,-2 -12,-14 q0,-14 12,-15 q12,1 12,15 q0,12 -12,14 z" />
            <line x1="408" y1="366" x2="408" y2="382" stroke="#0a0a14" strokeWidth="2.4" />
          </g>
        </g>

        {/* === overvliegende vogels === */}
        <g className="hs-birds" stroke="#0a0a14" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M196,120 q7,-7 14,0 q7,-7 14,0" />
          <path d="M232,134 q5,-5 10,0 q5,-5 10,0" opacity="0.8" />
        </g>

        {/* grond */}
        <path d="M0,392 Q120,352 250,388 Q360,418 480,372 L480,480 L0,480 Z" fill="#e4f3da" />
        <path d="M0,406 H480 V480 H0 Z" fill="#d9eccb" />

        {/* het pad dat zich ontvouwt (op koers) */}
        <path className="hs-path" d="M150,430 Q250,392 330,360 Q400,332 452,300" fill="none" stroke="#14b8a6" strokeWidth="5" strokeLinecap="round" strokeDasharray="3 14" />
        <g className="hs-flag">
          <line x1="452" y1="300" x2="452" y2="272" stroke="#0a0a14" strokeWidth="2.6" />
          <path d="M452,274 L476,281 L452,290 Z" fill="#14b8a6" stroke="#0a0a14" strokeWidth="1.6" strokeLinejoin="round" />
        </g>

        {/* zwevende accenten */}
        <g className="hs-accent"><path d="M92,206 l2.6,6 6,2.6 -6,2.6 -2.6,6 -2.6,-6 -6,-2.6 6,-2.6 z" fill="#c4a8ff" stroke="#0a0a14" strokeWidth="1.4" strokeLinejoin="round" /></g>
        <circle className="hs-accent hs-accent--2" cx="372" cy="232" r="5" fill="#2dd4bf" stroke="#0a0a14" strokeWidth="1.4" />

        {/* ===== BEGELEIDER van De Nieuwe Koers (links, paars) ===== */}
        <g stroke="#0a0a14" strokeWidth="2.6" strokeLinejoin="round">
          <g className="hs-guidemove">
            <ellipse cx="112" cy="398" rx="40" ry="10" fill="rgba(10,10,20,0.08)" />
            <g className="hs-guidebob">
              {/* benen — stappen tijdens het aanlopen */}
              <g className="hs-gleg-b">
                <path d="M104,302 L100,392" fill="none" stroke="#23233a" strokeWidth="14" strokeLinecap="round" />
                <path d="M94,393 q-8,1 -9,-4 q9,-4 16,0 z" fill="#23233a" stroke="none" />
              </g>
              <g className="hs-gleg-f">
                <path d="M118,302 L122,392" fill="none" stroke="#0a0a14" strokeWidth="14" strokeLinecap="round" />
                <path d="M128,393 q8,1 9,-4 q-9,-4 -16,0 z" fill="#0a0a14" stroke="none" />
              </g>
              {/* torso */}
              <path d="M86,304 L83,242 Q85,221 104,217 L120,217 Q139,221 137,243 L133,304 Z" fill="#8b5cf6" />
              <path d="M96,219 L110,237 L124,218" fill="#7c4ddb" stroke="none" />
              {/* achterste (linker) arm rust */}
              <path d="M90,244 Q80,272 90,298" fill="none" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" />
              <ellipse cx="90" cy="300" rx="7" ry="6" fill="#e6b98f" />
              {/* hoofd */}
              <ellipse cx="111" cy="196" rx="20" ry="22" fill="#e6b98f" />
              <path d="M91,196 Q87,164 119,162 Q139,165 134,194 Q132,178 111,174 Q94,178 91,196 Z" fill="#0a0a14" stroke="none" />
              <circle cx="106" cy="197" r="2.1" fill="#0a0a14" stroke="none" />
              <circle cx="118" cy="197" r="2.1" fill="#0a0a14" stroke="none" />
              <path d="M102,189 q3,-2 6,0 M114,189 q3,-2 6,0" strokeWidth="1.8" fill="none" />
              <path d="M105,208 q6,4 12,0" fill="none" strokeWidth="2" />
              {/* aanreikende (rechter) arm — beweegt bij overhandigen */}
              <g className="hs-guidearm">
                <path d="M133,246 Q156,258 176,272" fill="none" stroke="#8b5cf6" strokeWidth="13" strokeLinecap="round" />
                <ellipse cx="180" cy="276" rx="7.5" ry="6.5" fill="#e6b98f" />
              </g>
            </g>
          </g>
        </g>

        {/* ===== Het kompas dat wordt overhandigd (begeleider -> jongere) ===== */}
        <g className="hs-compass">
          <circle cx="183" cy="276" r="16" fill="#fff" stroke="#0a0a14" strokeWidth="2.6" />
          <circle cx="183" cy="276" r="10.5" fill="none" stroke="#14b8a6" strokeWidth="2" />
          <g className="hs-needle">
            <path d="M183,265 L188,276 L183,280 L178,276 Z" fill="#fb7185" stroke="#0a0a14" strokeWidth="1.2" />
            <path d="M183,287 L188,276 L183,272 L178,276 Z" fill="#0a0a14" stroke="#0a0a14" strokeWidth="1.2" />
          </g>
          <circle cx="183" cy="276" r="2.3" fill="#fde047" stroke="#0a0a14" strokeWidth="1.4" />
        </g>

        {/* ===== JONGERE — vastgelopen (gebogen, verwarde kluwen) ===== */}
        <g className="hs-stuck" stroke="#0a0a14" strokeWidth="2.6" strokeLinejoin="round">
          <ellipse cx="258" cy="398" rx="44" ry="11" fill="rgba(10,10,20,0.08)" />
          <path className="hs-knot" d="M238,196 q-16,-14 2,-24 q18,-9 24,8 q14,-14 26,2 q10,12 -4,22 q12,8 -2,20 q-16,11 -28,-2 q-14,10 -24,-4 q-9,-15 6,-20 z" fill="none" stroke="#b9b4c4" strokeWidth="3" />
          <path d="M248,316 L246,392" fill="none" stroke="#1b1b28" strokeWidth="15" strokeLinecap="round" />
          <path d="M264,316 L270,392" fill="none" stroke="#0a0a14" strokeWidth="15" strokeLinecap="round" />
          <path d="M234,318 L232,256 Q234,236 254,234 L268,236 Q286,242 283,300 L280,318 Z" fill="#14b8a6" />
          <path d="M236,250 Q222,288 232,320" fill="none" stroke="#14b8a6" strokeWidth="17" strokeLinecap="round" />
          <path d="M280,250 Q294,288 284,320" fill="none" stroke="#14b8a6" strokeWidth="17" strokeLinecap="round" />
          <ellipse cx="258" cy="224" rx="22" ry="24" fill="#f3d9c0" />
          <path d="M236,222 Q232,190 264,188 Q286,191 280,221 Q278,205 258,201 Q240,205 236,222 Z" fill="#2a1c12" stroke="none" />
          <path d="M250,230 q4,2 8,0 M264,230 q4,2 8,0" strokeWidth="2" fill="none" />
          <path d="M252,242 q6,-3 12,0" fill="none" strokeWidth="2.2" />
        </g>

        {/* ===== JONGERE — op koers, lopend met het kompas ===== */}
        <g className="hs-walk" stroke="#0a0a14" strokeWidth="2.6" strokeLinejoin="round">
          <g className="hs-walkmove">
            <ellipse className="hs-walkshadow" cx="240" cy="398" rx="40" ry="10" fill="rgba(10,10,20,0.08)" />
            <g className="hs-walkbob">
              {/* benen — stappen, voeten wijzen in de looprichting */}
              <g className="hs-leg-b">
                <path d="M252,300 L248,386" fill="none" stroke="#1b1b28" strokeWidth="15" strokeLinecap="round" />
                <path className="hs-foot-b" d="M246,388 q9,1 11,-4 q-11,-4 -19,0 z" fill="#1b1b28" stroke="none" />
              </g>
              <g className="hs-leg-f">
                <path d="M252,300 L256,386" fill="none" stroke="#0a0a14" strokeWidth="15" strokeLinecap="round" />
                <path className="hs-foot-f" d="M254,388 q9,1 11,-4 q-11,-4 -19,0 z" fill="#0a0a14" stroke="none" />
              </g>
              {/* rugzak */}
              <rect x="222" y="232" width="22" height="40" rx="10" fill="#8b5cf6" />
              {/* torso rechtop */}
              <path d="M230,302 L227,238 Q229,216 248,212 L262,212 Q279,218 277,240 L274,302 Z" fill="#14b8a6" />
              <path d="M240,214 L252,232 L263,213" fill="#0f9b8e" stroke="none" />
              {/* hals + hoofd omhoog */}
              <rect x="245" y="190" width="15" height="20" rx="6" fill="#f3d9c0" />
              <ellipse cx="257" cy="174" rx="20" ry="22" fill="#f3d9c0" />
              <path d="M237,176 Q232,143 266,140 Q284,142 279,175 Q277,159 262,155 Q245,157 237,176 Z" fill="#2a1c12" stroke="none" />
              <circle cx="260" cy="176" r="2.1" fill="#0a0a14" stroke="none" />
              <circle cx="272" cy="176" r="2.1" fill="#0a0a14" stroke="none" />
              <path d="M256,168 q3,-2 6,0 M268,168 q3,-2 6,0" strokeWidth="1.8" fill="none" />
              <path d="M260,188 q5,3 10,0" fill="none" strokeWidth="2" />
              {/* armen die kompas vasthouden */}
              <path d="M232,238 Q222,262 240,276" fill="none" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
              <path d="M272,238 Q282,262 266,276" fill="none" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
              {/* kompas in handen */}
              <circle cx="253" cy="280" r="16" fill="#fff" stroke="#0a0a14" strokeWidth="2.6" />
              <circle cx="253" cy="280" r="10.5" fill="none" stroke="#14b8a6" strokeWidth="2" />
              <g className="hs-needle hs-needle--walk">
                <path d="M253,269 L258,280 L253,284 L248,280 Z" fill="#fb7185" stroke="#0a0a14" strokeWidth="1.2" />
                <path d="M253,291 L258,280 L253,276 L248,280 Z" fill="#0a0a14" stroke="#0a0a14" strokeWidth="1.2" />
              </g>
              <circle cx="253" cy="280" r="2.3" fill="#fde047" stroke="#0a0a14" strokeWidth="1.4" />
              <ellipse cx="241" cy="278" rx="7" ry="6" fill="#f3d9c0" stroke="#0a0a14" strokeWidth="2.2" />
              <ellipse cx="266" cy="278" rx="7" ry="6" fill="#f3d9c0" stroke="#0a0a14" strokeWidth="2.2" />
            </g>
          </g>
        </g>

        {/* === voorgrond: wuivend gras (parallax, vóór de personages) === */}
        <g className="hs-grass" stroke="#7aa861" strokeWidth="3" strokeLinecap="round" fill="none">
          <g className="hs-grass-a">
            <path d="M40,470 q-4,-22 -10,-32 M40,470 q0,-24 0,-36 M40,470 q5,-22 11,-30" />
          </g>
          <g className="hs-grass-b">
            <path d="M120,474 q-5,-20 -11,-28 M120,474 q1,-22 1,-32 M120,474 q6,-20 12,-26" />
          </g>
          <g className="hs-grass-a">
            <path d="M392,474 q-5,-22 -11,-30 M392,474 q0,-24 0,-34 M392,474 q6,-22 12,-28" />
          </g>
          <g className="hs-grass-b">
            <path d="M452,470 q-4,-20 -10,-28 M452,470 q1,-22 1,-32 M452,470 q5,-20 11,-26" />
          </g>
        </g>
      </svg>
    </div>);

};

const HeroPhoto = () => {
  const tiltRef = React.useRef(null);
  useTilt(tiltRef);
  return (
    <div className="hero-photo-wrap tilt3d" ref={tiltRef}>
      <div className="tilt-sheen" aria-hidden="true"></div>
      <img src="assets/marwan-foto.png" alt="Een dag bij De Nieuwe Koers" />
      <div className="hero-photo-badge"><span className="dot-live"></span> Een dag bij De Nieuwe Koers</div>
    </div>);

};

const HeroSection = ({ navigate }) =>
<section className="hero">
    <div className="container">
      <div className="hero-grid">
        <div>
          <div className="hero-eyebrow-row">
            <span className="eyebrow">Jeugdhulp · 12-23 jaar</span>
            <span className="eyebrow eyebrow--purple">Regio Zoetermeer</span>
          </div>
          <h1>Groei met vertrouwen, <span className="accent">leef met kracht.</span></h1>
          <p className="lead">Sommige jongeren hebben meer nodig dan een standaard aanpak. Wij werken samen met jongeren, gezinnen en professionals aan begeleiding die echt aansluit, praktisch, meetbaar en zonder omwegen.


        </p>
          <div className="hero-cta-row">
            <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("aanmelden")}>
              Direct aanmelden <Icon name="arrow" size={18} />
            </button>
            <button className="btn btn-soft btn-lg" onClick={() => navigate("aanbod")}>Bekijk ons aanbod</button>
          </div>
          <ul className="hero-pillars">
            <li className="hero-pill"><span className="pdot" style={{ background: "var(--c-primary)" }} />Dagbesteding Het Kompas</li>
            <li className="hero-pill"><span className="pdot" style={{ background: "var(--c-purple-deep)" }} />Ambulante- en gezinsbegeleiding</li>
            <li className="hero-pill"><span className="pdot" style={{ background: "var(--c-yellow-deep)" }} />Jeugdhulp - Onderwijs</li>
          </ul>
        </div>

        <div className="hero-visual">
          <HeroScene />
        </div>
      </div>
    </div>
  </section>;


const ImpactStrip = () => {
  const cells = [
  { n: "12-23", l: "jaar, onze doelgroep" },
  { n: "< 1 wk", l: "tot je eerste kennismaking" },
  { n: "5", l: "heldere stappen in je traject" },
  { n: "100%", l: "SKJ- & NIP-geregistreerd team" }];

  return (
    <section style={{ paddingTop: 0, paddingBottom: "clamp(40px,6vw,72px)" }}>
      <div className="container">
        <div className="impact-strip reveal">
          {cells.map((c) =>
          <div className="impact-cell" key={c.l}>
              <div className="num">{c.n}</div>
              <span className="lbl">{c.l}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

};

const Partners = () => {
  const logos = [
  { src: "assets/partners/onc-clauslaan.png", alt: "ONC Clauslaan" },
  { src: "assets/partners/motion.png", alt: "Motion" },
  { src: "assets/partners/pijnacker-nootdorp.png", alt: "Gemeente Pijnacker-Nootdorp" },
  { src: "assets/partners/veurs-lyceum.png", alt: "Veurs Lyceum" }];

  return (
    <section style={{ paddingTop: 0, paddingBottom: "clamp(48px,7vw,80px)" }}>
      <div className="container">
        <p style={{ textAlign: "center", color: "var(--c-mute)", fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
          Samen sterk met scholen, gemeenten en zorgpartners
        </p>
      </div>
      <div className="partners-marquee">
        <div className="partners-track">
          {[0, 1].flatMap((k) => logos.map((p) =>
          <div className="partner-logo" key={p.alt + k}><img src={p.src} alt={p.alt} /></div>
          ))}
        </div>
      </div>
    </section>);

};

const Pillars = ({ navigate }) => {
  const items = [
  { tone: "mint", num: "01", illu: "assets/poppetje-kompas.png", title: "Dagbesteding Het Kompas", body: "Een vaste plek, vaste mensen en je eigen ritme. Structuur, vertrouwen en ontwikkeling, voor jongeren die even buiten de standaard route lopen.", to: "kompas" },
  { tone: "purple", num: "02", illu: "assets/poppetje-jeugdhulp.png", title: "Ambulante & gezinsbegeleiding", body: "Begeleiding thuis en/of in het gezin. We luisteren eerst, dan handelen we, met een vaste begeleider die er gewoon voor je is.", to: "aanbod", focus: "ambulant" },
  { tone: "yellow", num: "03", illu: "assets/poppetje-onderwijs.png", title: "Jeugdhulp & onderwijs", body: "Shadow-begeleiding, project Binnenboord, terugkeer-trajecten en trainingen rond school. Zodat leren weer lukt, op een manier die bij de jongere past.", to: "aanbod", focus: "onderwijs" }];

  return (
    <section>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Ons aanbod</span>
          <h2>Eén organisatie, drie manieren om vooruit te komen.</h2>
          <p>Welke route je ook nodig hebt, we sluiten aan bij wat er echt speelt, en bouwen van daaruit verder.</p>
        </div>
        <div className="pillars-grid">
          {items.map((it, i) =>
          <article className={`pillar-card tone-${it.tone} reveal`} key={it.num} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="pillar-illu"><img src={it.illu} alt="" /></div>
              <div className="pillar-num">{it.num}</div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
              <button className="pillar-link" onClick={() => navigate(it.to, it.focus)}>
                Meer hierover <Icon name="arrow" size={17} />
              </button>
            </article>
          )}
        </div>
      </div>
    </section>);

};

const DualEntry = ({ navigate }) =>
<section style={{ paddingTop: 0 }}>
    <div className="container">
      <div className="dual-grid">
        <div className="dual-card tone-mint reveal">
          <span className="dual-icon" style={{ color: "var(--c-primary-dark)" }}><Icon name="users" size={26} /></span>
          <span className="eyebrow" style={{ background: "#fff" }}>Voor ouders &amp; jongeren</span>
          <h3>Van vastlopen naar vooruitkomen.</h3>
          <p>We luisteren eerst, dan handelen we. Geen wachtlijsten van maanden, geen stapels papierwerk. Binnen een week zit je aan tafel met iemand die snapt wat er speelt.</p>
          <ul className="dual-list">
            <li><span className="ck"><Icon name="check" size={13} /></span>Vrijblijvende kennismaking binnen 1 week</li>
            <li><span className="ck"><Icon name="check" size={13} /></span>ZIN, PGB of particulier, wij regelen de route</li>
            <li><span className="ck"><Icon name="check" size={13} /></span>Vaste begeleider, vaste structuur</li>
          </ul>
          <button className="btn btn-primary btn-arrow" onClick={() => navigate("aanmelden")}>Direct aanmelden <Icon name="arrow" size={17} /></button>
        </div>

        <div className="dual-card tone-ink reveal" style={{ transitionDelay: "80ms" }}>
          <span className="dual-icon"><Icon name="building" size={26} /></span>
          <span className="eyebrow eyebrow--ghost">Voor verwijzers &amp; organisaties</span>
          <h3>Korte lijnen. Geen verrassingen.</h3>
          <p>Als verwijzer wil je weten waar je aan toe bent. Wij rapporteren gestructureerd, evalueren periodiek en schakelen proactief. Zo werk je met ons samen, niet achter ons aan.</p>
          <ul className="dual-list">
            <li><span className="ck"><Icon name="check" size={13} /></span>SKJ- en NIP-geregistreerd team</li>
            <li><span className="ck"><Icon name="check" size={13} /></span>Periodieke evaluaties, bijsturen waar nodig</li>
            <li><span className="ck"><Icon name="check" size={13} /></span>Voortgang inzichtelijk voor ouders én verwijzers</li>
          </ul>
          <button className="btn btn-accent btn-arrow" onClick={() => navigate("contact")}>Plan een kennismaking <Icon name="arrow" size={17} /></button>
        </div>
      </div>
    </div>
  </section>;


const Werkwijze = ({ navigate }) => {
  const goals = [
  { label: "Op tijd opstaan & dagritme", pct: 82, color: "var(--c-primary)" },
  { label: "Terug naar school", pct: 64, color: "var(--c-purple-deep)" },
  { label: "Zelfvertrouwen & sociale vaardigheden", pct: 73, color: "var(--c-yellow-deep)" }];

  return (
    <section>
      <div className="container">
        <div className="werkwijze reveal">
          <div>
            <span className="eyebrow" style={{ background: "#fff" }}>Onze werkwijze</span>
            <h2>Begeleiding waarvan je ziet of het werkt.</h2>
            <p className="ww-lead">Een goed gevoel is mooi. Bewijs is beter. We combineren warme begeleiding met een strak meetsysteem: bewezen methodieken vormen de basis, data stuurt de voortgang. Zo weten jongeren, ouders en verwijzers precies wat het traject oplevert.



            </p>
            <ul className="ww-checks">
              <li><span className="ck"><Icon name="check" size={13} /></span>Concrete, meetbare doelen</li>
              <li><span className="ck"><Icon name="check" size={13} /></span>Live voortgang in eigen dashboard</li>
              <li><span className="ck"><Icon name="check" size={13} /></span>Ouders &amp; verwijzers op de hoogte</li>
              <li><span className="ck"><Icon name="check" size={13} /></span>Evaluatie­momenten, bijsturen waar nodig</li>
            </ul>
            <button className="btn btn-primary btn-arrow" onClick={() => navigate("kompas")}>Lees meer over onze aanpak <Icon name="arrow" size={17} /></button>
          </div>

          <div className="dash" role="img" aria-label="Voorbeeld van een voortgangsdashboard met doelen en cijfers">
            <div className="dash-top">
              <div className="dash-who">
                <span className="dash-ava">S</span>
                <div><strong>Sara · 16 jaar</strong><span>Traject week 8 van 20</span></div>
              </div>
              <span className="dash-badge">Op koers</span>
            </div>
            <div className="dash-goals">
              {goals.map((g) =>
              <div key={g.label}>
                  <div className="dash-goal-top"><strong>{g.label}</strong><span>{g.pct}%</span></div>
                  <div className="dash-bar"><i style={{ width: `${g.pct}%`, background: g.color }} /></div>
                </div>
              )}
            </div>
            <div className="dash-foot">
              <div className="dash-stat"><b>8/20</b><small>weken</small></div>
              <div className="dash-stat"><b>+24%</b><small>welbevinden</small></div>
              <div className="dash-stat"><b>3</b><small>doelen behaald</small></div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

const Traject = ({ navigate }) => {
  const steps = [
  { t: "mint", n: "1", title: "Aanmelding", d: "We ontvangen de hulpvraag en brengen samen de eerste behoeften in kaart." },
  { t: "yellow", n: "2", title: "Intake", d: "In een persoonlijk gesprek stellen we doelen op en maken we een begeleidingsplan." },
  { t: "purple", n: "3", title: "Starten", d: "We beginnen met begeleiding op maat, gericht op groei en vertrouwen." },
  { t: "coral", n: "4", title: "Evaluatie", d: "Periodiek bespreken we de voortgang en sturen we bij waar nodig." },
  { t: "green", n: "5", title: "Afronden", d: "Warme afronding met overdracht en nazorg op afstand." }];

  return (
    <section>
      <div className="container">
        <div className="traject reveal">
          <div className="traject-head">
            <span className="eyebrow eyebrow--ghost">Jouw traject</span>
            <h2>Van aanmelding tot afronding: vijf heldere stappen.</h2>
            <p>Geen eindeloze wachtlijsten. Binnen twee weken je intake.</p>
          </div>
          <div className="traject-steps">
            {steps.map((s) =>
            <div className={`traject-step t-${s.t}`} key={s.n}>
                <div className="step-num">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.d}</p>
              </div>
            )}
          </div>
          <div className="traject-cta">
            <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("aanmelden")}>Start je aanmelding <Icon name="arrow" size={18} /></button>
          </div>
        </div>
      </div>
    </section>);

};

const Belofte = ({ navigate }) => {
  return (
    <section>
      <div className="container">
        <div className="belofte reveal">
          <span className="eyebrow eyebrow--purple">Onze belofte</span>
          <blockquote className="belofte-quote">Je hoeft het niet alleen uit te zoeken. Wij lopen met je mee, tot je zelf de koers weer te pakken hebt.

          </blockquote>
          <p className="belofte-sign">— Team De Nieuwe Koers</p>
        </div>
      </div>
    </section>);

};

const ClosingCTA = ({ navigate }) =>
<section style={{ paddingBottom: 0 }}>
    <div className="container">
      <div className="closing-cta reveal">
        <span className="eyebrow eyebrow--ghost" style={{ marginBottom: 22 }}>Zet de eerste stap</span>
        <h2>Klaar om samen een nieuwe koers te varen?</h2>
        <p>Of je nu ouder, jongere of verwijzer bent, één bericht is genoeg. Binnen een week zitten we aan tafel.</p>
        <div className="cta-row">
          <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("aanmelden")}>Direct aanmelden <Icon name="arrow" size={18} /></button>
          <button className="btn btn-soft btn-lg" onClick={() => navigate("contact")}>Plan een kennismaking</button>
        </div>
        <div className="cta-trust">
          <span><Icon name="clock" size={15} /> Reactie binnen 1 week</span>
          <span><Icon name="shield" size={15} /> SKJ-geregistreerd</span>
          <span><Icon name="heart" size={15} /> Vaste begeleider</span>
        </div>
      </div>
    </div>
  </section>;


const Home = ({ navigate }) => {
  useReveal();
  return (
    <div className="page-content">
      <HeroSection navigate={navigate} />
      <Partners />
      <Pillars navigate={navigate} />
      <DualEntry navigate={navigate} />
      <Werkwijze navigate={navigate} />
      <Traject navigate={navigate} />
      <Belofte navigate={navigate} />
      <ClosingCTA navigate={navigate} />
    </div>);

};

Object.assign(window, { Home });