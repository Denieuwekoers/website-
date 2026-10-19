/* Dagbesteding Het Kompas, page met geanimeerd kompas */

const AnimatedCompass = () => {
  // tick marks
  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const ang = i * Math.PI * 2 / 60;
    const major = i % 5 === 0;
    const r1 = 212;
    const r2 = major ? 190 : 200;
    return (
      <line key={i}
      x1={250 + Math.cos(ang) * r1} y1={250 + Math.sin(ang) * r1}
      x2={250 + Math.cos(ang) * r2} y2={250 + Math.sin(ang) * r2}
      stroke={major ? "var(--c-ink)" : "rgba(10,10,20,0.35)"} strokeWidth={major ? 2.5 : 1.2} strokeLinecap="round" />);

  });
  // 8-point star rose
  const star = [];
  for (let i = 0; i < 8; i++) {
    const ang = i * Math.PI * 2 / 8 - Math.PI / 2;
    const long = i % 2 === 0;
    const tip = long ? 150 : 96;
    const tx = 250 + Math.cos(ang) * tip;
    const ty = 250 + Math.sin(ang) * tip;
    const a1 = ang - 0.16,a2 = ang + 0.16;
    const bx1 = 250 + Math.cos(a1) * 30,by1 = 250 + Math.sin(a1) * 30;
    const bx2 = 250 + Math.cos(a2) * 30,by2 = 250 + Math.sin(a2) * 30;
    star.push(
      <polygon key={i} points={`${tx},${ty} ${bx1},${by1} ${bx2},${by2}`}
      fill={long ? i === 0 ? "var(--c-primary-deep)" : "rgba(15,118,110,0.55)" : "rgba(10,10,20,0.18)"} />
    );
  }

  return (
    <div className="compass-stage" role="img" aria-label="Draaiend kompas, Het Kompas houdt koers">
      <div className="compass-glow" aria-hidden="true"></div>
      <svg className="compass-svg" viewBox="0 0 500 500" aria-hidden="true">
        {/* outer plate */}
        <circle cx="250" cy="250" r="226" fill="var(--c-paper)" stroke="var(--c-ink)" strokeWidth="3" />
        <circle cx="250" cy="250" r="226" fill="none" stroke="rgba(15,118,110,0.18)" strokeWidth="10" />
        {/* slow rotating tick ring */}
        <g className="cmp-spin-slow">{ticks}</g>
        {/* counter-rotating dashed ring */}
        <circle className="cmp-spin-rev" cx="250" cy="250" r="166" fill="none"
        stroke="var(--c-primary)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
        {/* cardinal letters (fixed upright) */}
        <text x="250" y="92" textAnchor="middle" fontFamily="var(--f-display)" fontWeight="800" fontSize="30" fill="var(--c-ink)">N</text>
        <text x="416" y="262" textAnchor="middle" fontFamily="var(--f-display)" fontWeight="700" fontSize="22" fill="var(--c-mute)">O</text>
        <text x="250" y="426" textAnchor="middle" fontFamily="var(--f-display)" fontWeight="700" fontSize="22" fill="var(--c-mute)">Z</text>
        <text x="84" y="262" textAnchor="middle" fontFamily="var(--f-display)" fontWeight="700" fontSize="22" fill="var(--c-mute)">W</text>
        {/* compass rose star */}
        <g className="cmp-spin-slow" style={{ opacity: 0.9 }}>{star}</g>
        {/* oscillating needle */}
        <g className="cmp-needle">
          <polygon points="250,108 264,250 250,264 236,250" fill="var(--c-coral)" />
          <polygon points="250,392 264,250 250,236 236,250" fill="var(--c-ink)" />
        </g>
        {/* center cap */}
        <circle className="cmp-pulse" cx="250" cy="250" r="15" fill="var(--c-yellow)" stroke="var(--c-ink)" strokeWidth="3" />
        <circle cx="250" cy="250" r="5" fill="var(--c-ink)" />
      </svg>
    </div>);

};

const AGENDA = [
  { w: "Eerste dag van het schooljaar", van: "maandag 31 augustus 2026", tot: "", t: "mark" },
  { w: "Prinsjesdag", van: "dinsdag 15 september 2026", tot: "", t: "vrij" },
  { w: "Herfstvakantie", van: "maandag 19 oktober 2026", tot: "vrijdag 23 oktober 2026", t: "vak" },
  { w: "Projectweek / toetsweek", van: "maandag 14 december 2026", tot: "vrijdag 18 december 2026", t: "open" },
  { w: "Kerstvakantie", van: "maandag 21 december 2026", tot: "vrijdag 1 januari 2027", t: "vak" },
  { w: "Voorjaarsvakantie", van: "maandag 22 februari 2027", tot: "vrijdag 26 februari 2027", t: "vak" },
  { w: "Suikerfeest (Eid al-Fitr)", van: "dinsdag 9 maart 2027", tot: "", t: "vrij" },
  { w: "Goede Vrijdag", van: "vrijdag 26 maart 2027", tot: "", t: "vrij" },
  { w: "Tweede Paasdag", van: "maandag 29 maart 2027", tot: "", t: "vrij" },
  { w: "Projectweek / toetsweek", van: "maandag 19 april 2027", tot: "vrijdag 23 april 2027", t: "open" },
  { w: "Meivakantie", van: "maandag 26 april 2027", tot: "vrijdag 7 mei 2027", t: "vak" },
  { w: "Tweede Pinksterdag", van: "maandag 17 mei 2027", tot: "", t: "vrij" },
  { w: "Projectweek / toetsweek", van: "maandag 12 juli 2027", tot: "vrijdag 16 juli 2027", t: "open" },
  { w: "Laatste dag van het schooljaar", van: "vrijdag 16 juli 2027", tot: "", t: "mark" },
  { w: "Zomervakantie", van: "maandag 19 juli 2027", tot: "vrijdag 27 augustus 2027", t: "vak" }];

const KompasPage = ({ navigate }) => {
  useReveal();
  return (
    <div className="page-content">
      {/* HERO */}
      <section className="kompas-hero" style={{ padding: 0 }}>
        <div className="container">
          <div className="kompas-hero-grid">
            <div>
              <nav className="breadcrumb" aria-label="Kruimelpad">
                <a href="./" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
                <span aria-hidden="true">›</span>
                <span>Het Kompas</span>
              </nav>
              <div className="hero-eyebrow-row" style={{ marginBottom: 22 }}>
                <span className="eyebrow">Dagbesteding</span>
              </div>
              <h1>Het Kompas: hier vind je weer <span className="accent">richting.</span></h1>
              <p className="lead">
                Niet elke jongere past in een standaard aanpak. Het Kompas biedt dagbesteding op maat! Met
                bewezen methodieken, meetbare doelen en begeleiders die de tijd nemen om te begrijpen wat
                een jongere echt nodig heeft.
              </p>
              <div className="hero-cta-row">
                <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("aanmelden")}>Direct aanmelden <Icon name="arrow" size={18} /></button>
                <button className="btn btn-soft btn-lg" onClick={() => navigate("contact")}>Eerst bellen</button>
              </div>
            </div>
            <div><AnimatedCompass /></div>
          </div>
        </div>
      </section>

      {/* EEN DAG BIJ HET KOMPAS, video (hoger op de pagina) */}
      <section>
        <div className="container">
          <div className="day-block reveal">
            <div className="section-head" style={{ marginBottom: 36, maxWidth: 640 }}>
              <span className="eyebrow eyebrow--yellow">Een dag bij Het Kompas</span>
              <h2 style={{ marginTop: 16 }}>Hoe ziet een doordeweekse dag eruit?</h2>
            </div>
            <div className="day-video day-video-center">
              <video src="assets/kompas-dag.mp4" controls playsInline preload="metadata" poster="assets/marwan-foto.png"></video>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 1, Voor wie */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="kompas-feature reveal">
            <div className="kf-media tone-mint"><img src="assets/poppetje-kompas.png" alt="" /></div>
            <div>
              <span className="eyebrow">Voor wie</span>
              <h2 style={{ marginTop: 16 }}>Voor de jongere die ergens tussen valt.</h2>
              <p className="kf-body">Misschien zit je thuis. Misschien is school te druk geworden. Misschien lukt werk nog niet en is op de bank hangen ook geen optie meer. Het Kompas is voor jongeren tussen de 12 en 23 jaar die de ruimte nodig hebben. Even op adem komen en opnieuw je richting bepalen en/of hervatten.




              </p>
              <ul className="kf-list">
                <li><span className="ck"><Icon name="check" size={13} /></span>Schooluitval, thuiszitters, time-out trajecten</li>
                <li><span className="ck"><Icon name="check" size={13} /></span>Jongeren met uiteenlopende ondersteuningsbehoeften</li>
                <li><span className="ck"><Icon name="check" size={13} /></span>Behoefte aan structuur, ritme en zinvolle dagbesteding</li>
                <li><span className="ck"><Icon name="check" size={13} /></span>Voorbereiding op terugkeer naar school of (vrijwilligers)werk</li>
              </ul>
            </div>
          </div>

          {/* FEATURE 2, Hoe het werkt */}
          <div className="kompas-feature reverse reveal">
            <div className="kf-media tone-yellow"><img src="assets/illustration-3.png" alt="" /></div>
            <div>
              <span className="eyebrow eyebrow--yellow">Hoe het werkt</span>
              <h2 style={{ marginTop: 16 }}>Geen lesrooster. Wel vaste structuur, die klopt.</h2>
              <p className="kf-body">
                We werken in kleine groepjes (max. 6 jongeren) met vaste begeleiders. Elke jongere heeft een
                persoonlijk plan met doelen die ertoe doen. We mixen praktisch werk, creatieve momenten,
                sociale vaardigheden en rust.
              </p>
              <ul className="kf-list">
                <li><span className="ck"><Icon name="check" size={13} /></span>Maandag t/m vrijdag, van 08:30 tot 15:00</li>
                <li><span className="ck"><Icon name="check" size={13} /></span>1 op 6 begeleiding (vaste gezichten)</li>
                <li><span className="ck"><Icon name="check" size={13} /></span>Trajecten van 15 weken, elke 5 weken geëvalueerd</li>
                <li><span className="ck"><Icon name="check" size={13} /></span>Haal- en brengservice in overleg mogelijk</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* JAARAGENDA */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="agenda-block reveal">
            <div className="section-head section-head--left" style={{ marginBottom: 28, maxWidth: 660 }}>
              <span className="eyebrow">Voor ouders en verzorgers</span>
              <h2 style={{ marginTop: 16 }}>Jaaragenda 2026&ndash;2027</h2>
              <p style={{ marginLeft: 0 }}>Wij volgen het vakantierooster van regio Midden, waar Zoetermeer onder valt. Op de vakantiedagen en feestdagen hieronder is de dagbesteding gesloten.</p>
            </div>

            <div className="agenda-legend">
              <span className="agenda-key"><i className="ak ak-vak"></i>Vakantieweken</span>
              <span className="agenda-key"><i className="ak ak-vrij"></i>Losse vrije dagen en feestdagen</span>
              <span className="agenda-key"><i className="ak ak-open"></i>Project- of toetsweek, dagbesteding open</span>
              <span className="agenda-key"><i className="ak ak-mark"></i>Start- en slotdag, dagbesteding open</span>
            </div>

            <div className="agenda-table" role="table" aria-label="Jaaragenda schooljaar 2026-2027">
              <div className="agenda-head" role="row">
                <span role="columnheader">Wat</span>
                <span role="columnheader">Van</span>
                <span role="columnheader">Tot en met</span>
              </div>
              {AGENDA.map((r) => (
                <div className={`agenda-row t-${r.t}`} role="row" key={r.w + r.van}>
                  <span className="ag-what" role="cell"><i className={`ak ak-${r.t}`}></i>{r.w}</span>
                  <span className="ag-date" role="cell"><span className="ag-label">Van</span>{r.van}</span>
                  <span className="ag-date" role="cell"><span className="ag-label">Tot en met</span>{r.tot || "—"}</span>
                </div>
              ))}
            </div>

            <div className="agenda-notes">
              <p>Koningsdag (dinsdag 27 april), Bevrijdingsdag (woensdag 5 mei) en Hemelvaartsdag (donderdag 6 mei) vallen binnen de meivakantie.</p>
              <p>De officiële datums voor zowel het Suikerfeest als het Offerfeest zijn nog niet bekend. Zodra deze bekend zijn, hoort u dat van ons. Op deze dagen is Het Kompas gesloten.</p>
              <p>In de project- en toetsweken is de dagbesteding gewoon open. Uw kind werkt dan aan schoolopdrachten of toetsen.</p>
              <p>Studiedagen van school worden later in het jaar bekend. Zodra die vaststaan, laten wij weten of de dagbesteding open is.</p>
            </div>

            <div className="agenda-facts">
              <div className="agenda-fact">
                <span className="af-icon"><Icon name="clock" size={20} /></span>
                <div><strong>Openingstijden</strong><span>Maandag t/m vrijdag, 08:30&ndash;15:00 uur</span></div>
              </div>
              <div className="agenda-fact">
                <span className="af-icon"><Icon name="phone" size={20} /></span>
                <div><strong>Ziekmelden</strong><span>Vóór 08:30 uur bij de begeleider, <a href="tel:0792340902">079 234 09 02</a></span></div>
              </div>
              <div className="agenda-fact">
                <span className="af-icon"><Icon name="mail" size={20} /></span>
                <div><strong>Vragen?</strong><span><a href="mailto:info@denieuwekoers.net">info@denieuwekoers.net</a></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="closing-cta reveal">
            <span className="eyebrow eyebrow--ghost" style={{ marginBottom: 22 }}>Kennismaken</span>
            <h2>Klinkt dit als iets voor jou (of je zoon, dochter, leerling)?</h2>
            <p>Vul hieronder het aanmeldformulier in en we plannen een vrijblijvende kennismaking in!</p>
            <div className="cta-row">
              <button className="btn btn-accent btn-lg btn-arrow" onClick={() => navigate("aanmelden")}>Direct aanmelden <Icon name="arrow" size={18} /></button>
              <button className="btn btn-soft btn-lg" onClick={() => navigate("contact")}>Eerst bellen</button>
            </div>
          </div>
        </div>
      </section>
    </div>);

};

Object.assign(window, { KompasPage, AnimatedCompass });