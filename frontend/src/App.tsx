import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LoginScreen from './components/LoginScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import InternationalMatch from './pages/InternationalMatch';
import IPLTournament from './pages/IPLTournament';
import BBLTournament from './pages/BBLTournament';
import DomesticTournament from './pages/DomesticTournament';

// Layout component that wraps all authenticated pages
function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Auth guard wrapper
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <img src="/assets/generated/cricket-ball-icon.dim_128x128.png" alt="Loading" className="w-16 h-16 mx-auto animate-spin" />
          <p className="font-heading text-muted-foreground">Loading Cricket Premier...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <>
      {showProfileSetup && <ProfileSetupModal open={showProfileSetup} />}
      {children}
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <AppLayout />
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
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
  indexRoute,
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
  return <RouterProvider router={router} />;
}
