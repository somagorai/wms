import { createHashRouter } from "react-router-dom";
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
import { DeLayer } from "./pages/DeLayer";
import { MHEControlPanel } from "./pages/MHEControlPanel";
import { AssetOperations } from "./pages/AssetOperations";
import { MPCOperations } from "./pages/MPCOperations";
import { StorageLocations } from "./pages/StorageLocations";
import { Containers } from "./pages/Containers";
import { Items } from "./pages/Items";
import { Projects } from "./pages/Projects";
import { Team } from "./pages/Team";
import { UserManagement } from "./pages/UserManagement";
import { GroupManagement } from "./pages/GroupManagement";
import { LaneManagement } from "./pages/LaneManagement";
import { CycleCount } from "./pages/CycleCount";
import { Inspection } from "./pages/Inspection";
import { SystemParameters } from "./pages/SystemParameters";
import { UserWorkstationActivity } from "./pages/UserWorkstationActivity";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VersionThemeProvider } from "./contexts/VersionThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext";
import { BookmarkProvider } from "./contexts/BookmarkContext";
import { WorkstationGuard } from "./components/WorkstationGuard";

// Wrapper component that provides all contexts
function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <VersionThemeProvider>
        <ThemeProvider>
          <LayoutProvider>
            <BookmarkProvider>
              {children}
            </BookmarkProvider>
          </LayoutProvider>
        </ThemeProvider>
      </VersionThemeProvider>
    </AuthProvider>
  );
}

export const router = createHashRouter([
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
          { path: "lane-management", Component: LaneManagement },
          { path: "user-workstation-activity", Component: UserWorkstationActivity },
          { path: "navigation", Component: Navigation },
          { path: "worklist", Component: WorkList },
          { path: "property-visibility", Component: PropertyVisibility },
          { path: "logs", Component: Logs },
          { path: "replenishment", element: <WorkstationGuard><Replenishment /></WorkstationGuard> },
          { path: "pick", element: <WorkstationGuard><Pick /></WorkstationGuard> },
          { path: "cycle-count", element: <WorkstationGuard><CycleCount /></WorkstationGuard> },
          { path: "inspection", element: <WorkstationGuard><Inspection /></WorkstationGuard> },
          { path: "system-parameters", Component: SystemParameters },
          { path: "dewrap", element: <WorkstationGuard><DeWrap /></WorkstationGuard> },
          { path: "delayer", element: <WorkstationGuard><DeLayer /></WorkstationGuard> },
          { path: "mhe-control-panel", element: <WorkstationGuard><MHEControlPanel /></WorkstationGuard> },
          { path: "asset-operations", element: <WorkstationGuard><AssetOperations /></WorkstationGuard> },
          { path: "mpc-operations", element: <WorkstationGuard><MPCOperations /></WorkstationGuard> },
          { path: "storage-locations", Component: StorageLocations },
          { path: "containers", Component: Containers },
          { path: "items", Component: Items },
          { path: "projects", Component: Projects },
          { path: "team", Component: Team },
          { path: "user-management", Component: UserManagement },
          { path: "group-management", Component: GroupManagement },
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