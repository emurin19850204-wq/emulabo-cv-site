import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import BlogVideoManager from "./pages/BlogVideoManager";
import Blog from "./pages/Blog";
import Videos from "./pages/Videos";
import ContentPage from "./pages/ContentPage";
import Home from "./pages/Home";
import SitePagesManager from "./pages/SitePagesManager";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin/pages"} component={SitePagesManager} />
      <Route path={"/admin/blog"} component={() => <BlogVideoManager mode="blog" />} />
      <Route path={"/admin/videos"} component={() => <BlogVideoManager mode="video" />} />
      <Route path={"/blog"} component={() => <Blog />} />
      <Route path={"/blog/:slug"} component={({ params }) => <Blog slug={params.slug} />} />
      <Route path={"/videos"} component={() => <Videos />} />
      <Route path={"/videos/:slug"} component={({ params }) => <Videos slug={params.slug} />} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/:slug"} component={ContentPage} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
