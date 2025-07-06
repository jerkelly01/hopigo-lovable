
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, UserCheck, UserX, Mail, Calendar, MapPin } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_verified: boolean | null;
  is_service_provider: boolean | null;
  created_at: string | null;
  wallet_balance: number | null;
  loyalty_points: number | null;
  address: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleVerification = async (userId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  return (
    <AdminLayout 
      title="User Management" 
      description="Manage all platform users, their verification status, and account details"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Verified Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.is_verified).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Service Providers</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.is_service_provider).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Unverified</CardTitle>
              <UserX className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => !u.is_verified).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Users</CardTitle>
            <CardDescription>Manage user accounts and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.full_name || 'Unnamed User'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {user.address}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right text-sm">
                        <div className="text-gray-600">Balance: AWG {user.wallet_balance || 0}</div>
                        <div className="text-gray-600">Points: {user.loyalty_points || 0}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={user.is_verified ? "default" : "secondary"}>
                          {user.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                        {user.is_service_provider && (
                          <Badge variant="outline">Provider</Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={user.is_verified ? "destructive" : "default"}
                        onClick={() => toggleVerification(user.id, user.is_verified)}
                      >
                        {user.is_verified ? "Unverify" : "Verify"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
