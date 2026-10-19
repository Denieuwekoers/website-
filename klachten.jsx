/* Klachten — laagdrempelige klachtenregeling met formulier */

const KLACHT_KEY = "b6546c24-8d21-4e55-825e-462708858850";

const KL_STEPS = [
  { n: "1", tag: "Informeel", tone: "mint", t: "Bespreek het", d: "Vertel je begeleider of de teamcoördinator wat er speelt. Vaak is een goed gesprek genoeg. Liever niet met je eigen begeleider? Dan kan het ook met iemand anders uit het team." },
  { n: "2", tag: "Formeel", tone: "purple", t: "Meld het bij ons", d: "Vul het formulier hieronder in, mail ons of bel. Binnen 5 werkdagen nemen we contact met je op. Binnen 6 weken ontvang je een schriftelijke reactie van de directie." },
  { n: "3", tag: "Onafhankelijk", tone: "yellow", t: "Klachtenfunctionaris", d: <>Kom je er met ons niet uit, of praat je liever meteen met iemand buiten De Nieuwe Koers? De klachtenfunctionaris van <a href="https://erisietsmisgegaan.nl" target="_blank" rel="noopener noreferrer">Erisietsmisgegaan</a> denkt gratis en onafhankelijk met je mee. Bel <a href="tel:0352031585">035 203 1585</a> of mail <a href="mailto:info@erisietsmisgegaan.nl">info@erisietsmisgegaan.nl</a>.</> },
  { n: "4", tag: "Onafhankelijk oordeel", tone: "coral", t: "Klachten- of geschillencommissie", d: <>Is je klacht daarna nog niet opgelost? Dan kun je hem voorleggen aan de Klachtencommissie Jeugdwet of de Geschillencommissie van <a href="https://erisietsmisgegaan.nl" target="_blank" rel="noopener noreferrer">Erisietsmisgegaan</a>. Zij geven een onafhankelijk oordeel.</> },
];

const KlachtForm = () => {
  const empty = { soort: "informeel", rol: "", naam: "", contact: "", bericht: "", wens: "" };
  const [f, setF] = React.useState(empty);
  const [err, setErr] = React.useState({});
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const formeel = f.soort === "formeel";

  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setErr((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (f.bericht.trim().length < 10) e.bericht = "Schrijf in een paar zinnen wat er speelt";
    if (!f.naam.trim()) e.naam = "Vul je naam in, zodat we contact met je kunnen opnemen";
    if (!f.contact.trim()) e.contact = "Vul een e-mailadres of telefoonnummer in";
    if (f.contact.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contact.trim()) && !/^[\d\s+\-()]{8,}$/.test(f.contact.trim())) e.contact = "Vul een geldig e-mailadres of telefoonnummer in";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitError(""); setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KLACHT_KEY,
          subject: formeel ? "FORMELE KLACHT via de website" : "Melding van onvrede via de website",
          from_name: "De Nieuwe Koers \u2014 klachtenformulier",
          "Soort melding": formeel ? "Formele klacht" : "Informele melding",
          "Ik ben": f.rol || "Niet ingevuld",
          "Naam": f.naam,
          "Contact": f.contact,
          "Wat speelt er": f.bericht,
          "Gewenste oplossing": f.wens || "Niet ingevuld",
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setSubmitError("Er ging iets mis bij het verzenden. Probeer het opnieuw of bel ons op 079 234 0902.");
    } catch (_) {
      setSubmitError("Geen verbinding. Probeer het opnieuw of bel ons op 079 234 0902.");
    } finally { setSending(false); }
  };

  if (sent) return (
    <div className="contact-form-card kl-form">
      <div className="cf-success">
        <span className="check"><Icon name="check" size={36} stroke={3} /></span>
        <h3>Bedankt dat je het laat weten</h3>
        <p>{formeel ? "We hebben je klacht ontvangen. Binnen 5 werkdagen nemen we contact met je op." : "We hebben je melding ontvangen en nemen zo snel mogelijk contact met je op."}</p>
        <button className="btn btn-soft" onClick={() => { setF(empty); setSent(false); }}>Nieuwe melding</button>
      </div>
    </div>
  );

  return (
    <form className="contact-form-card kl-form" onSubmit={submit} noValidate>
      <h3>Laat het ons weten</h3>
      <p className="cf-sub">Kies wat bij je past. Je kunt een informele melding later altijd nog formeel maken.</p>

      <div className="choice-grid" role="radiogroup" aria-label="Soort melding">
        <button type="button" role="radio" aria-checked={!formeel} className={`choice ${!formeel ? "selected" : ""}`} onClick={() => set("soort", "informeel")}>
          <strong>Iets laten weten</strong><span>Informeel, we bellen je terug</span>
        </button>
        <button type="button" role="radio" aria-checked={formeel} className={`choice ${formeel ? "selected" : ""}`} onClick={() => set("soort", "formeel")}>
          <strong>Formele klacht</strong><span>Behandeld door de directie</span>
        </button>
      </div>

      <div className="field">
        <label htmlFor="kl-rol">Ik ben</label>
        <select id="kl-rol" value={f.rol} onChange={(e) => set("rol", e.target.value)}>
          <option value="">Kies…</option>
          <option>Jongere</option>
          <option>Ouder of verzorger</option>
          <option>Verwijzer of school</option>
          <option>Anders</option>
        </select>
      </div>

      <div className="field-row">
        <div className={`field ${err.naam ? "error" : ""}`}>
          <label htmlFor="kl-naam">Naam</label>
          <input id="kl-naam" type="text" autoComplete="name" value={f.naam} onChange={(e) => set("naam", e.target.value)} aria-invalid={!!err.naam} />
          {err.naam && <span className="err-msg">{err.naam}</span>}
        </div>
        <div className={`field ${err.contact ? "error" : ""}`}>
          <label htmlFor="kl-contact">E-mail of telefoon</label>
          <input id="kl-contact" type="text" autoComplete="email" value={f.contact} onChange={(e) => set("contact", e.target.value)} aria-invalid={!!err.contact} />
          {err.contact && <span className="err-msg">{err.contact}</span>}
        </div>
      </div>

      <div className={`field ${err.bericht ? "error" : ""}`}>
        <label htmlFor="kl-bericht">Wat speelt er?</label>
        <textarea id="kl-bericht" rows="5" value={f.bericht} onChange={(e) => set("bericht", e.target.value)} placeholder="Beschrijf in je eigen woorden wat er is gebeurd" aria-invalid={!!err.bericht} />
        {err.bericht && <span className="err-msg">{err.bericht}</span>}
      </div>
      <div className="field">
        <label htmlFor="kl-wens">Wat zou je graag zien als oplossing? (optioneel)</label>
        <textarea id="kl-wens" rows="2" value={f.wens} onChange={(e) => set("wens", e.target.value)} />
      </div>

      {submitError && <p className="err-msg" role="alert">{submitError}</p>}
      <button type="submit" className="btn btn-primary btn-lg btn-arrow" disabled={sending}>
        {sending ? "Bezig met verzenden…" : formeel ? "Klacht indienen" : "Melding versturen"} {!sending && <Icon name="arrow" size={18} />}
      </button>
    </form>
  );
};

const KlachtenPage = ({ navigate }) => {
  useReveal();
  const scrollToForm = () => {
    const el = document.getElementById("klachtformulier");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  };
  return (
    <div className="page-content">
      <InfoHero navigate={navigate} crumb="Klacht melden" eyebrow="Klachten"
        title="Niet tevreden? Zeg het ons."
        lead="Ontevreden zijn mag. Hoe eerder je het laat weten, hoe sneller we het samen kunnen oplossen. Je kiest zelf welke route bij je past." />

      <section style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="kl-quick reveal">
            <button className="kl-quick-item" onClick={scrollToForm}>
              <span className="kl-qi-icon"><Icon name="mail" size={20} /></span>
              <span><strong>Meld het online</strong><small>Informeel of formeel</small></span>
            </button>
            <a className="kl-quick-item" href="tel:0792340902">
              <span className="kl-qi-icon"><Icon name="phone" size={20} /></span>
              <span><strong>Bel ons</strong><small>079 234 0902, werkdagen 9.00–17.00</small></span>
            </a>
            <a className="kl-quick-item" href="mailto:info@denieuwekoers.net">
              <span className="kl-qi-icon"><Icon name="mail" size={20} /></span>
              <span><strong>Mail ons</strong><small>info@denieuwekoers.net</small></span>
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">De stappen</span>
            <h2>Vier routes, jij kiest.</h2>
            <p>Je hoeft de stappen niet op volgorde te doorlopen. Je mag er altijd een overslaan.</p>
          </div>
          <ol className="kl-ladder reveal">
            {KL_STEPS.map((s) => (
              <li key={s.n} className={`kl-step tone-${s.tone}`}>
                <span className="kl-num">{s.n}</span>
                <div>
                  <span className="kl-tag">{s.tag}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="klachtformulier" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="kl-grid reveal">
            <KlachtForm />
            <aside className="kl-aside">
              <div className="kl-box">
                <span className="eyebrow eyebrow--purple">Hulp nodig?</span>
                <h3>Vertrouwenspersoon Jeugdstem</h3>
                <p>Wil je eerst met iemand buiten De Nieuwe Koers praten? Een vertrouwenspersoon van Jeugdstem (voorheen AKJ) luistert, legt je rechten uit en helpt je bij het verwoorden van je klacht. Gratis en onafhankelijk.</p>
                <p className="kl-contact"><a href="tel:0885551000">088 555 1000</a> · <a href="https://jeugdstem.nl" target="_blank" rel="noopener noreferrer">jeugdstem.nl</a></p>
              </div>
              <div className="kl-box">
                <span className="eyebrow">Na je klacht</span>
                <h3>Zo houden we je op de hoogte</h3>
                <ol className="kl-follow">
                  <li><span className="kl-fnum">1</span><div><strong>Binnen 5 werkdagen</strong><p>We nemen contact met je op en plannen een gesprek.</p></div></li>
                  <li><span className="kl-fnum">2</span><div><strong>Het gesprek</strong><p>Samen kijken we wat er is gebeurd en wat jij nodig hebt om het op te lossen.</p></div></li>
                  <li><span className="kl-fnum">3</span><div><strong>Tussentijds bericht</strong><p>Hebben we meer tijd nodig? Dan laten we je dat vooraf weten, met de reden en een nieuwe datum. De termijn kan met maximaal 4 weken worden verlengd.</p></div></li>
                  <li><span className="kl-fnum">4</span><div><strong>Binnen 6 weken</strong><p>Je ontvangt een schriftelijke reactie van de directie: ons oordeel, welke maatregelen we nemen en wanneer.</p></div></li>
                  <li><span className="kl-fnum">5</span><div><strong>Niet tevreden met de uitkomst?</strong><p>In onze reactie staat hoe je verder kunt bij Erisietsmisgegaan.</p></div></li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { KlachtenPage });
