import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Dashboard from './pages/Dashboard';
import InternationalMatch from './pages/InternationalMatch';
import IPLTournament from './pages/IPLTournament';
import BBLTournament from './pages/BBLTournament';
import DomesticTournament from './pages/DomesticTournament';
import LoginScreen from './components/LoginScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import Header from './components/Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Layout component that wraps all authenticated pages
function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // If not authenticated, show login screen immediately — no blocking spinner
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {showProfileSetup && <ProfileSetupModal />}
      <footer className="border-t border-border bg-card py-4 px-6 text-center text-sm text-muted-foreground">
        <p>
          Built with{' '}
          <span className="text-destructive">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'cricket-game')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>{' '}
          &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Child routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const internationalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/international',
  component: InternationalMatch,
});

const iplRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ipl',
  component: IPLTournament,
});

const bblRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bbl',
  component: BBLTournament,
});

const domesticRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/domestic',
  component: DomesticTournament,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  internationalRoute,
  iplRoute,
  bblRoute,
  domesticRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
