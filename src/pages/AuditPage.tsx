import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useRoles } from '@/hooks/useRoles';
import { AdminGuard } from '@/components/AdminGuard';
import { FileText, Search, Shield, AlertTriangle, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.table_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [auditLogs, searchTerm, actionFilter]);

  const fetchAuditLogs = async () => {
    try {
      // Fetch audit logs
      const { data: logsData, error: logsError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Get unique user IDs
      const userIds = [...new Set(logsData?.map(log => log.user_id).filter(Boolean) || [])];
      
      // Fetch user information
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, name')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Combine data with proper type casting
      const enrichedLogs: AuditLog[] = logsData?.map(log => {
        const user = usersData?.find(u => u.id === log.user_id);
        return {
          id: log.id,
          user_id: log.user_id,
          action: log.action,
          table_name: log.table_name,
          record_id: log.record_id,
          old_values: log.old_values,
          new_values: log.new_values,
          ip_address: log.ip_address ? String(log.ip_address) : null,
          user_agent: log.user_agent,
          created_at: log.created_at || new Date().toISOString(),
          user_email: user?.email,
          user_name: user?.full_name || user?.name
        };
      }) || [];

      setAuditLogs(enrichedLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'assign_role':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'update_user':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delete_user':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatJsonValues = (values: any) => {
    if (!values) return 'N/A';
    try {
      return JSON.stringify(values, null, 2);
    } catch {
      return 'Invalid JSON';
    }
  };

  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  return (
    <AdminGuard>
      <AdminLayout 
        title="Security Audit Log" 
        description="Monitor administrative actions and security events"
      >
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Logs</CardTitle>
                <FileText className="h-4 w-4 text-blue-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{auditLogs.length}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Recent Actions</CardTitle>
                <Clock className="h-4 w-4 text-purple-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {auditLogs.filter(log => 
                    new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <p className="text-xs text-purple-100">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Active Admins</CardTitle>
                <User className="h-4 w-4 text-green-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {new Set(auditLogs.map(log => log.user_id)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="h-5 w-5" />
                Audit Log Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log List */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5" />
                Audit Events ({filteredLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading audit logs...</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No audit logs found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getActionColor(log.action)}>
                              {log.action.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {log.table_name && `on ${log.table_name}`}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">User:</span>{' '}
                              {log.user_name || 'Unknown'} ({log.user_email || 'No email'})
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Date:</span>{' '}
                              {formatDate(log.created_at)}
                            </p>
                            {log.record_id && (
                              <p className="text-sm">
                                <span className="font-medium">Record ID:</span>{' '}
                                {log.record_id}
                              </p>
                            )}
                            {log.new_values && (
                              <details className="mt-2">
                                <summary className="text-sm font-medium cursor-pointer text-blue-600">
                                  View Changes
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                  {formatJsonValues(log.new_values)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}