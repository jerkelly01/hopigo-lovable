
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuthContext } from '@/components/AuthProvider';
import AuthPage from '@/pages/Auth';
import AdminDashboard from '@/pages/AdminDashboard';
import UsersPage from '@/pages/UsersPage';
import ProvidersPage from '@/pages/ProvidersPage';
import DriversPage from '@/pages/DriversPage';
import BookingsPage from '@/pages/BookingsPage';
import RideBookingsPage from '@/pages/RideBookingsPage';
import PaymentsPage from '@/pages/PaymentsPage';
import TransfersPage from '@/pages/TransfersPage';
import ServicesPage from '@/pages/ServicesPage';
import EventsPage from '@/pages/EventsPage';
import AdvertisementsPage from '@/pages/AdvertisementsPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import VerificationPage from '@/pages/VerificationPage';
import ReportsPage from '@/pages/ReportsPage';
import EmergencyPage from '@/pages/EmergencyPage';
import SettingsPage from '@/pages/SettingsPage';
import RolesPage from '@/pages/RolesPage';
import DatabasePage from '@/pages/DatabasePage';
import LocationsPage from '@/pages/LocationsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Allow access without authentication for preview purposes
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
