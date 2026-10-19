/* Contact, exacte teksten van de huidige site, verfijnde afwerking */

const WEB3FORMS_KEY = "b6546c24-8d21-4e55-825e-462708858850";

const ContactPage = ({ navigate }) => {
  useReveal();
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [form, setForm] = React.useState({ naam: "", email: "", bericht: "" });
  const [err, setErr] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validate = (f) => {
    const er = {};
    if (!f.naam.trim()) er.naam = "Vul je naam in";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = "Vul een geldig e-mailadres in";
    if (f.bericht.trim().length < 10) er.bericht = "Schrijf even iets meer";
    return er;
  };

  const onBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErr(validate(form));
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate(form);
    setErr(er);
    setTouched({ naam: true, email: true, bericht: true });
    if (Object.keys(er).length > 0) return;
    setSubmitError("");
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Nieuw contactbericht via de website",
          from_name: "De Nieuwe Koers \u2014 website",
          "Naam": form.naam,
          "E-mail": form.email,
          "Bericht": form.bericht,
        }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); }
      else { setSubmitError("Er ging iets mis bij het verzenden. Probeer het opnieuw of bel ons op 079 234 0902."); }
    } catch (_) {
      setSubmitError("Geen verbinding. Controleer je internet en probeer het opnieuw, of bel ons op 079 234 0902.");
    } finally {
      setSending(false);
    }
  };

  const showErr = (f) => touched[f] && err[f];

  return (
    <div className="page-content">
      {/* HERO */}
      <section className="contact-hero" style={{ padding: 0 }}>
        <div className="container" style={{ padding: "clamp(40px,6vw,72px) 24px clamp(36px,5vw,56px)" }}>
          <nav className="breadcrumb" aria-label="Kruimelpad">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a>
            <span aria-hidden="true">›</span>
            <span>Contact</span>
          </nav>
          <span className="eyebrow">Contact</span>
          <h1>Even bellen, mailen of langskomen?</h1>
          <p className="lead">We zijn elke werkdag bereikbaar tussen 09:00 en 17:00. Geen tijd voor formulieren? Bel gewoon.</p>
        </div>
      </section>

      {/* INFO + FORM */}
      <section style={{ paddingTop: "clamp(40px,6vw,64px)" }}>
        <div className="container">
          <div className="contact-grid reveal">
            {/* Dark info panel */}
            <div className="contact-info">
              <h3>Direct contact</h3>
              <p className="ci-sub">Kies wat het snelst werkt, we helpen je graag verder.</p>
              <div className="contact-info-row">
                <span className="icn"><Icon name="pin" size={20} /></span>
                <div><strong>Adres</strong><span>Willem Dreeslaan 181<br />2729 NE Zoetermeer</span></div>
              </div>
              <div className="contact-info-row">
                <span className="icn"><Icon name="mail" size={20} /></span>
                <div><strong>E-mail</strong><span><a href="mailto:info@denieuwekoers.net">info@denieuwekoers.net</a></span></div>
              </div>
              <div className="contact-info-row">
                <span className="icn"><Icon name="phone" size={20} /></span>
                <div><strong>Telefoon</strong><span><a href="tel:0792340902">079 234 0902</a></span></div>
              </div>
              <div className="contact-hours">
                <strong>Openingstijden</strong>
                <div className="ch-row"><span>Maandag t/m vrijdag</span><span className="open">09:00 tot 17:00</span></div>
                <div className="ch-row"><span>Weekend</span><span style={{ color: "rgba(255,255,255,0.6)" }}>Op afspraak</span></div>
              </div>
            </div>

            {/* Form card */}
            <div className="contact-form-card">
              {sent ? (
                <div className="cf-success">
                  <span className="check"><Icon name="check" size={36} stroke={3} /></span>
                  <h3>Bericht verstuurd!</h3>
                  <p>Bedankt {form.naam}, we reageren binnen 1 werkdag.</p>
                  <button className="btn btn-soft" onClick={() => { setSent(false); setForm({ naam: "", email: "", bericht: "" }); setTouched({}); setErr({}); }}>Nieuw bericht</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h3>Of stuur een bericht</h3>
                  <p className="cf-sub">We reageren binnen 1 werkdag.</p>
                  <div className={`field ${showErr("naam") ? "error" : ""}`}>
                    <label htmlFor="cf-naam">Naam</label>
                    <input id="cf-naam" type="text" autoComplete="name" value={form.naam}
                      onChange={(e) => setForm((f) => ({ ...f, naam: e.target.value }))}
                      onBlur={() => onBlur("naam")} placeholder="Jouw naam"
                      aria-invalid={!!showErr("naam")} />
                    {showErr("naam") && <span className="err-msg"><Icon name="spark" size={13} /> {err.naam}</span>}
                  </div>
                  <div className={`field ${showErr("email") ? "error" : ""}`}>
                    <label htmlFor="cf-email">E-mail</label>
                    <input id="cf-email" type="email" autoComplete="email" value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onBlur={() => onBlur("email")} placeholder="jouw@email.nl"
                      aria-invalid={!!showErr("email")} />
                    {showErr("email") && <span className="err-msg"><Icon name="spark" size={13} /> {err.email}</span>}
                  </div>
                  <div className={`field ${showErr("bericht") ? "error" : ""}`}>
                    <label htmlFor="cf-bericht">Bericht</label>
                    <textarea id="cf-bericht" rows="5" value={form.bericht}
                      onChange={(e) => setForm((f) => ({ ...f, bericht: e.target.value }))}
                      onBlur={() => onBlur("bericht")} placeholder="Waar kunnen we je mee helpen?"
                      aria-invalid={!!showErr("bericht")} />
                    {showErr("bericht") && <span className="err-msg"><Icon name="spark" size={13} /> {err.bericht}</span>}
                  </div>
                  {submitError && <div className="err-msg" style={{ marginBottom: 14 }}><Icon name="spark" size={14} /> {submitError}</div>}
                  <button type="submit" className="btn btn-primary btn-lg btn-arrow" disabled={sending}>{sending ? "Bezig met verzenden\u2026" : <>Bericht versturen <Icon name="arrow" size={18} /></>}</button>
                </form>
              )}
            </div>
          </div>

          <div className="contact-map reveal">
            <iframe
              src="https://maps.google.com/maps?q=Willem%20Dreeslaan%20181%20Zoetermeer&t=m&z=14&output=embed&iwloc=near"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Locatie De Nieuwe Koers, Willem Dreeslaan 181, Zoetermeer"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { ContactPage });
