import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/app/not-found';
import Dashboard from '@/modules/dashboard/Dashboard';
import Environmental from '@/modules/environmental/Environmental';
import Social from '@/modules/social/Social';
import Governance from '@/modules/governance/Governance';
import Gamification from '@/modules/gamification/Gamification';
import Reports from '@/modules/reports/Reports';
import Settings from '@/modules/settings/Settings';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/environmental" component={Environmental} />
      <Route path="/social" component={Social} />
      <Route path="/governance" component={Governance} />
      <Route path="/gamification" component={Gamification} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
