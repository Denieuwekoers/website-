/* App shell — homepage 2.0 + alle subpagina's, met een eigen URL per pagina (bijv. /klachten) */
const App = () => {
  const known = ["home", "kompas", "aanbod", "overons", "contact", "aanmelden", "faq", "werkenbij", "klachten", "privacy", "av"];
  const titles = {
    home: "De Nieuwe Koers | Jeugdhulp voor jongeren van 12 tot 23 in Zoetermeer",
    kompas: "Dagbesteding Het Kompas | De Nieuwe Koers",
    aanbod: "Ons aanbod | De Nieuwe Koers",
    overons: "Over ons | De Nieuwe Koers",
    contact: "Contact | De Nieuwe Koers",
    aanmelden: "Aanmelden | De Nieuwe Koers",
    faq: "Veelgestelde vragen | De Nieuwe Koers",
    werkenbij: "Werken bij | De Nieuwe Koers",
    klachten: "Klacht melden | De Nieuwe Koers",
    privacy: "Privacyverklaring | De Nieuwe Koers",
    av: "Algemene voorwaarden | De Nieuwe Koers",
    "404": "Pagina niet gevonden | De Nieuwe Koers",
  };

  // Map waarin de site staat ("/" op denieuwekoers.net)
  const ROOT = new URL(".", document.baseURI).pathname;

  const slugFromLocation = () => {
    // oude deelbare links (#/kompas) blijven werken
    const h = (window.location.hash || "").replace(/^#\/?/, "").split("?")[0].trim();
    if (h) return known.includes(h) ? h : "404";
    let p = decodeURIComponent(window.location.pathname);
    p = p.startsWith(ROOT) ? p.slice(ROOT.length) : p.replace(/^\//, "");
    p = p.replace(/\/+$/, "");
    if (p === "" || /\.html?$/i.test(p)) return "home";
    return known.includes(p) ? p : "404";
  };

  const urlFor = (p) => ROOT + (p === "home" ? "" : p);

  const [page, setPage] = React.useState(slugFromLocation);
  const [aanbodFocus, setAanbodFocus] = React.useState(null);

  // oude #/-links omzetten naar het nette adres
  React.useEffect(() => {
    if ((window.location.hash || "").startsWith("#/")) {
      const s = slugFromLocation();
      if (s !== "404") window.history.replaceState({}, "", urlFor(s));
    }
  }, []);

  React.useEffect(() => { document.title = titles[page] || titles.home; }, [page]);

  const navigate = (p, focus) => {
    const target = known.includes(p) ? p : "404";
    if (target === "aanbod") setAanbodFocus(focus || null);
    if (target !== page) window.history.pushState({}, "", urlFor(target));
    setPage(target);
    window.scrollTo({ top: 0, behavior: target === page ? "smooth" : "auto" });
  };

  // terug/vooruit in de browser
  React.useEffect(() => {
    const onPop = () => { setPage(slugFromLocation()); window.scrollTo({ top: 0, behavior: "auto" }); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // interne links zonder eigen onClick (bijv. in teksten) via de app laten lopen
  React.useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#$)/.test(href)) return;
      const slug = href.replace(/^\.?\//, "").replace(/^#\/?/, "").replace(/\/+$/, "");
      const p = slug === "" ? "home" : slug;
      if (known.includes(p)) { e.preventDefault(); navigate(p); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });

  const cur = known.includes(page) ? page : "404";
  return (
    <React.Fragment>
      <Header navigate={navigate} page={page} />
      <main>
        {cur === "home" && <Home navigate={navigate} />}
        {cur === "kompas" && <KompasPage navigate={navigate} />}
        {cur === "aanbod" && <AanbodPage navigate={navigate} initialActive={aanbodFocus} />}
        {cur === "overons" && <OverOnsPage navigate={navigate} />}
        {cur === "contact" && <ContactPage navigate={navigate} />}
        {cur === "aanmelden" && <AanmeldPage navigate={navigate} />}
        {cur === "faq" && <FaqPage navigate={navigate} />}
        {cur === "werkenbij" && <WerkenBijPage navigate={navigate} />}
        {cur === "klachten" && <KlachtenPage navigate={navigate} />}
        {cur === "privacy" && <PrivacyPage navigate={navigate} />}
        {cur === "av" && <AVPage navigate={navigate} />}
        {cur === "404" && <NotFoundPage navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </React.Fragment>
  );
};
ReactDOM.createRoot(document.getElementById("app")).render(<App />);
