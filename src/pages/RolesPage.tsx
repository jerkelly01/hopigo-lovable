
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useRoles } from '@/hooks/useRoles';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

// Components
import { RoleStatsCards } from '@/components/roles/RoleStatsCards';
import { RolesList } from '@/components/roles/RolesList';
import { UserRoleAssignments } from '@/components/roles/UserRoleAssignments';
import { RoleAssignmentDialog } from '@/components/roles/RoleAssignmentDialog';
import { CreateRoleDialog } from '@/components/roles/CreateRoleDialog';

type Role = Tables<'roles'>;

interface UserSummary {
  id: string;
  email: string;
  full_name: string | null;
  name: string | null;
}

interface UserRole {
  user_id: string;
  user_email: string;
  user_name: string;
  role_name: string;
}

interface RoleWithStats extends Role {
  userCount: number;
}

export default function RolesPage() {
  const { isAdmin, loading: rolesLoading, assignRole } = useRoles();
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    await Promise.all([
      fetchRoles(),
      fetchUsers(),
      fetchUserRoles()
    ]);
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, name')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles (name)
        `);

      if (userRolesError) throw userRolesError;

      const userIds = [...new Set(userRolesData?.map(ur => ur.user_id) || [])];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, name')
        .in('id', userIds);

      if (usersError) throw usersError;

      const formattedData = userRolesData?.map(item => {
        const user = usersData?.find(u => u.id === item.user_id);
        return {
          user_id: item.user_id,
          user_email: user?.email || '',
          user_name: user?.full_name || user?.name || 'Unknown',
          role_name: item.roles?.name || ''
        };
      }) || [];

      setUserRoles(formattedData);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Failed to fetch user roles');
    }
  };

  const handleAssignRole = async (userId: string, roleName: string) => {
    try {
      await assignRole(userId, roleName);
      toast.success('Role assigned successfully');
      await fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
      throw error;
    }
  };

  const handleCreateRole = async (name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('roles')
        .insert([{ name, description }]);

      if (error) throw error;
      
      toast.success('Role created successfully');
      await fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
      throw error;
    }
  };

  const handleRemoveRole = async (userId: string, roleName: string) => {
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single();

      if (roleError) throw roleError;

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleData.id);

      if (error) throw error;
      
      toast.success('Role removed successfully');
      await fetchUserRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  };

  // Get roles with user count stats
  const rolesWithStats: RoleWithStats[] = roles.map(role => ({
    ...role,
    userCount: userRoles.filter(ur => ur.role_name === role.name).length
  }));

  // Authorization check
  if (!rolesLoading && !isAdmin) {
    return (
      <AdminLayout title="Access Denied" description="You don't have permission to access this page">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have administrative privileges to access this page.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  if (rolesLoading || loading) {
    return (
      <AdminLayout title="Roles & Permissions" description="Loading...">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Roles & Permissions" 
      description="Manage user roles and permissions"
    >
      <div className="space-y-6">
        <RoleStatsCards 
          totalRoles={roles.length}
          totalAssignments={userRoles.length}
          userRoles={userRoles}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RolesList 
            roles={rolesWithStats}
            onCreateRole={() => setIsCreateRoleDialogOpen(true)}
          />
          
          <UserRoleAssignments 
            userRoles={userRoles}
            onAssignRole={() => setIsAssignDialogOpen(true)}
            onRemoveRole={handleRemoveRole}
          />
        </div>

        <RoleAssignmentDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          users={users}
          roles={roles}
          onAssign={handleAssignRole}
        />

        <CreateRoleDialog
          open={isCreateRoleDialogOpen}
          onOpenChange={setIsCreateRoleDialogOpen}
          onCreateRole={handleCreateRole}
        />
      </div>
    </AdminLayout>
  );
}
