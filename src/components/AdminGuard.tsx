import { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRoles } from '@/hooks/useRoles';
import { useAuthContext } from '@/components/AuthProvider';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string;
}

export function AdminGuard({ 
  children, 
  fallback, 
  requiredRole = 'admin' 
}: AdminGuardProps) {
  const { user, loading: authLoading } = useAuthContext();
  const { isAdmin, hasRole, loading: rolesLoading } = useRoles();

  // Show loading state
  if (authLoading || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You must be signed in to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Check specific role requirement
  const hasRequiredRole = requiredRole === 'admin' ? isAdmin : hasRole(requiredRole);

  if (!hasRequiredRole) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You don't have the required permissions to access this page.
              {requiredRole && ` Required role: ${requiredRole}`}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}