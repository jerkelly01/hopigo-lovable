
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useRoles } from '@/hooks/useRoles';
import { sanitizeInput, validation } from '@/lib/security';
import { Shield, Plus, Edit, Users, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Role = Tables<'roles'>;

interface UserRole {
  user_id: string;
  user_email: string;
  user_name: string;
  role_name: string;
}

export default function RolesPage() {
  const { isAdmin, loading: rolesLoading, assignRole } = useRoles();
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

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
      // First get all user roles with role info
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles (name)
        `);

      if (userRolesError) throw userRolesError;

      // Then get user info for each user ID
      const userIds = [...new Set(userRolesData?.map(ur => ur.user_id) || [])];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, name')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Combine the data
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

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleName) {
      toast.error('Please select both user and role');
      return;
    }

    try {
      await assignRole(selectedUserId, selectedRoleName);
      toast.success('Role assigned successfully');
      setIsAssignDialogOpen(false);
      setSelectedUserId('');
      setSelectedRoleName('');
      fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'provider':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'driver':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
        {/* Roles Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="h-5 w-5" />
                Available Roles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map((role) => {
                const userCount = userRoles.filter(ur => ur.role_name === role.name).length;
                return (
                  <div
                    key={role.id}
                    className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getRoleColor(role.name)}>
                        {role.name}
                      </Badge>
                      <span className="text-sm text-gray-500">{userCount} users</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {role.description || 'No description'}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Role Assignments */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5" />
                User Role Assignments ({userRoles.length})
              </CardTitle>
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Role to User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="user">Select User</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user..." />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || user.name || 'Unknown'} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="role">Select Role</Label>
                      <Select value={selectedRoleName} onValueChange={setSelectedRoleName}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                              {role.name} - {role.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAssignRole} className="w-full">
                      Assign Role
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userRoles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No role assignments found.</p>
              ) : (
                userRoles.map((assignment, index) => (
                  <div
                    key={`${assignment.user_id}-${assignment.role_name}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">{assignment.user_name}</p>
                        <p className="text-sm text-gray-600">{assignment.user_email}</p>
                      </div>
                    </div>
                    <Badge className={getRoleColor(assignment.role_name)}>
                      {assignment.role_name}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
