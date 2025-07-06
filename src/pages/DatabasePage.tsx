
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Database, Table, RefreshCw, Download, Upload, AlertCircle } from 'lucide-react';

export default function DatabasePage() {
  const [dbStats, setDbStats] = useState({
    totalTables: 0,
    totalRecords: 0,
    dbSize: '0 MB',
    lastBackup: 'Never'
  });
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableNames = [
    'users', 'service_providers', 'services', 'service_bookings', 
    'ride_drivers', 'ride_bookings', 'payments', 'money_transfers',
    'events', 'event_tickets', 'advertisements', 'loyalty_programs',
    'notifications', 'bills', 'fuel_payments', 'donations',
    'split_bills', 'loyalty_transactions', 'activities', 'locations',
    'service_zones', 'roles', 'user_roles'
  ] as const;

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const tableStats = await Promise.all(
        tableNames.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName as any)
              .select('*', { count: 'exact', head: true });
            
            return {
              name: tableName,
              records: count || 0,
              status: error ? 'error' : 'healthy'
            };
          } catch (err) {
            return {
              name: tableName,
              records: 0,
              status: 'error'
            };
          }
        })
      );

      const totalRecords = tableStats.reduce((sum, table) => sum + table.records, 0);
      
      setTables(tableStats);
      setDbStats({
        totalTables: tableStats.length,
        totalRecords,
        dbSize: `${(totalRecords * 0.001).toFixed(2)} MB`,
        lastBackup: '2024-01-15 14:30:00'
      });
    } catch (error) {
      console.error('Error fetching database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTable = (tableName: string) => {
    console.log(`Exporting table: ${tableName}`);
    // Export logic would go here
  };

  const backupDatabase = () => {
    console.log('Starting database backup...');
    // Backup logic would go here
  };

  return (
    <AdminLayout title="Database Management" description="Monitor database health, performance, and manage data">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Tables</CardTitle>
              <Database className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dbStats.totalTables}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Records</CardTitle>
              <Table className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dbStats.totalRecords.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Database Size</CardTitle>
              <Database className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dbStats.dbSize}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Health Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Healthy</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Database Tables
                </CardTitle>
                <Button onClick={fetchDatabaseStats} size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading database information...</div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tables.map((table, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Table className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{table.name}</h4>
                          <p className="text-sm text-gray-600">{table.records.toLocaleString()} records</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={table.status === 'healthy' ? "default" : "destructive"}>
                          {table.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => exportTable(table.name)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline" onClick={backupDatabase}>
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore Backup
                </Button>
                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Health Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Database Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Backup Created', table: 'All Tables', time: '2 hours ago', status: 'success' },
                { action: 'Table Optimized', table: 'users', time: '5 hours ago', status: 'success' },
                { action: 'Index Rebuilt', table: 'service_bookings', time: '1 day ago', status: 'success' },
                { action: 'Migration Applied', table: 'payments', time: '2 days ago', status: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium">{activity.action}</h4>
                    <p className="text-sm text-gray-600">Table: {activity.table}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'success' ? "default" : "destructive"}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
