import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import WatchLive from "@/pages/WatchLive";
import Programs from "@/pages/Programs";
import Newsroom from "@/pages/Newsroom";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Media from "@/pages/Media";
import Donate from "@/pages/Donate";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import NewsArticle from "@/pages/NewsArticle";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import SitemapPage from "@/pages/SitemapPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/watch-live" component={WatchLive} />
            <Route path="/programs" component={Programs} />
            <Route path="/newsroom" component={Newsroom} />
            <Route path="/news/:id" component={NewsArticle} />
            <Route path="/about" component={About} />
            <Route path="/events" component={Events} />
            <Route path="/media" component={Media} />
            <Route path="/donate" component={Donate} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy-policy" component={PrivacyPolicyPage} />
            <Route path="/terms-of-service" component={TermsOfServicePage} />
            <Route path="/sitemap" component={SitemapPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="oroma-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
