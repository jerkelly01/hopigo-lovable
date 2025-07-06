
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Search, Plus, Edit, Users, Settings } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Role = Tables<'roles'>;

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRoles(filtered);
  }, [roles, searchTerm]);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const rolePermissions = {
    admin: ['All Permissions', 'User Management', 'System Settings', 'Reports', 'Emergency Controls'],
    moderator: ['Content Moderation', 'User Support', 'Basic Reports', 'Service Management'],
    support: ['User Support', 'Ticket Management', 'Basic Analytics'],
    user: ['Profile Management', 'Service Booking', 'Payment Processing']
  };

  return (
    <AdminLayout title="Roles & Permissions" description="Manage user roles and access permissions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-indigo-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{roles.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Roles</CardTitle>
              <Settings className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{roles.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Permissions</CardTitle>
              <Shield className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Assigned Users</CardTitle>
              <Users className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Roles ({filteredRoles.length})
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading roles...</div>
                ) : (
                  <div className="space-y-3">
                    {filteredRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 capitalize">{role.name}</h3>
                            {role.description && (
                              <p className="text-sm text-gray-600">{role.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              Created {role.created_at ? new Date(role.created_at).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">{role.name}</Badge>
                          <Button size="sm" variant="outline">
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

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(rolePermissions).map(([roleName, permissions]) => (
                  <div key={roleName} className="p-4 rounded-lg border bg-gray-50">
                    <h4 className="font-medium text-gray-900 capitalize mb-2">{roleName}</h4>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
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
                    <th className="text-left p-2">Feature</th>
                    <th className="text-center p-2">Admin</th>
                    <th className="text-center p-2">Moderator</th>
                    <th className="text-center p-2">Support</th>
                    <th className="text-center p-2">User</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'User Management',
                    'Service Management',
                    'Payment Processing',
                    'Reports & Analytics',
                    'System Settings',
                    'Emergency Controls',
                    'Content Moderation',
                    'Support Tickets'
                  ].map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{feature}</td>
                      <td className="text-center p-2">
                        <Badge variant="default" className="text-xs">Full</Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant={['User Management', 'System Settings', 'Emergency Controls'].includes(feature) ? 'secondary' : 'default'} className="text-xs">
                          {['User Management', 'System Settings', 'Emergency Controls'].includes(feature) ? 'Limited' : 'Full'}
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant={['Support Tickets', 'Content Moderation'].includes(feature) ? 'default' : 'secondary'} className="text-xs">
                          {['Support Tickets', 'Content Moderation'].includes(feature) ? 'Full' : 'None'}
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="secondary" className="text-xs">None</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
