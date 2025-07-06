
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, Search, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

interface VerificationRequest {
  id: string;
  user_id: string;
  type: 'user' | 'provider' | 'driver';
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  user_email?: string;
  business_name?: string;
}

export default function VerificationPage() {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  useEffect(() => {
    const filtered = verificationRequests.filter(request =>
      request.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [verificationRequests, searchTerm]);

  const fetchVerificationRequests = async () => {
    try {
      // Get users pending verification
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, is_verified, created_at')
        .eq('is_verified', false);

      // Get service providers pending verification
      const { data: providers, error: providersError } = await supabase
        .from('service_providers')
        .select('id, user_id, business_name, is_verified, created_at')
        .eq('is_verified', false);

      // Get drivers pending verification
      const { data: drivers, error: driversError } = await supabase
        .from('ride_drivers')
        .select('id, user_id, is_verified, created_at')
        .eq('is_verified', false);

      if (usersError || providersError || driversError) {
        throw new Error('Failed to fetch verification requests');
      }

      const requests: VerificationRequest[] = [
        ...(users || []).map(user => ({
          id: user.id,
          user_id: user.id,
          type: 'user' as const,
          status: 'pending' as const,
          submitted_at: user.created_at || new Date().toISOString(),
          user_email: user.email,
          business_name: user.full_name
        })),
        ...(providers || []).map(provider => ({
          id: provider.id,
          user_id: provider.user_id,
          type: 'provider' as const,
          status: 'pending' as const,
          submitted_at: provider.created_at || new Date().toISOString(),
          business_name: provider.business_name
        })),
        ...(drivers || []).map(driver => ({
          id: driver.id,
          user_id: driver.user_id,
          type: 'driver' as const,
          status: 'pending' as const,
          submitted_at: driver.created_at || new Date().toISOString()
        }))
      ];

      setVerificationRequests(requests);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (request: VerificationRequest, action: 'approve' | 'reject') => {
    try {
      let updateResult;
      
      switch (request.type) {
        case 'user':
          updateResult = await supabase
            .from('users')
            .update({ is_verified: action === 'approve' })
            .eq('id', request.user_id);
          break;
        case 'provider':
          updateResult = await supabase
            .from('service_providers')
            .update({ is_verified: action === 'approve' })
            .eq('id', request.id);
          break;
        case 'driver':
          updateResult = await supabase
            .from('ride_drivers')
            .update({ is_verified: action === 'approve' })
            .eq('id', request.id);
          break;
      }

      if (updateResult?.error) throw updateResult.error;
      
      await fetchVerificationRequests();
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const pendingCount = verificationRequests.filter(r => r.status === 'pending').length;
  const userVerifications = verificationRequests.filter(r => r.type === 'user').length;
  const providerVerifications = verificationRequests.filter(r => r.type === 'provider').length;
  const driverVerifications = verificationRequests.filter(r => r.type === 'driver').length;

  return (
    <AdminLayout title="Verification Management" description="Review and manage user and provider verification requests">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">User Verifications</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userVerifications}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Provider Verifications</CardTitle>
              <Shield className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{providerVerifications}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Driver Verifications</CardTitle>
              <UserCheck className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{driverVerifications}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Verification Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search verification requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading verification requests...</div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No pending verification requests found.
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <div key={`${request.type}-${request.id}`} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.business_name || request.user_email || 'Unknown'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="outline" className="text-xs capitalize">
                                {request.type}
                              </Badge>
                              {request.user_email && (
                                <span>{request.user_email}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">{request.status}</Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerification(request, 'approve')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerification(request, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
