/* App shell — homepage 2.0 + Dagbesteding Het Kompas */
const App = () => {
  const [page, setPage] = React.useState("home");
  const [aanbodFocus, setAanbodFocus] = React.useState(null);
  const navigate = (p, focus) => {
    setPage(p);
    if (p === "aanbod") setAanbodFocus(focus || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const known = ["home", "kompas", "aanbod", "overons", "contact", "aanmelden", "faq", "werkenbij", "klachten", "privacy", "av"];
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
