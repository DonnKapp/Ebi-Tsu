import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { SiteShell } from "./components/SiteShell";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));
const Account = lazy(() => import("./pages/Account"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const Contact = lazy(() => import("./pages/Contact"));
const LivestockRequest = lazy(() => import("./pages/LivestockRequest"));
const LineDetail = lazy(() => import("./pages/LineDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderingAvailability = lazy(() => import("./pages/OrderingAvailability"));

const neoImage = "/assets/ebi-tsu-neocaridina.webp";
const caridinaImage = "/assets/ebi-tsu-caridina.webp";

function RouteLoading() {
  return (
    <div className="route-loading page-width" role="status">
      Loading Ebi Tsū…
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousRootBehavior = root.style.scrollBehavior;
    const previousBodyBehavior = body.style.scrollBehavior;

    // The site uses smooth scrolling for in-page anchors. Temporarily opt out
    // while routes change so collection cards never visibly travel upward.
    window.history.scrollRestoration = "manual";
    root.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const restoreFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousRootBehavior;
        body.style.scrollBehavior = previousBodyBehavior;
      });
    });

    return () => window.cancelAnimationFrame(restoreFrame);
  }, [location]);

  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/neocaridina">
          <CollectionPage
            family="Neocaridina"
            image={neoImage}
            number="01"
            title={
              <>
                Color with <em>conviction.</em>
              </>
            }
            intro="The vivid, generous side of the freshwater shrimp world — expressive color, strong presence, and a planted setting that lets both breathe."
            details="A study in color, presence, and the pleasure of a colony finding its rhythm."
          />
        </Route>
        <Route path="/caridina">
          <CollectionPage
            family="Caridina"
            image={caridinaImage}
            number="02"
            title={
              <>
                Detail in <em>the water.</em>
              </>
            }
            intro="A more exacting study of translucency, pattern, and the small shifts in tone that reveal a shrimp’s character."
            details="A study in nuance, pattern, and the calm precision of a well-kept environment."
          />
        </Route>
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/livestock-request" component={LivestockRequest} />
        <Route path="/ordering" component={OrderingAvailability} />
        <Route path="/catalog/:id" component={LineDetail} />
        <Route path="/account" component={Account} />
        <Route path="/admin" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteShell>
        <Router />
      </SiteShell>
    </ErrorBoundary>
  );
}
