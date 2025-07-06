
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useRoles } from '@/hooks/useRoles';
import { sanitizeInput, validation, authorize, rateLimiter } from '@/lib/security';
import { Users, Search, Plus, Edit, Shield, DollarSign, Star, Activity, AlertTriangle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type User = Tables<'users'>;
type Role = Tables<'roles'>;

interface UserWithRoles extends User {
  roles?: { name: string; description: string }[];
}

export default function UsersPage() {
  const { isAdmin, loading: rolesLoading, hasRole } = useRoles();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchRoles();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Sanitize search term to prevent XSS
    const cleanSearchTerm = sanitizeInput.text(searchTerm);
    
    let filtered = users.filter(user =>
      user.full_name?.toLowerCase().includes(cleanSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(cleanSearchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(cleanSearchTerm.toLowerCase())
    );

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => 
        user.roles?.some(role => role.name === filterRole)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole]);

  const fetchUsers = async () => {
    if (!isAdmin) {
      toast.error('Unauthorized access');
      return;
    }

    try {
      // Rate limit user fetching
      if (!rateLimiter.isAllowed('fetch_users', 10, 60000)) {
        toast.error('Too many requests. Please wait before trying again.');
        return;
      }

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch roles for each user using the secure function
      const usersWithRoles = await Promise.all(
        (usersData || []).map(async (user) => {
          try {
            const { data: userRoles, error } = await supabase.rpc('get_user_roles', {
              target_user_id: user.id
            });

            if (error) {
              console.warn(`Could not fetch roles for user ${user.id}:`, error);
              return { ...user, roles: [] };
            }

            return {
              ...user,
              roles: userRoles?.map(role => ({ 
                name: role.role_name, 
                description: role.role_description 
              })) || []
            };
          } catch (err) {
            console.warn(`Error fetching roles for user ${user.id}:`, err);
            return { ...user, roles: [] };
          }
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRolesList(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const handleEditUser = (user: UserWithRoles) => {
    if (!isAdmin) {
      toast.error('Unauthorized action');
      return;
    }
    setEditingUser(user);
    setValidationErrors({});
    setIsEditDialogOpen(true);
  };

  const validateUserData = (user: UserWithRoles): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (user.full_name) {
      const nameError = validation.user.fullName(user.full_name);
      if (nameError) errors.full_name = nameError;
    }

    if (user.user_type) {
      const typeError = validation.user.userType(user.user_type);
      if (typeError) errors.user_type = typeError;
    }

    return errors;
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !isAdmin) {
      toast.error('Unauthorized action');
      return;
    }

    // Rate limit updates
    if (!rateLimiter.isAllowed(`update_user_${editingUser.id}`, 5, 60000)) {
      toast.error('Too many update attempts. Please wait before trying again.');
      return;
    }

    // Validate input
    const errors = validateUserData(editingUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsUpdating(true);
    setValidationErrors({});

    try {
      // Sanitize inputs
      const sanitizedData = {
        full_name: editingUser.full_name ? sanitizeInput.name(editingUser.full_name) : null,
        name: editingUser.name ? sanitizeInput.name(editingUser.name) : null,
        is_verified: editingUser.is_verified,
        is_active: editingUser.is_active,
        user_type: editingUser.user_type
      };

      // Use the secure function for updating
      const { error } = await supabase.rpc('safe_update_user', {
        target_user_id: editingUser.id,
        full_name_param: sanitizedData.full_name,
        name_param: sanitizedData.name,
        is_verified_param: sanitizedData.is_verified,
        is_active_param: sanitizedData.is_active,
        user_type_param: sanitizedData.user_type
      });

      if (error) throw error;

      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast.success('User updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.is_verified).length;
  const activeUsers = users.filter(u => u.is_active).length;
  const totalWalletBalance = users.reduce((sum, user) => sum + Number(user.wallet_balance || 0), 0);

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
      <AdminLayout title="Users Management" description="Loading...">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users Management" description="Manage platform users, roles, and permissions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Verified Users</CardTitle>
              <Shield className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{verifiedUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Wallet Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">AWG {totalWalletBalance.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users ({filteredUsers.length})
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                 <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {rolesList.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {user.full_name?.charAt(0) || user.name?.charAt(0) || user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.full_name || user.name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>Type: {user.user_type}</span>
                            <span>•</span>
                            <span>Balance: AWG {Number(user.wallet_balance || 0).toLocaleString()}</span>
                            <span>•</span>
                            <span>Points: {user.loyalty_points || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role) => (
                            <Badge key={role.name} variant="secondary" className="text-xs">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                        <Badge variant={user.is_verified ? "default" : "secondary"}>
                          {user.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={user.is_active ? "default" : "destructive"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={editingUser.full_name || ''}
                    onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                    className={validationErrors.full_name ? 'border-red-500' : ''}
                  />
                  {validationErrors.full_name && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.full_name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <Select 
                    value={editingUser.user_type || 'customer'} 
                    onValueChange={(value) => setEditingUser({...editingUser, user_type: value})}
                  >
                    <SelectTrigger className={validationErrors.user_type ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.user_type && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.user_type}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={editingUser.is_verified || false}
                    onCheckedChange={(checked) => setEditingUser({...editingUser, is_verified: checked})}
                  />
                  <Label htmlFor="verified">Verified</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={editingUser.is_active || false}
                    onCheckedChange={(checked) => setEditingUser({...editingUser, is_active: checked})}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button 
                  onClick={handleUpdateUser} 
                  className="w-full"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
