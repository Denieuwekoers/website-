/* Aanmelden, multi-step wizard, exacte teksten van de huidige site */

const AanmeldPage = ({ navigate }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    rol: "", spoor: "",
    voornaam: "", achternaam: "", leeftijd: "", postcode: "",
    contact_naam: "", email: "", telefoon: "",
    hulpvraag: "", financiering: "", urgentie: "",
  });
  const [errors, setErrors] = React.useState({});
  const [done, setDone] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const LABELS = {
    rol: { ouder: "Ouder/verzorger", jongere: "Jongere zelf", school: "School / leerkracht", verwijzer: "Verwijzer" },
    spoor: { kompas: "Dagbesteding Het Kompas", ambulant: "Ambulante- en gezinsbegeleiding", onderwijs: "Jeugdhulp binnen het Onderwijs", trainingen: "Trainingen & Workshops", diagnostiek: "Screenende Diagnostiek", weet_niet: "Weet ik nog niet" },
    financiering: { zin: "ZIN (gemeente)", pgb: "PGB", particulier: "Particulier", weet_niet: "Weet ik niet" },
    urgentie: { laag: "Geen haast", midden: "Binnen een maand", hoog: "Zo snel mogelijk" },
  };

  const update = (k, v) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!data.rol) e.rol = "Kies een optie";
      if (!data.spoor) e.spoor = "Kies een richting";
    } else if (step === 1) {
      if (!data.voornaam.trim()) e.voornaam = "Vul je voornaam in";
      if (!data.achternaam.trim()) e.achternaam = "Vul je achternaam in";
      if (!data.leeftijd || isNaN(+data.leeftijd) || +data.leeftijd < 5 || +data.leeftijd > 30) e.leeftijd = "Tussen 7 en 23";
      if (!/^\d{4}\s?[a-z]{2}$/i.test(data.postcode.trim())) e.postcode = "Bijv. 2729 NE";
    } else if (step === 2) {
      if (!data.contact_naam.trim()) e.contact_naam = "Naam contactpersoon";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Geldig e-mailadres";
      if (!/^[\d\s+\-()]{8,}$/.test(data.telefoon)) e.telefoon = "Geldig telefoonnummer";
    } else if (step === 3) {
      if (!data.hulpvraag.trim() || data.hulpvraag.trim().length < 20) e.hulpvraag = "Minstens 20 tekens, wat speelt er?";
      if (!data.financiering) e.financiering = "Kies een optie";
      if (!data.urgentie) e.urgentie = "Kies een optie";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, 3)); };
  const submit = async () => {
    if (!validate()) return;
    setSubmitError("");
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nieuwe aanmelding via de website",
          from_name: "De Nieuwe Koers \u2014 aanmelding",
          "Ik ben": LABELS.rol[data.rol] || data.rol,
          "Richting": LABELS.spoor[data.spoor] || data.spoor,
          "Voornaam jongere": data.voornaam,
          "Achternaam jongere": data.achternaam,
          "Leeftijd": data.leeftijd,
          "Postcode": data.postcode,
          "Naam contactpersoon": data.contact_naam,
          "E-mail": data.email,
          "Telefoon": data.telefoon,
          "Hulpvraag": data.hulpvraag,
          "Financiering": LABELS.financiering[data.financiering] || data.financiering,
          "Urgentie": LABELS.urgentie[data.urgentie] || data.urgentie,
        }),
      });
      const result = await res.json();
      if (result.success) { setDone(true); }
      else { setSubmitError("Er ging iets mis bij het verzenden. Probeer het opnieuw of bel ons op 079 234 0902."); }
    } catch (_) {
      setSubmitError("Geen verbinding. Controleer je internet en probeer het opnieuw, of bel ons op 079 234 0902.");
    } finally {
      setSending(false);
    }
  };

  const steps = [
    { t: "Wie & wat", s: "Korte intro" },
    { t: "Jongere", s: "Over wie gaat het?" },
    { t: "Contact", s: "Hoe bereiken we je?" },
    { t: "Hulpvraag", s: "Wat speelt er?" },
  ];

  const reset = () => { setDone(false); setStep(0); setData({ rol: "", spoor: "", voornaam: "", achternaam: "", leeftijd: "", postcode: "", contact_naam: "", email: "", telefoon: "", hulpvraag: "", financiering: "", urgentie: "" }); };

  return (
    <div className="page-content">
      {/* HERO */}
      <section className="aanmeld-hero" style={{ padding: 0 }}>
        <div className="container" style={{ padding: "clamp(40px,6vw,72px) 24px clamp(36px,5vw,56px)" }}>
          <nav className="breadcrumb" aria-label="Kruimelpad">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
            <span aria-hidden="true">›</span>
            <span>Aanmelden</span>
          </nav>
          <span className="eyebrow">Aanmelden</span>
          <h1>Vier korte stappen, dan zoeken wij contact.</h1>
          <p className="lead">Binnen 2 werkdagen krijg je antwoord. Geen verplichtingen, gewoon een eerste gesprek.</p>
        </div>
      </section>

      <section style={{ paddingTop: "clamp(40px,6vw,64px)", paddingBottom: "clamp(64px,9vw,112px)" }}>
        <div className="container">
          <div className="aanmeld-shell">
            <aside className="aanmeld-side">
              <h3>Aanmelding</h3>
              <p>Het invullen duurt ongeveer 3 minuten. Twijfel je? Bel ons gerust op <strong>079 234 0902</strong>.</p>
              <ol className="step-list">
                {steps.map((s, i) => (
                  <li key={i} className={done ? "done" : step === i ? "active" : i < step ? "done" : ""}>
                    <span className="step-circle">{i < step || done ? <Icon name="check" size={16} stroke={3} /> : i + 1}</span>
                    <div>
                      <div className="step-title">{s.t}</div>
                      <div className="step-sub">{s.s}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="side-foot">
                <Icon name="shield" size={16} />
                <span>Je gegevens zijn veilig. We delen niets zonder jouw toestemming.</span>
              </div>
            </aside>

            {done ? (
              <div className="aanmeld-form">
                <div className="aanmeld-success">
                  <span className="check"><Icon name="check" size={38} stroke={3} /></span>
                  <h3>Bedankt {data.contact_naam}!</h3>
                  <p>Je aanmelding is binnen. We bellen je binnen 2 werkdagen op {data.telefoon} voor een eerste kennismaking.</p>
                  <div className="as-actions">
                    <button className="btn btn-soft" onClick={() => navigate("home")}>Terug naar home</button>
                    <button className="btn btn-accent" onClick={reset}>Nieuwe aanmelding</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aanmeld-form">
                <h3>{steps[step].t}</h3>
                <p className="step-help">{
                  step === 0 ? "Vertel ons kort wie je bent en welke richting het beste past." :
                  step === 1 ? "Een paar basisgegevens van de jongere om wie het gaat." :
                  step === 2 ? "Hoe kunnen we je het beste bereiken?" :
                  "Vertel kort wat er speelt, hoe meer we weten, hoe gerichter we kunnen helpen."
                }</p>

                {step === 0 && (
                  <React.Fragment>
                    <label className="field-group-label">Ik ben…</label>
                    <div className="choice-grid" role="radiogroup" aria-label="Ik ben">
                      {[
                        { id: "ouder", t: "Ouder/verzorger", d: "Ik zoek hulp voor mijn kind" },
                        { id: "jongere", t: "Jongere zelf", d: "Ik zoek hulp voor mezelf" },
                        { id: "school", t: "School / leerkracht", d: "Ik meld een leerling aan" },
                        { id: "verwijzer", t: "Verwijzer", d: "Gemeente, jeugdzorg, huisarts" },
                      ].map((o) => (
                        <button key={o.id} type="button" role="radio" aria-checked={data.rol === o.id}
                          className={`choice ${data.rol === o.id ? "selected" : ""}`} onClick={() => update("rol", o.id)}>
                          <strong>{o.t}</strong><span>{o.d}</span>
                        </button>
                      ))}
                    </div>
                    {errors.rol && <div className="err-msg" style={{ marginTop: -12, marginBottom: 16 }}><Icon name="spark" size={13} /> {errors.rol}</div>}

                    <label className="field-group-label" style={{ marginTop: 8 }}>Welke richting sluit het beste aan?</label>
                    <div className="choice-grid" role="radiogroup" aria-label="Welke richting">
                      {[
                        { id: "kompas", t: "Dagbesteding Het Kompas", d: "Structuur, ritme & dagbesteding" },
                        { id: "ambulant", t: "Ambulante- en gezinsbegeleiding", d: "Begeleiding thuis & in het gezin" },
                        { id: "onderwijs", t: "Jeugdhulp binnen het Onderwijs", d: "Steun in en rond school" },
                        { id: "trainingen", t: "Trainingen & Workshops", d: "Vaardigheden voor jongeren & teams" },
                        { id: "diagnostiek", t: "Screenende Diagnostiek", d: "Beeld krijgen van wat er speelt" },
                        { id: "weet_niet", t: "Ik weet het niet", d: "Help me kiezen" },
                      ].map((o) => (
                        <button key={o.id} type="button" role="radio" aria-checked={data.spoor === o.id}
                          className={`choice ${data.spoor === o.id ? "selected" : ""}`} onClick={() => update("spoor", o.id)}>
                          <strong>{o.t}</strong><span>{o.d}</span>
                        </button>
                      ))}
                    </div>
                    {errors.spoor && <div className="err-msg" style={{ marginTop: -8 }}><Icon name="spark" size={13} /> {errors.spoor}</div>}
                  </React.Fragment>
                )}

                {step === 1 && (
                  <React.Fragment>
                    <div className="field-row">
                      <div className={`field ${errors.voornaam ? "error" : ""}`}>
                        <label htmlFor="am-voornaam">Voornaam jongere</label>
                        <input id="am-voornaam" type="text" value={data.voornaam} onChange={(e) => update("voornaam", e.target.value)} placeholder="Sara" />
                        {errors.voornaam && <span className="err-msg"><Icon name="spark" size={13} /> {errors.voornaam}</span>}
                      </div>
                      <div className={`field ${errors.achternaam ? "error" : ""}`}>
                        <label htmlFor="am-achternaam">Achternaam</label>
                        <input id="am-achternaam" type="text" value={data.achternaam} onChange={(e) => update("achternaam", e.target.value)} placeholder="de Vries" />
                        {errors.achternaam && <span className="err-msg"><Icon name="spark" size={13} /> {errors.achternaam}</span>}
                      </div>
                    </div>
                    <div className="field-row">
                      <div className={`field ${errors.leeftijd ? "error" : ""}`}>
                        <label htmlFor="am-leeftijd">Leeftijd</label>
                        <input id="am-leeftijd" type="number" value={data.leeftijd} onChange={(e) => update("leeftijd", e.target.value)} placeholder="16" min="5" max="30" />
                        {errors.leeftijd && <span className="err-msg"><Icon name="spark" size={13} /> {errors.leeftijd}</span>}
                      </div>
                      <div className={`field ${errors.postcode ? "error" : ""}`}>
                        <label htmlFor="am-postcode">Postcode</label>
                        <input id="am-postcode" type="text" value={data.postcode} onChange={(e) => update("postcode", e.target.value)} placeholder="2729 NE" />
                        {errors.postcode && <span className="err-msg"><Icon name="spark" size={13} /> {errors.postcode}</span>}
                      </div>
                    </div>
                  </React.Fragment>
                )}

                {step === 2 && (
                  <React.Fragment>
                    <div className={`field ${errors.contact_naam ? "error" : ""}`}>
                      <label htmlFor="am-cnaam">Naam contactpersoon</label>
                      <input id="am-cnaam" type="text" autoComplete="name" value={data.contact_naam} onChange={(e) => update("contact_naam", e.target.value)} placeholder="Hoe heet jij?" />
                      {errors.contact_naam && <span className="err-msg"><Icon name="spark" size={13} /> {errors.contact_naam}</span>}
                    </div>
                    <div className={`field ${errors.email ? "error" : ""}`}>
                      <label htmlFor="am-email">E-mailadres</label>
                      <input id="am-email" type="email" autoComplete="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="jouw@email.nl" />
                      {errors.email && <span className="err-msg"><Icon name="spark" size={13} /> {errors.email}</span>}
                    </div>
                    <div className={`field ${errors.telefoon ? "error" : ""}`}>
                      <label htmlFor="am-tel">Telefoonnummer</label>
                      <input id="am-tel" type="tel" autoComplete="tel" value={data.telefoon} onChange={(e) => update("telefoon", e.target.value)} placeholder="06 12 34 56 78" />
                      {errors.telefoon && <span className="err-msg"><Icon name="spark" size={13} /> {errors.telefoon}</span>}
                    </div>
                  </React.Fragment>
                )}

                {step === 3 && (
                  <React.Fragment>
                    <div className={`field ${errors.hulpvraag ? "error" : ""}`}>
                      <label htmlFor="am-hulp">Wat speelt er? (kort)</label>
                      <textarea id="am-hulp" rows="4" value={data.hulpvraag} onChange={(e) => update("hulpvraag", e.target.value)} placeholder="Bijv. mijn dochter zit al 4 maanden thuis na een burn-out op school..." />
                      {errors.hulpvraag && <span className="err-msg"><Icon name="spark" size={13} /> {errors.hulpvraag}</span>}
                    </div>
                    <div className="field-row">
                      <div className={`field ${errors.financiering ? "error" : ""}`}>
                        <label htmlFor="am-fin">Financiering</label>
                        <select id="am-fin" value={data.financiering} onChange={(e) => update("financiering", e.target.value)}>
                          <option value="">Kies…</option>
                          <option value="zin">ZIN (gemeente)</option>
                          <option value="pgb">PGB</option>
                          <option value="particulier">Particulier</option>
                          <option value="weet_niet">Weet ik niet</option>
                        </select>
                        {errors.financiering && <span className="err-msg"><Icon name="spark" size={13} /> {errors.financiering}</span>}
                      </div>
                      <div className={`field ${errors.urgentie ? "error" : ""}`}>
                        <label htmlFor="am-urg">Hoe spoedeisend?</label>
                        <select id="am-urg" value={data.urgentie} onChange={(e) => update("urgentie", e.target.value)}>
                          <option value="">Kies…</option>
                          <option value="laag">Geen haast</option>
                          <option value="midden">Binnen een maand</option>
                          <option value="hoog">Zo snel mogelijk</option>
                        </select>
                        {errors.urgentie && <span className="err-msg"><Icon name="spark" size={13} /> {errors.urgentie}</span>}
                      </div>
                    </div>
                  </React.Fragment>
                )}

                <div className="form-actions">
                  <div className="fa-left">
                    {step > 0 && <button className="btn btn-soft" onClick={() => setStep((s) => s - 1)} disabled={sending}>Terug</button>}
                    <div className="form-progress" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => <span key={i} className={i === step ? "active" : i < step ? "done" : ""}></span>)}
                    </div>
                  </div>
                  {step < 3
                    ? <button className="btn btn-primary btn-arrow" onClick={next}>Volgende <Icon name="arrow" size={17} /></button>
                    : <button className="btn btn-accent btn-arrow" onClick={submit} disabled={sending}>{sending ? "Bezig met verzenden\u2026" : <>Aanmelding versturen <Icon name="arrow" size={17} /></>}</button>}
                </div>
                {submitError && <div className="err-msg" style={{ marginTop: 16, justifyContent: "flex-end" }}><Icon name="spark" size={14} /> {submitError}</div>}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { AanmeldPage });
