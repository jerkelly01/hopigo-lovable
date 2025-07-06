
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Role = Tables<'roles'>;
type User = Tables<'users'>;

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  user: { full_name: string; email: string; name: string } | null;
  role: { name: string; description: string } | null;
}

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchRoles(),
        fetchUsers(),
        fetchUserRoles()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    setRoles(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('full_name');

    if (error) throw error;
    setUsers(data || []);
  };

  const fetchUserRoles = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        user_id,
        role_id,
        users!inner(full_name, email, name),
        roles!inner(name, description)
      `);

    if (error) {
      console.error('Error fetching user roles:', error);
      return;
    }

    const formattedData = data?.map(item => ({
      id: item.id,
      user_id: item.user_id,
      role_id: item.role_id,
      user: Array.isArray(item.users) ? item.users[0] : item.users,
      role: Array.isArray(item.roles) ? item.roles[0] : item.roles
    })) || [];

    setUserRoles(formattedData);
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) return;

    try {
      const { error } = await supabase
        .from('roles')
        .insert([{ name: newRole.name, description: newRole.description }]);

      if (error) throw error;

      setIsCreateRoleOpen(false);
      setNewRole({ name: '', description: '' });
      fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: selectedUser, role_id: selectedRole }]);

      if (error) throw error;

      setIsAssignRoleOpen(false);
      setSelectedUser('');
      setSelectedRole('');
      fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const handleRemoveUserRole = async (userRoleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId);

      if (error) throw error;
      fetchUserRoles();
    } catch (error) {
      console.error('Error removing user role:', error);
    }
  };

  const getRoleStats = () => {
    const stats = roles.map(role => ({
      ...role,
      userCount: userRoles.filter(ur => ur.role?.name === role.name).length
    }));
    return stats;
  };

  const roleStats = getRoleStats();

  return (
    <AdminLayout title="Roles & Permissions" description="Manage user roles and system permissions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{roles.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Role Assignments</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userRoles.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Admin Users</CardTitle>
              <Users className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userRoles.filter(ur => ur.role?.name === 'admin').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Active Roles</CardTitle>
              <Shield className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{roles.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Roles
                </CardTitle>
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          value={newRole.name}
                          onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                          placeholder="Enter role name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea
                          id="roleDescription"
                          value={newRole.description}
                          onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                          placeholder="Enter role description"
                        />
                      </div>
                      <Button onClick={handleCreateRole} className="w-full">
                        Create Role
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleStats.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{role.name}</h4>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{role.userCount} users</Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Role Assignments
                </CardTitle>
                <Dialog open={isAssignRoleOpen} onOpenChange={setIsAssignRoleOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Role to User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="selectUser">Select User</Label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.full_name || user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="selectRole">Select Role</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
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
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userRoles.map((userRole) => (
                  <div key={userRole.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {userRole.user?.full_name || userRole.user?.name}
                      </h4>
                      <p className="text-sm text-gray-600">{userRole.user?.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="capitalize">
                        {userRole.role?.name}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveUserRole(userRole.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Role</th>
                    <th className="text-center p-3">Users</th>
                    <th className="text-center p-3">Services</th>
                    <th className="text-center p-3">Bookings</th>
                    <th className="text-center p-3">Analytics</th>
                    <th className="text-center p-3">Settings</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium capitalize">{role.name}</td>
                      <td className="text-center p-3">
                        {role.name === 'admin' ? '✅' : role.name === 'provider' ? '👀' : '❌'}
                      </td>
                      <td className="text-center p-3">
                        {role.name === 'admin' || role.name === 'provider' ? '✅' : '👀'}
                      </td>
                      <td className="text-center p-3">
                        {role.name === 'admin' ? '✅' : '👀'}
                      </td>
                      <td className="text-center p-3">
                        {role.name === 'admin' ? '✅' : role.name === 'provider' ? '👀' : '❌'}
                      </td>
                      <td className="text-center p-3">
                        {role.name === 'admin' ? '✅' : '❌'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Legend:</strong> ✅ Full Access | 👀 Read Only | ❌ No Access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
