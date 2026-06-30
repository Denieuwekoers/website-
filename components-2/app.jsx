/* App shell — homepage 2.0 + alle subpagina's, met deelbare URL per pagina */
const App = () => {
  // pagina <-> URL-slug (hash routing, werkt op statische hosting zoals Vercel)
  const known = ["home", "kompas", "aanbod", "overons", "contact", "aanmelden", "faq", "werkenbij", "klachten", "privacy", "av"];

  const readHash = () => {
    const h = (window.location.hash || "").replace(/^#\/?/, "").split("?")[0].trim();
    return known.includes(h) ? h : (h === "" ? "home" : "404");
  };

  const [page, setPage] = React.useState(readHash);
  const [aanbodFocus, setAanbodFocus] = React.useState(null);

  // luister naar terug/vooruit + gedeelde links
  React.useEffect(() => {
    const onHash = () => { setPage(readHash()); window.scrollTo({ top: 0, behavior: "auto" }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (p, focus) => {
    if (p === "aanbod") setAanbodFocus(focus || null);
    const target = "#/" + (p === "home" ? "" : p);
    if (window.location.hash !== target && !(p === "home" && (window.location.hash === "" || window.location.hash === "#"))) {
      window.location.hash = target; // triggert hashchange -> setPage + scroll
    } else {
      setPage(known.includes(p) ? p : "404");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
