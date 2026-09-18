import { useLayoutEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { SiteShell } from "./components/SiteShell";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import CollectionPage from "./pages/CollectionPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const neoImage = "/assets/ebi-tsu-neocaridina.png";
const caridinaImage = "/assets/ebi-tsu-caridina.png";

function Router() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/neocaridina"><CollectionPage family="Neocaridina" image={neoImage} number="01" title={<>Color with <em>conviction.</em></>} intro="The vivid, generous side of the freshwater shrimp world — expressive color, strong presence, and a planted setting that lets both breathe." details="A study in color, presence, and the pleasure of a colony finding its rhythm." /></Route>
      <Route path="/caridina"><CollectionPage family="Caridina" image={caridinaImage} number="02" title={<>Detail in <em>the water.</em></>} intro="A more exacting study of translucency, pattern, and the small shifts in tone that reveal a shrimp’s character." details="A study in nuance, pattern, and the calm precision of a well-kept environment." /></Route>
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return <ErrorBoundary><SiteShell><Router /></SiteShell></ErrorBoundary>;
}
