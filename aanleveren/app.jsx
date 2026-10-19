/* Het Kompas – aanleverplatform (besloten pagina van De Nieuwe Koers).
   Staat los van het-kompas.net: eigen database en eigen accounts. */

const PROJECT = "https://mcjnsomdphjrmtqoapjg.supabase.co";
const API = PROJECT + "/functions/v1/kompas";
const AUTH = PROJECT + "/auth/v1";
const SLEUTEL = "sb_publishable_Vz1bcPSlhSM8KbTE9WAtfg_UDIpxnjC";
const MAX_MB = 20;
const OPSLAG = "kompas_aanlever_sessie";

/* ------------------------------------------------------------- sessie */
function leesSessie() {
  try { return JSON.parse(sessionStorage.getItem(OPSLAG) || "null"); } catch (e) { return null; }
}
function bewaarSessie(s) {
  try { s ? sessionStorage.setItem(OPSLAG, JSON.stringify(s)) : sessionStorage.removeItem(OPSLAG); } catch (e) { /* privévenster */ }
  geheugenSessie = s;
}
let geheugenSessie = leesSessie();

async function vernieuwBeheer(s) {
  if (!s || s.soort !== "admin") return s;
  if (Date.now() < (s.verloopt - 60) * 1000) return s;
  const r = await fetch(AUTH + "/token?grant_type=refresh_token", {
    method: "POST", headers: { apikey: SLEUTEL, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: s.refresh }),
  });
  if (!r.ok) { bewaarSessie(null); return null; }
  const j = await r.json();
  const nieuw = { soort: "admin", toegang: j.access_token, refresh: j.refresh_token, verloopt: j.expires_at };
  bewaarSessie(nieuw);
  return nieuw;
}

class ApiFout extends Error { constructor(m, status) { super(m); this.status = status; } }

async function api(actie_naam, data = {}) {
  const s = await vernieuwBeheer(geheugenSessie);
  const headers = { "Content-Type": "application/json", apikey: SLEUTEL };
  if (s?.soort === "code") headers["x-sessie"] = s.token;
  if (s?.soort === "admin") headers["Authorization"] = "Bearer " + s.toegang;
  let r;
  try {
    r = await fetch(API, { method: "POST", headers, body: JSON.stringify({ ...data, actie_naam }) });
  } catch (e) {
    throw new ApiFout("Geen verbinding. Controleer je internet en probeer het opnieuw.", 0);
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 401 && actie_naam !== "login_code") { bewaarSessie(null); window.dispatchEvent(new Event("kompas-uitgelogd")); }
    throw new ApiFout(j.fout || "Er ging iets mis. Probeer het opnieuw.", r.status);
  }
  return j;
}

async function loginBeheer(email, wachtwoord) {
  const r = await fetch(AUTH + "/token?grant_type=password", {
    method: "POST", headers: { apikey: SLEUTEL, "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password: wachtwoord }),
  });
  if (!r.ok) throw new ApiFout("E-mailadres of wachtwoord klopt niet.", 401);
  const j = await r.json();
  bewaarSessie({ soort: "admin", toegang: j.access_token, refresh: j.refresh_token, verloopt: j.expires_at });
  const ik = await api("ik");
  if (!ik.gebruiker || ik.gebruiker.rol !== "admin") {
    bewaarSessie(null);
    throw new ApiFout("Dit account heeft geen toegang tot het beheer.", 403);
  }
  return ik;
}

async function uitloggenOveral() {
  const s = geheugenSessie;
  try {
    if (s?.soort === "code") await api("uitloggen", { token: s.token });
    if (s?.soort === "admin") {
      await fetch(AUTH + "/logout", { method: "POST", headers: { apikey: SLEUTEL, Authorization: "Bearer " + s.toegang } });
    }
  } catch (e) { /* uitloggen lukt lokaal altijd */ }
  bewaarSessie(null);
}

async function bestandOpenen(id, zetMelding) {
  try {
    const { url } = await api("bestand", { id });
    window.location.href = url;
  } catch (e) { zetMelding(e.message, "fout"); }
}

async function bestandenUploaden(opdrachtId, bestanden) {
  const meldingen = [];
  let aantal = 0;
  for (const f of bestanden) {
    try {
      if (f.size > MAX_MB * 1024 * 1024) throw new Error(`Bestand '${f.name}' is groter dan ${MAX_MB} MB en is overgeslagen.`);
      const { pad, url } = await api("upload_start", { opdracht_id: opdrachtId, naam: f.name, grootte: f.size, type: f.type });
      const r = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": f.type || "application/octet-stream", "x-upsert": "false", "cache-control": "max-age=3600" },
        body: f,
      });
      if (!r.ok) throw new Error(`Bestand '${f.name}' kon niet worden geüpload.`);
      await api("upload_klaar", { opdracht_id: opdrachtId, pad, naam: f.name, grootte: f.size, type: f.type });
      aantal++;
    } catch (e) { meldingen.push(e.message); }
  }
  if (aantal > 0) meldingen.push(aantal === 1 ? "1 bestand toegevoegd." : `${aantal} bestanden toegevoegd.`);
  return meldingen;
}

/* -------------------------------------------------------------- weken */
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dag = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dag);
  const jaar = t.getUTCFullYear();
  return [Math.ceil(((t - Date.UTC(jaar, 0, 1)) / 86400000 + 1) / 7), jaar];
}
const wekenInJaar = (j) => isoWeek(new Date(j, 11, 28))[0];
const volgendeWeek = (w, j) => (w >= wekenInJaar(j) ? [1, j + 1] : [w + 1, j]);
const weeklabel = (w, j) => `Week ${w} · ${j}`;

/* ---------------------------------------------------------------- hulp */
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function datumKort(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getDate()} ${MAANDEN[d.getMonth()]} ${d.getFullYear()}`;
}
function grootte(b) {
  b = Number(b) || 0;
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return Math.round(b / 1024) + " KB";
  return (b / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
}
function icoon(naam) {
  const ext = (String(naam).toLowerCase().match(/\.([a-z0-9]+)$/) || [])[1] || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(ext)) return "afbeelding";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "odt", "rtf", "txt"].includes(ext)) return "tekst";
  if (["xls", "xlsx", "csv"].includes(ext)) return "tabel";
  if (["ppt", "pptx"].includes(ext)) return "presentatie";
  if (["mp3", "m4a", "mp4"].includes(ext)) return "media";
  return "bestand";
}
const mv = (n, een, meer) => (Number(n) === 1 ? een : meer);
const initialen = (naam) => {
  const d = String(naam).trim().split(/\s+/);
  return ((d[0] || "")[0] || "").toUpperCase() + (d.length > 1 ? (d[d.length - 1][0] || "").toUpperCase() : "");
};
const formData = (e) => Object.fromEntries(new FormData(e.currentTarget).entries());
const veiligeLink = (l) => (/^https?:\/\//i.test(l || "") ? l : null);

/* -------------------------------------------------------------- router */
function leesRoute() {
  const h = (window.location.hash || "").replace(/^#\/?/, "");
  const [pad, query] = h.split("?");
  return { delen: pad.split("/").filter(Boolean), q: Object.fromEntries(new URLSearchParams(query || "")) };
}
function ga(pad) { window.location.hash = "#/" + pad.replace(/^\//, ""); }

const Ctx = React.createContext(null);
const useApp = () => React.useContext(Ctx);

function useData(actie, params, deps) {
  const [st, zet] = React.useState({ data: null, laden: true, fout: null });
  const [teller, zetTeller] = React.useState(0);
  React.useEffect(() => {
    let weg = false;
    zet((s) => ({ ...s, laden: true, fout: null }));
    api(actie, params).then(
      (data) => !weg && zet({ data, laden: false, fout: null }),
      (e) => !weg && zet({ data: null, laden: false, fout: e.message }),
    );
    return () => { weg = true; };
  }, [...deps, teller]);
  return { ...st, herlaad: () => zetTeller((t) => t + 1) };
}

function Laden({ st, children }) {
  if (st.laden && !st.data) return <p className="zacht laad">Even laden…</p>;
  if (st.fout) return <div className="melding fout">{st.fout}</div>;
  return children(st.data);
}

/* Knop die een actie uitvoert, met bevestiging en melding. */
function ActieKnop({ actie, data, bevestig, klasse = "knop klein rand", na, children }) {
  const { melding } = useApp();
  const [bezig, zetBezig] = React.useState(false);
  async function klik() {
    if (bevestig && !window.confirm(bevestig)) return;
    zetBezig(true);
    try {
      const r = await api(actie, data);
      if (r.melding) melding(r.melding);
      na && na(r);
    } catch (e) { melding(e.message, "fout"); }
    zetBezig(false);
  }
  return <button type="button" className={klasse} disabled={bezig} onClick={klik}>{children}</button>;
}

/* ============================================================ inloggen */
function Login({ tab }) {
  const { melding, naInloggen } = useApp();
  const [bezig, zetBezig] = React.useState(false);
  tab = ["leerling", "docent", "beheer"].includes(tab) ? tab : "leerling";

  async function codeLogin(e, soort) {
    e.preventDefault();
    const { code } = formData(e);
    zetBezig(true);
    try {
      const { token } = await api("login_code", { soort, code });
      bewaarSessie({ soort: "code", token });
      await naInloggen();
    } catch (er) { melding(er.message, "fout"); }
    zetBezig(false);
  }
  async function beheerLogin(e) {
    e.preventDefault();
    const { email, wachtwoord } = formData(e);
    zetBezig(true);
    try { await loginBeheer(email, wachtwoord); await naInloggen(); }
    catch (er) { melding(er.message, "fout"); }
    zetBezig(false);
  }

  return (
    <div className="auth-kaart">
      <div className="auth-merk">
        <img src="/aanleveren/assets/logo-denieuwekoers.png" alt="De Nieuwe Koers" className="auth-wordmark" />
        <div className="auth-product"><strong>Het Kompas</strong><span>Aanleverplatform onderwijs</span></div>
      </div>
      <nav className="tabs">
        <a href="#/login/leerling" className={tab === "leerling" ? "actief" : ""}>Leerling</a>
        <a href="#/login/docent" className={tab === "docent" ? "actief" : ""}>Docent</a>
        <a href="#/login/beheer" className={tab === "beheer" ? "actief" : ""}>Beheer</a>
      </nav>

      {tab === "leerling" && (
        <>
          <h1>Hoi! Vul je code in</h1>
          <p className="mini">Je krijgt je code van je begeleider. Je hebt geen wachtwoord nodig.</p>
          <form className="formulier" onSubmit={(e) => codeLogin(e, "leerling")}>
            <label>Jouw code
              <input type="text" name="code" className="code-invoer" placeholder="XXX-0000-0000" autoComplete="off"
                autoCapitalize="characters" spellCheck="false" required autoFocus />
            </label>
            <button className="knop groen" type="submit" disabled={bezig}>Naar mijn opdrachten</button>
          </form>
        </>
      )}
      {tab === "docent" && (
        <>
          <h1>Inloggen als docent</h1>
          <p className="mini">Vul de koppelcode van je school in.</p>
          <form className="formulier" onSubmit={(e) => codeLogin(e, "docent")}>
            <label>Koppelcode van de school
              <input type="text" name="code" className="code-invoer" placeholder="XXX-0000-0000" autoComplete="off"
                autoCapitalize="characters" spellCheck="false" required autoFocus />
            </label>
            <button className="knop" type="submit" disabled={bezig}>Verder</button>
          </form>
        </>
      )}
      {tab === "beheer" && (
        <>
          <h1>Beheer</h1>
          <p className="mini">Alleen voor beheerders van Het Kompas.</p>
          <form className="formulier" onSubmit={beheerLogin}>
            <label>E-mailadres<input type="email" name="email" autoComplete="username" required autoFocus /></label>
            <label>Wachtwoord<input type="password" name="wachtwoord" autoComplete="current-password" required /></label>
            <button className="knop" type="submit" disabled={bezig}>Inloggen</button>
          </form>
        </>
      )}
    </div>
  );
}

/* ============================================================== docent */
function DocentDashboard() {
  const { gebruiker, nu } = useApp();
  const st = useData("d_dashboard", {}, []);
  return (
    <>
      <div className="kop"><div>
        <h1>Mijn leerlingen</h1>
        <p className="zacht">{gebruiker.school_naam} · {weeklabel(nu.week, nu.jaar)}</p>
      </div></div>
      <Laden st={st}>{({ leerlingen }) => leerlingen.length === 0 ? (
        <div className="leeg"><h3>Nog geen leerlingen gekoppeld</h3><p>De beheerder van Het Kompas koppelt de leerlingen aan jouw school.</p></div>
      ) : (
        <div className="raster">
          {leerlingen.map((l) => (
            <a key={l.id} className="kaart leerlingkaart" href={`#/docent/leerling/${l.id}`}>
              <div className="initialen">{initialen(l.naam)}</div>
              <div className="naam">{l.naam}</div>
              <div className="mini">{l.deze_week} {mv(l.deze_week, "opdracht", "opdrachten")} deze week · {l.aantal_opdrachten} in totaal</div>
              {l.deze_week > 0 && (
                <div className="mini" style={{ color: l.af_deze_week === l.deze_week ? "var(--groen-600)" : "var(--grijs-700)" }}>
                  {l.af_deze_week} van {l.deze_week} afgerond
                </div>
              )}
              {l.aantal_vakken === 0 && <div className="mini" style={{ color: "var(--oker)" }}>Nog geen vakken aangevinkt</div>}
            </a>
          ))}
        </div>
      )}</Laden>
    </>
  );
}

function OpdrachtRij({ o, href, nieuw, children }) {
  const status = o.afgerond ? "af" : o.zichtbaar ? "open" : "dicht";
  return (
    <a className={`opdrachtrij ${status} ${nieuw ? "zojuist" : ""}`} href={href}>
      <div className="body">
        <div className="titel">{o.titel}</div>
        <div className="meta">{children}</div>
      </div>
      <span className={`merkje ${nieuw ? "nieuw" : status}`}>
        {nieuw ? "Zojuist klaargezet" : o.afgerond ? "✓ Afgerond" : o.zichtbaar ? "Zichtbaar" : "Nog dicht"}
      </span>
    </a>
  );
}

function perWeek(opdrachten) {
  const groepen = [];
  const index = {};
  for (const o of opdrachten) {
    const k = o.jaar + "|" + o.werkweek;
    if (!(k in index)) { index[k] = groepen.length; groepen.push({ week: o.werkweek, jaar: o.jaar, items: [] }); }
    groepen[index[k]].items.push(o);
  }
  return groepen;
}

function DocentLeerling({ id, q }) {
  const { melding } = useApp();
  const st = useData("d_leerling", { id }, [id]);
  async function vakkenOpslaan(e, leerlingId) {
    e.preventDefault();
    const vakken = new FormData(e.currentTarget).getAll("vakken");
    try { const r = await api("d_vakken_opslaan", { leerling_id: leerlingId, vakken }); melding(r.melding); st.herlaad(); }
    catch (er) { melding(er.message, "fout"); }
  }
  return (
    <Laden st={st}>{({ leerling, opdrachten, schoolvakken, leerlingvakken }) => {
      const gekozen = new Set(leerlingvakken.map((v) => v.id));
      return (
        <>
          <a className="terug" href="#/docent">&larr; Alle leerlingen</a>
          <div className="kop">
            <div>
              <h1>{leerling.naam}</h1>
              <p className="zacht">{leerling.school_naam}{leerling.geboortejaar ? ` · geboortejaar ${leerling.geboortejaar}` : ""}</p>
            </div>
            <a className="knop" href={`#/docent/nieuw/${leerling.id}`}>+ Werk aanleveren</a>
          </div>
          {leerling.notitie && <div className="melding let"><strong>Aandachtspunt:</strong> {leerling.notitie}</div>}

          <details className="uitklap" open={leerlingvakken.length === 0}>
            <summary>Vakken van {leerling.naam} <span className="zacht">— {leerlingvakken.length ? leerlingvakken.map((v) => v.naam).join(", ") : "nog niets aangevinkt"}</span></summary>
            {schoolvakken.length === 0 ? (
              <p className="mini">Voor {leerling.school_naam} staan nog geen vakken klaar. Vraag de beheerder van Het Kompas om de vakkenlijst van de school in te vullen.</p>
            ) : (
              <>
                <p className="mini">Vink aan welke vakken deze leerling volgt. Alleen die vakken kun je bij een opdracht kiezen.</p>
                <form className="formulier" onSubmit={(e) => vakkenOpslaan(e, leerling.id)} key={[...gekozen].join(",")}>
                  <div className="vakkenkiezer">
                    {schoolvakken.map((v) => (
                      <label className="vakvinkje" key={v.id}>
                        <input type="checkbox" name="vakken" value={v.id} defaultChecked={gekozen.has(v.id)} />
                        <span>{v.naam}</span>
                      </label>
                    ))}
                  </div>
                  <div><button className="knop klein" type="submit">Vakken opslaan</button></div>
                </form>
              </>
            )}
          </details>

          {opdrachten.length === 0 ? (
            <div className="leeg">
              <h3>Nog niets aangeleverd</h3>
              <p>Zet hier het werk klaar dat {leerling.naam} moet doen.</p>
              <a className="knop" href={`#/docent/nieuw/${leerling.id}`}>Werk aanleveren</a>
            </div>
          ) : perWeek(opdrachten).map((g) => {
            const [nw] = volgendeWeek(g.week, g.jaar);
            const af = g.items.filter((o) => o.afgerond).length;
            return (
              <React.Fragment key={g.jaar + "-" + g.week}>
                <div className="weekkop">
                  <span>{weeklabel(g.week, g.jaar)} — {af}/{g.items.length} afgerond</span>
                  <span className="weeklijn"></span>
                  <a className="knop klein rand" href={`#/docent/nieuw/${leerling.id}?week=${g.week}&jaar=${g.jaar}`}>+ Opdracht in week {g.week}</a>
                  <ActieKnop actie="d_kopieer_week" data={{ leerling_id: leerling.id, werkweek: g.week, jaar: g.jaar }} na={st.herlaad}>
                    Hele week doorzetten naar week {nw}
                  </ActieKnop>
                </div>
                <div className="opdrachtlijst">
                  {g.items.map((o) => {
                    const delen = [];
                    if (o.vak) delen.push(o.vak);
                    if (o.aantal_bijlagen > 0) delen.push(`${o.aantal_bijlagen} ${mv(o.aantal_bijlagen, "bijlage", "bijlagen")}`);
                    if (o.aantal_opmerkingen > 0) delen.push(`${o.aantal_opmerkingen} ${mv(o.aantal_opmerkingen, "opmerking", "opmerkingen")}`);
                    if (o.afgerond) delen.push("afgerond op " + datumKort(o.afgerond_op));
                    if (o.gekopieerd_van) delen.push("doorgezet uit een eerdere week");
                    return (
                      <OpdrachtRij key={o.id} o={o} href={`#/docent/opdracht/${o.id}`} nieuw={String(q.nieuw) === String(o.id)}>
                        {delen.join(" · ") || " "}
                      </OpdrachtRij>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </>
      );
    }}</Laden>
  );
}

function OpdrachtFormulier({ id, leerlingId, q }) {
  const { melding, nu } = useApp();
  const bewerken = !!id;
  const st = useData("d_formulier", bewerken ? { id } : { leerling_id: leerlingId }, [id, leerlingId]);
  const [bezig, zetBezig] = React.useState(false);

  async function opslaan(e) {
    e.preventDefault();
    const f = formData(e);
    const bestanden = Array.from(e.currentTarget.querySelector('input[type="file"]').files || []);
    zetBezig(true);
    try {
      const r = await api("d_opdracht_opslaan", {
        id: id || undefined, leerling_id: leerlingId, titel: f.titel, vak_id: f.vak_id || 0,
        werkweek: f.werkweek, jaar: f.jaar, omschrijving: f.omschrijving, link: f.link, zichtbaar: f.zichtbaar === "1",
      });
      const meldingen = bestanden.length ? await bestandenUploaden(r.id, bestanden) : [];
      if (bewerken) {
        melding(["Wijzigingen opgeslagen.", ...meldingen].join(" "));
        ga(`docent/opdracht/${r.id}`);
      } else {
        const reeks = await api("d_reeks_afmaken", { id: r.id, tot_week: f.tot_week });
        melding([reeks.melding, ...meldingen].join(" "));
        ga(`docent/leerling/${leerlingId}?nieuw=${r.id}`);
      }
    } catch (er) { melding(er.message, "fout"); zetBezig(false); }
  }

  return (
    <Laden st={st}>{({ opdracht, leerling, bijlagen, vakken }) => {
      const terug = bewerken ? `#/docent/opdracht/${opdracht.id}` : `#/docent/leerling/${leerling.id}`;
      const huidigVak = bewerken ? Number(opdracht.vak_id || 0) : 0;
      return (
        <>
          <a className="terug" href={terug}>&larr; Terug</a>
          <div className="kop"><div>
            <h1>{bewerken ? "Opdracht bewerken" : "Werk aanleveren"}</h1>
            <p className="zacht">Voor {leerling.naam}</p>
          </div></div>
          <form className="kaart formulier" onSubmit={opslaan}>
            <label>Titel van de opdracht
              <input type="text" name="titel" required maxLength={200} placeholder="Bijvoorbeeld: Samenvatting hoofdstuk 3"
                defaultValue={bewerken ? opdracht.titel : ""} />
            </label>
            <div>
              <label>Vak</label>
              {vakken.length === 0 ? (
                <p className="mini">Voor {leerling.naam} zijn nog geen vakken aangevinkt. <a href={`#/docent/leerling/${leerling.id}`}>Vink eerst de vakken aan</a>, of laat het vak leeg.</p>
              ) : (
                <div className="vakkenkiezer" style={{ marginTop: ".35rem" }}>
                  <label className="vakvinkje"><input type="radio" name="vak_id" value="0" defaultChecked={huidigVak === 0} /><span>Geen vak</span></label>
                  {vakken.map((v) => (
                    <label className="vakvinkje" key={v.id}>
                      <input type="radio" name="vak_id" value={v.id} defaultChecked={huidigVak === Number(v.id)} /><span>{v.naam}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="rij">
              <label>Werkweek
                <input type="number" name="werkweek" min="1" max="53" required
                  defaultValue={bewerken ? opdracht.werkweek : (q.week || nu.week)} />
              </label>
              {!bewerken && (
                <label>Tot en met week <span className="zacht">(mag leeg)</span>
                  <input type="number" name="tot_week" min="1" max="53" placeholder="alleen deze week" />
                </label>
              )}
              <label>Jaar
                <input type="number" name="jaar" min="2020" max="2100" required defaultValue={bewerken ? opdracht.jaar : (q.jaar || nu.jaar)} />
              </label>
            </div>
            {!bewerken && (
              <p className="mini">Vul je bij "tot en met week" een latere week in, dan zet ik dezelfde opdracht — met bijlagen — in elke week van die reeks klaar. Maximaal 26 weken; over de jaarwisseling heen loopt hij gewoon door.</p>
            )}
            <label>Wat moet de leerling doen?
              <textarea name="omschrijving" defaultValue={bewerken ? opdracht.omschrijving || "" : ""}
                placeholder="Schrijf in korte, duidelijke stappen op wat de leerling moet doen. Bijvoorbeeld: lees blz. 42 t/m 51, maak daarna opdracht 1 tot en met 4." />
            </label>
            <label>Link <span className="zacht">(mag leeg)</span>
              <input type="text" name="link" placeholder="www.voorbeeld.nl/oefenen" defaultValue={bewerken ? opdracht.link || "" : ""} />
            </label>
            <label>Bestanden toevoegen <span className="zacht">(meerdere tegelijk mag)</span>
              <input type="file" multiple />
            </label>
            <p className="mini">Toegestaan: pdf, word, powerpoint, excel, afbeeldingen, audio en zip. Maximaal {MAX_MB} MB per bestand.</p>

            {bijlagen.length > 0 && (
              <div>
                <h3>Bestanden die al bij deze opdracht staan</h3>
                <div className="bijlagen">
                  {bijlagen.map((b) => (
                    <div className="bijlage" key={b.id}>
                      <span className="type">{icoon(b.originele_naam)}</span>
                      <span className="naam">{b.originele_naam}</span>
                      <span className="mini">{grootte(b.grootte)}</span>
                      <ActieKnop actie="d_bijlage_verwijder" data={{ bijlage_id: b.id }} bevestig="Dit bestand verwijderen?"
                        klasse="knop klein gevaar" na={st.herlaad}>Verwijderen</ActieKnop>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="vinkje">
              <input type="checkbox" name="zichtbaar" value="1" defaultChecked={!bewerken || opdracht.zichtbaar} />
              <span>Meteen zichtbaar maken voor de leerling <span className="zacht">(anders zet de beheerder de opdracht later open)</span></span>
            </label>
            <div className="knoppenrij">
              <button className="knop" type="submit" disabled={bezig}>
                {bezig ? "Bezig met opslaan…" : bewerken ? "Wijzigingen opslaan" : "Opdracht klaarzetten"}
              </button>
              <a className="knop rand" href={terug}>Annuleren</a>
            </div>
          </form>
        </>
      );
    }}</Laden>
  );
}

function Bijlagen({ bijlagen, kop }) {
  const { melding } = useApp();
  if (!bijlagen.length) return null;
  return (
    <>
      <h2>{kop}</h2>
      <div className="bijlagen">
        {bijlagen.map((b) => (
          <a className="bijlage" key={b.id} href="#" onClick={(e) => { e.preventDefault(); bestandOpenen(b.id, melding); }}>
            <span className="type">{icoon(b.originele_naam)}</span>
            <span className="naam">{b.originele_naam}</span>
            <span className="mini">{grootte(b.grootte)}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function DocentOpdracht({ id }) {
  const { melding } = useApp();
  const st = useData("d_opdracht", { id }, [id]);
  async function opmerking(e) {
    e.preventDefault();
    const formulier = e.currentTarget;
    const f = formData(e);
    try { const r = await api("d_opmerking", { opdracht_id: id, tekst: f.tekst, auteur: f.auteur }); melding(r.melding); formulier.reset(); st.herlaad(); }
    catch (er) { melding(er.message, "fout"); }
  }
  return (
    <Laden st={st}>{({ opdracht: o, bijlagen, opmerkingen }) => {
      const [nw, nj] = volgendeWeek(o.werkweek, o.jaar);
      const link = veiligeLink(o.link);
      return (
        <>
          <a className="terug" href={`#/docent/leerling/${o.leerling_id}`}>&larr; {o.leerling_naam}</a>
          <div className="kop">
            <div>
              <h1>{o.titel}</h1>
              <p className="zacht">{weeklabel(o.werkweek, o.jaar)}{o.vak ? ` · ${o.vak}` : ""} · aangeleverd door {o.school_naam} op {datumKort(o.aangemaakt_op)}</p>
            </div>
            <div className="knoppenrij">
              {o.afgerond && <span className="merkje af">✓ Afgerond op {datumKort(o.afgerond_op)}</span>}
              <span className={`merkje ${o.zichtbaar ? "open" : "dicht"}`}>{o.zichtbaar ? "Zichtbaar voor leerling" : "Nog niet zichtbaar"}</span>
              <a className="knop rand" href={`#/docent/bewerk/${o.id}`}>Bewerken</a>
            </div>
          </div>
          <div className="raster-2">
            <div>
              <div className="kaart">
                <h3>Wat de leerling moet doen</h3>
                {String(o.omschrijving || "").trim() ? <div className="tekstblok">{o.omschrijving}</div> : <p className="zacht">Er is nog geen omschrijving ingevuld.</p>}
                {link && <p style={{ marginTop: "1rem" }}><a className="knop klein rand" href={link} target="_blank" rel="noopener noreferrer">Link openen ↗</a></p>}
              </div>
              <Bijlagen bijlagen={bijlagen} kop="Bijlagen" />
              <h2>Opmerkingen bij dit werk</h2>
              <div className="kaart">
                <form className="formulier" onSubmit={opmerking}>
                  <label>Nieuwe opmerking
                    <textarea name="tekst" style={{ minHeight: 90 }} required placeholder="Bijvoorbeeld: eerste twee opdrachten af, rest volgt volgende week." />
                  </label>
                  <label>Je naam <span className="zacht">(mag leeg, dan komt de school erbij te staan)</span>
                    <input type="text" name="auteur" maxLength={120} placeholder="Je naam (optioneel)" />
                  </label>
                  <div><button className="knop klein" type="submit">Opmerking plaatsen</button></div>
                </form>
                {opmerkingen.length ? (
                  <ul className="lijst-plat" style={{ marginTop: "1.2rem" }}>
                    {opmerkingen.map((m) => (
                      <li key={m.id}><strong>{m.auteur}</strong> <span className="mini">· {datumKort(m.aangemaakt_op)}</span><div className="tekstblok">{m.tekst}</div></li>
                    ))}
                  </ul>
                ) : <p className="mini" style={{ marginTop: "1rem" }}>Nog geen opmerkingen. Opmerkingen zijn alleen zichtbaar voor docenten en beheer.</p>}
              </div>
            </div>
            <aside>
              <div className="kaart">
                <h3>Gegevens</h3>
                <ul className="lijst-plat">
                  <li>Leerling: <strong>{o.leerling_naam}</strong></li>
                  <li>Vak: <strong>{o.vak || "—"}</strong></li>
                  <li>Werkweek: <strong>{o.werkweek}</strong> ({o.jaar})</li>
                  <li>Bijlagen: <strong>{bijlagen.length}</strong></li>
                  <li>Status: <strong>{o.afgerond ? "afgerond op " + datumKort(o.afgerond_op) : "nog niet afgerond"}</strong></li>
                  <li>Aangemaakt: {datumKort(o.aangemaakt_op)}</li>
                  {o.gewijzigd_op && <li>Bijgewerkt: {datumKort(o.gewijzigd_op)}</li>}
                  {o.gekopieerd_van && <li className="mini">Doorgezet uit een eerdere week</li>}
                </ul>
              </div>
              <div className="kaart" style={{ marginTop: "1rem" }}>
                <h3>Ook volgende week</h3>
                <p className="mini">Zet dezelfde opdracht, met bijlagen, opnieuw klaar in {weeklabel(nw, nj)}.</p>
                <ActieKnop actie="d_kopieer_opdracht" data={{ opdracht_id: o.id }} na={(r) => ga(`docent/opdracht/${r.id}`)}>
                  Doorzetten naar week {nw}
                </ActieKnop>
              </div>
              <div className="kaart" style={{ marginTop: "1rem" }}>
                <h3>Opdracht verwijderen</h3>
                <p className="mini">De opdracht en de bijlagen worden dan definitief verwijderd.</p>
                <ActieKnop actie="d_verwijder" data={{ opdracht_id: o.id }} klasse="knop klein gevaar"
                  bevestig="Deze opdracht en alle bijlagen definitief verwijderen?" na={(r) => ga(`docent/leerling/${r.leerling_id}`)}>
                  Verwijderen
                </ActieKnop>
              </div>
            </aside>
          </div>
        </>
      );
    }}</Laden>
  );
}

/* ============================================================ leerling */
function LeerlingDashboard() {
  const { gebruiker, nu } = useApp();
  const st = useData("l_dashboard", {}, []);
  return (
    <>
      <div className="kop"><div>
        <h1>Hoi {gebruiker.naam.split(" ")[0]}</h1>
        <p className="zacht">Dit is het werk dat voor je klaarstaat.</p>
      </div></div>
      <Laden st={st}>{({ opdrachten }) => opdrachten.length === 0 ? (
        <div className="leeg"><h3>Er staat nog niets voor je klaar</h3><p>Zodra je docent werk klaarzet, zie je het hier.</p></div>
      ) : perWeek(opdrachten).map((g) => (
        <React.Fragment key={g.jaar + "-" + g.week}>
          <div className="weekkop">
            <span>{weeklabel(g.week, g.jaar)}{g.week === nu.week && g.jaar === nu.jaar ? " — deze week" : ""}</span>
            <span className="weeklijn"></span>
          </div>
          <div className="opdrachtlijst">
            {g.items.map((o) => {
              const delen = [];
              if (o.vak) delen.push(o.vak);
              delen.push("van " + o.school_naam);
              if (o.aantal_bijlagen > 0) delen.push(`${o.aantal_bijlagen} ${mv(o.aantal_bijlagen, "bijlage", "bijlagen")}`);
              return (
                <a key={o.id} className={`opdrachtrij ${o.afgerond ? "af" : "open"}`} href={`#/leerling/opdracht/${o.id}`}>
                  <div className="body"><div className="titel">{o.titel}</div><div className="meta">{delen.join(" · ")}</div></div>
                  <span className={`merkje ${o.afgerond ? "af" : "vak"}`}>{o.afgerond ? "✓ Afgerond" : "Bekijken →"}</span>
                </a>
              );
            })}
          </div>
        </React.Fragment>
      ))}</Laden>
    </>
  );
}

function LeerlingOpdracht({ id }) {
  const st = useData("l_opdracht", { id }, [id]);
  return (
    <>
      <a className="terug" href="#/leerling">&larr; Mijn opdrachten</a>
      <Laden st={st}>{({ opdracht: o, bijlagen }) => {
        const link = veiligeLink(o.link);
        return (
          <>
            <div className="kop"><div>
              <h1>{o.titel}</h1>
              <p className="zacht">{weeklabel(o.werkweek, o.jaar)}{o.vak ? ` · ${o.vak}` : ""} · van {o.school_naam}</p>
            </div></div>
            {o.afgerond && <div className="melding">Deze opdracht staat op afgerond.</div>}
            <div className="kaart">
              <h3>Wat moet je doen?</h3>
              {String(o.omschrijving || "").trim() ? <div className="tekstblok">{o.omschrijving}</div> : <p className="zacht">Je docent heeft hier nog geen uitleg bij gezet.</p>}
              {link && <p style={{ marginTop: "1.2rem" }}><a className="knop groen" href={link} target="_blank" rel="noopener noreferrer">Open de link ↗</a></p>}
            </div>
            <Bijlagen bijlagen={bijlagen} kop="Bestanden bij deze opdracht" />
            <p className="mini" style={{ marginTop: "1.6rem" }}>Je hoeft hier niets in te leveren of af te vinken. Klaar met de opdracht? Laat het je begeleider weten.</p>
          </>
        );
      }}</Laden>
    </>
  );
}

/* ============================================================== beheer */
function BeheerDashboard() {
  const { nu } = useApp();
  const st = useData("a_dashboard", {}, []);
  return (
    <>
      <div className="kop">
        <div><h1>Overzicht</h1><p className="zacht">{weeklabel(nu.week, nu.jaar)}</p></div>
        <a className="knop" href="#/beheer/opdrachten">Opdrachten van deze week</a>
      </div>
      <Laden st={st}>{({ stats, recent, logboek }) => (
        <>
          <div className="statrij">
            <div className="stat"><b>{stats.scholen}</b><span>Scholen</span></div>
            <div className="stat"><b>{stats.vakken}</b><span>Vakken</span></div>
            <div className="stat"><b>{stats.leerlingen}</b><span>Leerlingen</span></div>
            <div className="stat"><b>{stats.opdrachten}</b><span>Opdrachten totaal</span></div>
            <div className={`stat ${stats.wacht > 0 ? "let" : ""}`}><b>{stats.wacht}</b><span>Nog niet opengezet</span></div>
            <div className="stat af"><b>{stats.afgerond}</b><span>Afgerond</span></div>
          </div>
          <div className="raster-2">
            <div>
              <h2>Laatst aangeleverd</h2>
              {recent.length === 0 ? <div className="leeg"><p>Er is nog geen materiaal aangeleverd.</p></div> : (
                <div className="opdrachtlijst">
                  {recent.map((o) => (
                    <div className="opdrachtrij" key={o.id}>
                      <div className="body">
                        <div className="titel">{o.titel}</div>
                        <div className="meta">voor {o.leerling_naam} · {o.school_naam} · {weeklabel(o.werkweek, o.jaar)}</div>
                      </div>
                      <span className={`merkje ${o.afgerond ? "af" : o.zichtbaar ? "open" : "dicht"}`}>{o.afgerond ? "Afgerond" : o.zichtbaar ? "Open" : "Dicht"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <aside>
              <div className="kaart">
                <h3>Laatste activiteit</h3>
                {logboek.length === 0 ? <p className="mini">Nog geen activiteit.</p> : (
                  <ul className="lijst-plat">
                    {logboek.map((l) => (
                      <li key={l.id}>
                        <span className={`rol-label rol-${l.rol}`}>{l.rol}</span> <strong>{l.wie}</strong> {l.actie}
                        <div className="mini">{datumKort(l.aangemaakt_op)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </>
      )}</Laden>
    </>
  );
}

/* Formulier dat een beheeractie verstuurt en daarna herlaadt. */
function ActieFormulier({ actie, extra = {}, na, children, className = "formulier", leegNa = true }) {
  const { melding } = useApp();
  const [bezig, zetBezig] = React.useState(false);
  async function verstuur(e) {
    e.preventDefault();
    const formulier = e.currentTarget;
    zetBezig(true);
    try {
      const r = await api(actie, { ...formData(e), ...extra });
      if (r.melding) melding(r.melding);
      if (leegNa) formulier.reset();
      na && na(r);
    } catch (er) { melding(er.message, "fout"); }
    zetBezig(false);
  }
  return <form className={className} onSubmit={verstuur}><fieldset disabled={bezig} style={{ border: 0, padding: 0, margin: 0, display: "contents" }}>{children}</fieldset></form>;
}

function BeheerScholen() {
  const st = useData("a_scholen", {}, []);
  return (
    <>
      <div className="kop"><div>
        <h1>Scholen en docentcodes</h1>
        <p className="zacht">Eén koppelcode per school. Alle docenten van die school gebruiken dezelfde code.</p>
      </div></div>
      <details className="uitklap">
        <summary>+ School toevoegen</summary>
        <ActieFormulier actie="a_school_actie" extra={{ actie: "nieuw" }} na={st.herlaad}>
          <div className="rij">
            <label>Naam van de school<input type="text" name="naam" required maxLength={150} placeholder="Naam van de school" /></label>
            <label>Plaats<input type="text" name="plaats" maxLength={100} placeholder="Plaats" /></label>
          </div>
          <div><button className="knop" type="submit">School toevoegen</button></div>
        </ActieFormulier>
      </details>
      <Laden st={st}>{({ scholen }) => (
        <div className="tabel-omhulsel"><table className="tabel">
          <thead><tr><th>School</th><th>Docentcode</th><th>Vakken</th><th>Leerlingen</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {scholen.map((s) => (
              <tr key={s.id} className={s.actief ? "" : "uit"}>
                <td><strong>{s.naam}</strong>{s.plaats && <div className="mini">{s.plaats}</div>}</td>
                <td><code className="code">{s.koppelcode}</code></td>
                <td>{s.aantal_vakken}</td>
                <td>{s.aantal_leerlingen}</td>
                <td><span className={`merkje ${s.actief ? "open" : "dicht"}`}>{s.actief ? "Actief" : "Ingetrokken"}</span></td>
                <td><div className="knoppenrij">
                  <ActieKnop actie="a_school_actie" data={{ actie: "nieuwe_code", id: s.id }} na={st.herlaad}
                    bevestig="Nieuwe code aanmaken? De huidige code werkt daarna niet meer.">Nieuwe code</ActieKnop>
                  <ActieKnop actie="a_school_actie" data={{ actie: "wissel", id: s.id }} na={st.herlaad}
                    klasse={`knop klein ${s.actief ? "gevaar" : "rand"}`}>{s.actief ? "Intrekken" : "Weer activeren"}</ActieKnop>
                </div></td>
              </tr>
            ))}
            {scholen.length === 0 && <tr><td colSpan={6} className="zacht">Nog geen scholen toegevoegd.</td></tr>}
          </tbody>
        </table></div>
      )}</Laden>
    </>
  );
}

function BeheerVakken({ q }) {
  const st = useData("a_vakken", { school: q.school || "" }, [q.school]);
  return (
    <Laden st={st}>{({ scholen, schoolId, vakken }) => {
      const huidige = scholen.find((s) => Number(s.id) === Number(schoolId));
      return (
        <>
          <div className="kop">
            <div>
              <h1>Vakken per school</h1>
              <p className="zacht">Docenten kiezen uit deze lijst. Per leerling vinken zij aan welke vakken gelden.</p>
            </div>
            {scholen.length > 1 && (
              <label className="mini">School{" "}
                <select value={schoolId} onChange={(e) => ga(`beheer/vakken?school=${e.target.value}`)}>
                  {scholen.map((s) => <option key={s.id} value={s.id}>{s.naam}</option>)}
                </select>
              </label>
            )}
          </div>
          {scholen.length === 0 ? (
            <div className="leeg"><h3>Nog geen scholen</h3><p>Voeg eerst een school toe.</p><a className="knop" href="#/beheer/scholen">Naar scholen</a></div>
          ) : (
            <>
              <details className="uitklap" open={vakken.length === 0}>
                <summary>+ Vakken toevoegen aan {huidige?.naam}</summary>
                <ActieFormulier actie="a_vak_actie" extra={{ actie: "nieuw", school_id: schoolId }} na={st.herlaad}>
                  <label>Vak of vakken
                    <textarea name="naam" style={{ minHeight: 96 }} required placeholder={"Nederlands, Rekenen, Engels\nof elk vak op een eigen regel"} />
                  </label>
                  <p className="mini">Meerdere tegelijk mag: gescheiden door een komma of elk vak op een eigen regel.</p>
                  <div><button className="knop" type="submit">Toevoegen</button></div>
                </ActieFormulier>
              </details>
              <div className="tabel-omhulsel"><table className="tabel">
                <thead><tr><th>Vak</th><th>Leerlingen</th><th>Opdrachten</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {vakken.map((v) => (
                    <tr key={v.id} className={v.actief ? "" : "uit"}>
                      <td>
                        <ActieFormulier actie="a_vak_actie" extra={{ actie: "hernoem", id: v.id }} na={st.herlaad} className="knoppenrij" leegNa={false}>
                          <input type="text" name="naam" defaultValue={v.naam} maxLength={100} style={{ maxWidth: 220 }} required />
                          <button className="knop klein rand" type="submit">Opslaan</button>
                        </ActieFormulier>
                      </td>
                      <td>{v.aantal_leerlingen}</td>
                      <td>{v.aantal_opdrachten}</td>
                      <td><span className={`merkje ${v.actief ? "open" : "dicht"}`}>{v.actief ? "Actief" : "Uit"}</span></td>
                      <td><ActieKnop actie="a_vak_actie" data={{ actie: "wissel", id: v.id }} na={st.herlaad}
                        klasse={`knop klein ${v.actief ? "gevaar" : "rand"}`}>{v.actief ? "Uitzetten" : "Weer aanzetten"}</ActieKnop></td>
                    </tr>
                  ))}
                  {vakken.length === 0 && <tr><td colSpan={5} className="zacht">Voor deze school staan nog geen vakken klaar.</td></tr>}
                </tbody>
              </table></div>
              <p className="mini" style={{ marginTop: ".8rem" }}>Een vak uitzetten haalt het weg bij nieuwe opdrachten. Opdrachten die er al zijn houden hun vaknaam.</p>
            </>
          )}
        </>
      );
    }}</Laden>
  );
}

function BeheerLeerlingen() {
  const st = useData("a_leerlingen", {}, []);
  return (
    <>
      <div className="kop"><div>
        <h1>Leerlingen en koppelcodes</h1>
        <p className="zacht">Elke leerling heeft een eigen code en logt daarmee in zonder wachtwoord.</p>
      </div></div>
      <Laden st={st}>{({ leerlingen, scholen }) => (
        <>
          <details className="uitklap">
            <summary>+ Leerling toevoegen</summary>
            {scholen.length === 0 ? <p className="mini">Voeg eerst een school toe.</p> : (
              <ActieFormulier actie="a_leerling_actie" extra={{ actie: "nieuw" }} na={st.herlaad}>
                <div className="rij">
                  <label>School<select name="school_id" required>{scholen.map((s) => <option key={s.id} value={s.id}>{s.naam}</option>)}</select></label>
                  <label>Naam leerling<input type="text" name="naam" required maxLength={120} placeholder="Voor- en achternaam" /></label>
                  <label>Geboortejaar <span className="zacht">(mag leeg)</span><input type="number" name="geboortejaar" min="1990" max="2030" placeholder="Bijvoorbeeld 2011" /></label>
                </div>
                <label>Notitie voor docenten <span className="zacht">(mag leeg, zichtbaar bij de leerling)</span>
                  <input type="text" name="notitie" maxLength={255} placeholder="Bijvoorbeeld: werkt in blokken van 15 minuten" />
                </label>
                <div><button className="knop" type="submit">Leerling toevoegen</button></div>
              </ActieFormulier>
            )}
          </details>
          <div className="tabel-omhulsel"><table className="tabel">
            <thead><tr><th>Leerling</th><th>School</th><th>Koppelcode</th><th>Vakken</th><th>Opdrachten</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {leerlingen.map((l) => (
                <tr key={l.id} className={l.actief ? "" : "uit"}>
                  <td><strong>{l.naam}</strong>{l.geboortejaar && <div className="mini">geboortejaar {l.geboortejaar}</div>}</td>
                  <td>{l.school_naam}</td>
                  <td><code className="code">{l.koppelcode}</code></td>
                  <td>{l.aantal_vakken}</td>
                  <td>{l.aantal_opdrachten}</td>
                  <td><span className={`merkje ${l.actief ? "open" : "dicht"}`}>{l.actief ? "Actief" : "Ingetrokken"}</span></td>
                  <td><div className="knoppenrij">
                    <ActieKnop actie="a_leerling_actie" data={{ actie: "nieuwe_code", id: l.id }} na={st.herlaad}
                      bevestig="Nieuwe koppelcode aanmaken? De huidige code werkt daarna niet meer.">Nieuwe code</ActieKnop>
                    <ActieKnop actie="a_leerling_actie" data={{ actie: "wissel", id: l.id }} na={st.herlaad}
                      klasse={`knop klein ${l.actief ? "gevaar" : "rand"}`}>{l.actief ? "Intrekken" : "Weer activeren"}</ActieKnop>
                  </div></td>
                </tr>
              ))}
              {leerlingen.length === 0 && <tr><td colSpan={7} className="zacht">Nog geen leerlingen toegevoegd.</td></tr>}
            </tbody>
          </table></div>
        </>
      )}</Laden>
    </>
  );
}

function BeheerOpdrachten({ q }) {
  const st = useData("a_opdrachten", { week: q.week || "", jaar: q.jaar || "" }, [q.week, q.jaar]);
  return (
    <Laden st={st}>{({ opdrachten, week, jaar }) => {
      const [nw] = volgendeWeek(week, jaar);
      const wd = { werkweek: week, jaar };
      return (
        <>
          <div className="kop">
            <div>
              <h1>Opdrachten openzetten</h1>
              <p className="zacht">Leerlingen zien alleen opdrachten die op <em>open</em> staan.</p>
            </div>
            <form className="knoppenrij" onSubmit={(e) => { e.preventDefault(); const f = formData(e); ga(`beheer/opdrachten?week=${f.week}&jaar=${f.jaar}`); }} key={week + "-" + jaar}>
              <label className="mini">Week <input type="number" name="week" min="1" max="53" defaultValue={week} style={{ width: 90 }} /></label>
              <label className="mini">Jaar <input type="number" name="jaar" min="2020" max="2100" defaultValue={jaar} style={{ width: 110 }} /></label>
              <button className="knop klein rand" type="submit">Tonen</button>
            </form>
          </div>
          {opdrachten.length > 0 && (
            <div className="knoppenrij" style={{ marginBottom: "1.2rem" }}>
              <ActieKnop actie="a_opdracht_actie" data={{ actie: "alles_open", ...wd }} klasse="knop groen" na={st.herlaad}>
                Alle opdrachten van week {week} openzetten
              </ActieKnop>
              <ActieKnop actie="a_opdracht_actie" data={{ actie: "week_kopie", ...wd }} klasse="knop rand"
                bevestig={`Alle opdrachten van deze week ook in week ${nw} klaarzetten?`}
                na={(r) => ga(`beheer/opdrachten?week=${r.week}&jaar=${r.jaar}`)}>
                Hele week doorzetten naar week {nw}
              </ActieKnop>
              <ActieKnop actie="a_opdracht_actie" data={{ actie: "week_afronden", ...wd }} klasse="knop rand"
                bevestig={`Alle opdrachten van week ${week} als afgerond markeren?`} na={st.herlaad}>
                Hele week afronden
              </ActieKnop>
            </div>
          )}
          <div className="tabel-omhulsel"><table className="tabel">
            <thead><tr><th>Opdracht</th><th>Leerling</th><th>School</th><th>Vak</th><th>Bijlagen</th><th>Zichtbaar</th><th>Afgerond</th><th></th></tr></thead>
            <tbody>
              {opdrachten.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.titel}</strong>{o.gekopieerd_van && <div className="mini">doorgezet uit een eerdere week</div>}</td>
                  <td>{o.leerling_naam}</td>
                  <td className="mini">{o.school_naam}</td>
                  <td className="mini">{o.vak || "—"}</td>
                  <td>{o.aantal_bijlagen}</td>
                  <td><span className={`merkje ${o.zichtbaar ? "open" : "dicht"}`}>{o.zichtbaar ? "Open" : "Dicht"}</span></td>
                  <td>{o.afgerond ? <><span className="merkje af">Afgerond</span><div className="mini">{datumKort(o.afgerond_op)}</div></> : <span className="merkje">Nog niet</span>}</td>
                  <td><div className="knoppenrij">
                    <ActieKnop actie="a_opdracht_actie" data={{ actie: "wissel", id: o.id }} na={st.herlaad}
                      klasse={`knop klein ${o.zichtbaar ? "rand" : "groen"}`}>{o.zichtbaar ? "Sluiten" : "Openzetten"}</ActieKnop>
                    <ActieKnop actie="a_opdracht_actie" data={{ actie: "afronden", id: o.id }} na={st.herlaad}
                      klasse={`knop klein ${o.afgerond ? "rand" : "af"}`}>{o.afgerond ? "Terugzetten" : "Afvinken"}</ActieKnop>
                    <ActieKnop actie="a_opdracht_actie" data={{ actie: "verwijder", id: o.id }} na={st.herlaad} klasse="knop klein gevaar"
                      bevestig="Deze opdracht en de bijlagen definitief verwijderen?">Verwijderen</ActieKnop>
                  </div></td>
                </tr>
              ))}
              {opdrachten.length === 0 && <tr><td colSpan={8} className="zacht">Geen opdrachten in week {week} van {jaar}.</td></tr>}
            </tbody>
          </table></div>
        </>
      );
    }}</Laden>
  );
}

function BeheerBeheerders() {
  const st = useData("a_beheerders", {}, []);
  return (
    <>
      <div className="kop"><div>
        <h1>Beheerders</h1>
        <p className="zacht">Alleen mensen met een account op deze lijst kunnen inloggen bij Beheer.</p>
      </div></div>
      <details className="uitklap">
        <summary>+ Collega toevoegen</summary>
        <ActieFormulier actie="a_beheerder_actie" extra={{ actie: "nieuw" }} na={st.herlaad}>
          <div className="rij">
            <label>Naam<input type="text" name="naam" required maxLength={120} placeholder="Voor- en achternaam" /></label>
            <label>E-mailadres<input type="email" name="email" required maxLength={150} placeholder="naam@denieuwekoers.net" /></label>
          </div>
          <label>Tijdelijk wachtwoord (minimaal 10 tekens)
            <input type="text" name="wachtwoord" required minLength={10} autoComplete="new-password" />
          </label>
          <p className="mini">Geef dit wachtwoord persoonlijk door. Je collega kan het daarna zelf wijzigen op deze pagina.</p>
          <div><button className="knop" type="submit">Account aanmaken</button></div>
        </ActieFormulier>
      </details>
      <Laden st={st}>{({ beheerders, mij }) => (
        <div className="tabel-omhulsel"><table className="tabel">
          <thead><tr><th>Naam</th><th>E-mailadres</th><th>Sinds</th><th></th></tr></thead>
          <tbody>
            {beheerders.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.naam}</strong>{b.id === mij && <span className="mini"> (jij)</span>}</td>
                <td>{b.email}</td>
                <td>{datumKort(b.aangemaakt_op)}</td>
                <td>{b.id !== mij && beheerders.length > 1 && (
                  <ActieKnop actie="a_beheerder_actie" data={{ actie: "verwijder", id: b.id }} klasse="knop klein gevaar" na={st.herlaad}
                    bevestig={`Account van ${b.naam} verwijderen? Deze persoon kan daarna niet meer inloggen.`}>Verwijderen</ActieKnop>
                )}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}</Laden>
      <details className="uitklap">
        <summary>Mijn wachtwoord wijzigen</summary>
        <ActieFormulier actie="a_beheerder_actie" extra={{ actie: "wachtwoord" }}>
          <label>Huidig wachtwoord<input type="password" name="huidig" required autoComplete="current-password" /></label>
          <div className="rij">
            <label>Nieuw wachtwoord (minimaal 10 tekens)<input type="password" name="nieuw" required minLength={10} autoComplete="new-password" /></label>
            <label>Herhaal nieuw wachtwoord<input type="password" name="herhaal" required minLength={10} autoComplete="new-password" /></label>
          </div>
          <div><button className="knop" type="submit">Wachtwoord opslaan</button></div>
        </ActieFormulier>
      </details>
    </>
  );
}

/* ================================================================= app */
const MENU = {
  docent: [["docent", "Leerlingen"]],
  leerling: [["leerling", "Mijn opdrachten"]],
  admin: [["beheer", "Overzicht"], ["beheer/scholen", "Scholen"], ["beheer/vakken", "Vakken"], ["beheer/leerlingen", "Leerlingen"],
    ["beheer/opdrachten", "Opdrachten"], ["beheer/beheerders", "Beheerders"]],
};
const START = { docent: "docent", leerling: "leerling", admin: "beheer" };
const ROLNAAM = { docent: "Docent", leerling: "Leerling", admin: "Beheer" };

function App() {
  const [route, zetRoute] = React.useState(leesRoute);
  const [ik, zetIk] = React.useState({ geladen: false, gebruiker: null, nu: { week: isoWeek(new Date())[0], jaar: isoWeek(new Date())[1] } });
  const [flash, zetFlash] = React.useState(null);

  const melding = React.useCallback((tekst, soort = "ok") => { zetFlash({ tekst, soort, t: Date.now() }); window.scrollTo({ top: 0 }); }, []);

  async function laadIk() {
    try {
      const r = geheugenSessie ? await api("ik") : await api("ik").catch(() => ({ gebruiker: null }));
      zetIk({ geladen: true, gebruiker: r.gebruiker || null, nu: { week: r.week ?? ik.nu.week, jaar: r.jaar ?? ik.nu.jaar } });
      return r.gebruiker;
    } catch (e) {
      zetIk((s) => ({ ...s, geladen: true, gebruiker: null }));
      return null;
    }
  }

  React.useEffect(() => {
    laadIk();
    const opHash = () => { zetRoute(leesRoute()); };
    const opUit = () => { zetIk((s) => ({ ...s, gebruiker: null })); melding("Je sessie is verlopen. Log opnieuw in.", "fout"); ga("login"); };
    window.addEventListener("hashchange", opHash);
    window.addEventListener("kompas-uitgelogd", opUit);
    return () => { window.removeEventListener("hashchange", opHash); window.removeEventListener("kompas-uitgelogd", opUit); };
  }, []);

  // Melding verdwijnt bij de volgende paginawissel (maar niet bij de wissel die erbij hoort).
  const vorige = React.useRef(route);
  React.useEffect(() => {
    if (flash && Date.now() - flash.t > 600) zetFlash(null);
    vorige.current = route;
  }, [route]);

  async function naInloggen() {
    const g = await laadIk();
    if (g) ga(START[g.rol]);
  }
  async function uitloggen(e) {
    e.preventDefault();
    await uitloggenOveral();
    zetIk((s) => ({ ...s, gebruiker: null }));
    melding("Je bent uitgelogd.");
    ga("login");
  }

  const g = ik.gebruiker;
  const [eerste, tweede, derde] = route.delen;
  const q = route.q;

  let pagina;
  if (!ik.geladen) pagina = <p className="zacht laad">Even laden…</p>;
  else if (!g) pagina = <Login tab={eerste === "login" ? tweede : "leerling"} />;
  else if (g.rol === "docent") {
    if (eerste !== "docent") pagina = <Doorsturen naar="docent" />;
    else if (tweede === "leerling" && derde) pagina = <DocentLeerling id={Number(derde)} q={q} />;
    else if (tweede === "nieuw" && derde) pagina = <OpdrachtFormulier leerlingId={Number(derde)} q={q} />;
    else if (tweede === "bewerk" && derde) pagina = <OpdrachtFormulier id={Number(derde)} q={q} />;
    else if (tweede === "opdracht" && derde) pagina = <DocentOpdracht id={Number(derde)} />;
    else pagina = <DocentDashboard />;
  } else if (g.rol === "leerling") {
    if (eerste !== "leerling") pagina = <Doorsturen naar="leerling" />;
    else if (tweede === "opdracht" && derde) pagina = <LeerlingOpdracht id={Number(derde)} />;
    else pagina = <LeerlingDashboard />;
  } else if (g.rol === "admin") {
    if (eerste !== "beheer") pagina = <Doorsturen naar="beheer" />;
    else pagina = ({ scholen: <BeheerScholen />, vakken: <BeheerVakken q={q} />, leerlingen: <BeheerLeerlingen />,
      opdrachten: <BeheerOpdrachten q={q} />, beheerders: <BeheerBeheerders /> })[tweede] || <BeheerDashboard />;
  }

  const actiefPad = route.delen.slice(0, 2).join("/");
  return (
    <Ctx.Provider value={{ gebruiker: g, nu: ik.nu, melding, naInloggen }}>
      {g && (
        <header className="balk">
          <a className="merk" href={"#/" + START[g.rol]}>
            <img src="/aanleveren/assets/beeldmerk.png" alt="" width="34" height="34" />
            <span><strong>Het Kompas</strong><small>Aanleverplatform onderwijs</small></span>
          </a>
          <nav className="menu">
            {MENU[g.rol].map(([pad, label]) => (
              <a key={pad} href={"#/" + pad} className={actiefPad === pad || (pad === START[g.rol] && route.delen.length > 1 && !MENU[g.rol].some(([p]) => p === actiefPad)) ? "actief" : ""}>{label}</a>
            ))}
          </nav>
          <div className="wie">
            <span className={`rol-label rol-${g.rol}`}>{ROLNAAM[g.rol]}</span>
            <span className="naam">{g.naam}</span>
            <a className="uit" href="#" onClick={uitloggen}>Uitloggen</a>
          </div>
        </header>
      )}
      <main className={g ? "pagina" : "auth-body"}>
        {flash && <div className={`melding ${flash.soort}`} role="status">{flash.tekst}</div>}
        {pagina}
      </main>
      {g && (
        <footer className="voet">
          <img src="/aanleveren/assets/beeldmerk.png" alt="" width="16" height="16" /> Het Kompas · De Nieuwe Koers
        </footer>
      )}
    </Ctx.Provider>
  );
}

function Doorsturen({ naar }) {
  React.useEffect(() => { ga(naar); }, [naar]);
  return null;
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
