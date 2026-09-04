import { createBrowserRouter } from "react-router-dom";
import { Root } from "./components/Root";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import HealthDashboard from "./pages/HealthDashboard";
import MHEDashboard from "./pages/MHEDashboard";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import { Analytics } from "./pages/Analytics";
import { Navigation } from "./pages/Navigation";
import { WorkList } from "./pages/WorkList";
import { PropertyVisibility } from "./pages/PropertyVisibility";
import { Logs } from "./pages/Logs";
import { Replenishment } from "./pages/Replenishment";
import { Pick } from "./pages/Pick";
import { DeWrap } from "./pages/DeWrap";
import { MHEControlPanel } from "./pages/MHEControlPanel";
import { StorageLocations } from "./pages/StorageLocations";
import { Containers } from "./pages/Containers";
import { Items } from "./pages/Items";
import { Projects } from "./pages/Projects";
import { Team } from "./pages/Team";
import { UserManagement } from "./pages/UserManagement";
import { GroupManagement } from "./pages/GroupManagement";
import { ActivityReport } from "./pages/ActivityReport";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext";
import { BookmarkProvider } from "./contexts/BookmarkContext";

// Wrapper component that provides all contexts
function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutProvider>
          <BookmarkProvider>
            {children}
          </BookmarkProvider>
        </LayoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper><Root /></RootWrapper>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "/",
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
          { index: true, Component: Home },
          { path: "*", Component: NotFound },
        ],
      },
      {
        path: "app",
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
          { index: true, Component: Home },
          { path: "home", Component: Home },
          { path: "dashboard", Component: Dashboard },
          { path: "health", Component: HealthDashboard },
          { path: "mhe", Component: MHEDashboard },
          { path: "executive", Component: ExecutiveDashboard },
          { path: "analytics", Component: Analytics },
          { path: "navigation", Component: Navigation },
          { path: "worklist", Component: WorkList },
          { path: "property-visibility", Component: PropertyVisibility },
          { path: "logs", Component: Logs },
          { path: "replenishment", Component: Replenishment },
          { path: "pick", Component: Pick },
          { path: "dewrap", Component: DeWrap },
          { path: "mhe-control-panel", Component: MHEControlPanel },
          { path: "storage-locations", Component: StorageLocations },
          { path: "containers", Component: Containers },
          { path: "items", Component: Items },
          { path: "projects", Component: Projects },
          { path: "team", Component: Team },
          { path: "user-management", Component: UserManagement },
          { path: "group-management", Component: GroupManagement },
          { path: "activity-report", Component: ActivityReport },
          { path: "*", Component: NotFound },
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);