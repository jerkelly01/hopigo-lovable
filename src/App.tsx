
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuthContext } from '@/components/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/hooks/useTheme';
import AuthPage from '@/pages/Auth';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import EmailVerificationPage from '@/pages/EmailVerificationPage';
import AdminDashboard from '@/pages/AdminDashboard';
import UsersPage from '@/pages/UsersPage';
import ProvidersPage from '@/pages/ProvidersPageStub';
import DriversPage from '@/pages/DriversPage';
import BookingsPage from '@/pages/BookingsPage';
import RideBookingsPage from '@/pages/RideBookingsPage';
import PaymentsPage from '@/pages/PaymentsPage';
import TransfersPage from '@/pages/TransfersPage';
import ServicesPage from '@/pages/ServicesPage';
import EventsPage from '@/pages/EventsPageStub';
import AdvertisementsPage from '@/pages/AdvertisementsPage';
import LoyaltyPage from '@/pages/LoyaltyPageStub';
import AnalyticsPage from '@/pages/AnalyticsPageStub';
import NotificationsPage from '@/pages/NotificationsPage';
import VerificationPage from '@/pages/VerificationPage';
import ReportsPage from '@/pages/ReportsPage';
import EmergencyPage from '@/pages/EmergencyPage';
import SettingsPage from '@/pages/SettingsPage';
import RolesPage from '@/pages/RolesPage';
import DatabasePage from '@/pages/DatabasePage';
import LocationsPage from '@/pages/LocationsPage';
import FilesPage from '@/pages/FilesPage';
import EmailTemplatesPage from '@/pages/EmailTemplatesPage';
import SystemHealthPage from '@/pages/SystemHealthPage';
import BackupRecoveryPage from '@/pages/BackupRecoveryPage';
import ApiDocsPage from '@/pages/ApiDocsPage';
import DashboardBuilderPage from '@/pages/DashboardBuilderPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import DashboardConnectionPage from '@/pages/DashboardConnectionPage';
import AuditPage from '@/pages/AuditPage';
import { AgentDashboard } from '@/pages/AgentDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if no user
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="hopigo-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/providers" 
              element={
                <ProtectedRoute>
                  <ProvidersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/drivers" 
              element={
                <ProtectedRoute>
                  <DriversPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ride-bookings" 
              element={
                <ProtectedRoute>
                  <RideBookingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transfers" 
              element={
                <ProtectedRoute>
                  <TransfersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ads" 
              element={
                <ProtectedRoute>
                  <AdvertisementsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loyalty" 
              element={
                <ProtectedRoute>
                  <LoyaltyPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/verification" 
              element={
                <ProtectedRoute>
                  <VerificationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/emergency" 
              element={
                <ProtectedRoute>
                  <EmergencyPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roles" 
              element={
                <ProtectedRoute>
                  <RolesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/database" 
              element={
                <ProtectedRoute>
                  <DatabasePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/locations" 
              element={
                <ProtectedRoute>
                  <LocationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/files" 
              element={
                <ProtectedRoute>
                  <FilesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/email-templates" 
              element={
                <ProtectedRoute>
                  <EmailTemplatesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/system-health" 
              element={
                <ProtectedRoute>
                  <SystemHealthPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/backup-recovery" 
              element={
                <ProtectedRoute>
                  <BackupRecoveryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/api-docs" 
              element={
                <ProtectedRoute>
                  <ApiDocsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard-builder" 
              element={
                <ProtectedRoute>
                  <DashboardBuilderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/integrations" 
              element={
                <ProtectedRoute>
                  <IntegrationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard-connection" 
              element={
                <ProtectedRoute>
                  <DashboardConnectionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute>
                  <AuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent-dashboard" 
              element={
                <ProtectedRoute>
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
