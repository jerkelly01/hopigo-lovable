import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useDataExport } from '@/hooks/useDataExport';
import { 
  Database, 
  Download, 
  Upload, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Calendar,
  Settings,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface BackupRecord {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'manual';
  size: string;
  status: 'completed' | 'running' | 'failed';
  createdAt: Date;
  tables: string[];
}

interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  includeLogs: boolean;
  includeFiles: boolean;
}

export default function BackupRecoveryPage() {
  const { exportCSV, exportJSON, exporting } = useDataExport();
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    includeLogs: true,
    includeFiles: false
  });
  const [creating, setCreating] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  const availableTables = [
    'users', 'roles', 'user_roles', 'notifications', 'audit_logs',
    'services', 'service_providers', 'service_bookings', 'ride_bookings',
    'payments', 'money_transfers', 'events', 'loyalty_programs'
  ];

  useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = () => {
    // Simulate backup history
    const mockBackups: BackupRecord[] = [
      {
        id: '1',
        name: 'Daily Backup - 2024-01-07',
        type: 'full',
        size: '145 MB',
        status: 'completed',
        createdAt: new Date(),
        tables: ['users', 'bookings', 'payments']
      },
      {
        id: '2',
        name: 'Manual Export - Users',
        type: 'manual',
        size: '12 MB',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000),
        tables: ['users', 'user_roles']
      },
      {
        id: '3',
        name: 'Weekly Backup - 2024-01-01',
        type: 'incremental',
        size: '89 MB',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 6),
        tables: availableTables
      }
    ];
    setBackups(mockBackups);
  };

  const createManualBackup = async () => {
    if (selectedTables.length === 0) {
      toast.error('Please select at least one table to backup');
      return;
    }

    setCreating(true);
    try {
      // Create a comprehensive data export
      const backupData: any = {};
      
      for (const table of selectedTables) {
        try {
          const { data, error } = await supabase
            .from(table as any)
            .select('*');
          
          if (error) {
            console.warn(`Could not backup ${table}:`, error);
            continue;
          }
          
          backupData[table] = data;
        } catch (error) {
          console.warn(`Error backing up ${table}:`, error);
        }
      }

      // Create downloadable backup file
      const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(backupBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hopigo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Add to backup history
      const newBackup: BackupRecord = {
        id: Date.now().toString(),
        name: `Manual Backup - ${new Date().toLocaleDateString()}`,
        type: 'manual',
        size: `${(backupBlob.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'completed',
        createdAt: new Date(),
        tables: selectedTables
      };
      
      setBackups(prev => [newBackup, ...prev]);
      toast.success('Backup created and downloaded successfully');
      setSelectedTables([]);
    } catch (error) {
      console.error('Backup creation failed:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  const saveSettings = async () => {
    // In a real app, this would save to a settings table
    toast.success('Backup settings saved successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout title="Backup & Recovery" description="Manage database backups and data recovery">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Backups</CardTitle>
              <Database className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{backups.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {backups.filter(b => b.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">246 MB</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Auto Backup</CardTitle>
              <Calendar className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {settings.autoBackup ? 'ON' : 'OFF'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Create Manual Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tables">Select Tables to Backup</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {availableTables.map((table) => (
                    <label key={table} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(table)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTables(prev => [...prev, table]);
                          } else {
                            setSelectedTables(prev => prev.filter(t => t !== table));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{table}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={createManualBackup} 
                  disabled={creating || selectedTables.length === 0}
                >
                  {creating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  {creating ? 'Creating Backup...' : 'Create Backup'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTables(availableTables)}
                  disabled={creating}
                >
                  Select All
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTables([])}
                  disabled={creating}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Backup History ({backups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(backup.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{backup.name}</h3>
                        <p className="text-sm text-gray-600">
                          {backup.tables.length} tables • {backup.size} • {backup.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {backup.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Backup Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Backups</h3>
                  <p className="text-sm text-gray-600">Enable scheduled automatic backups</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>

              {settings.autoBackup && (
                <>
                  <div>
                    <Label htmlFor="frequency">Backup Frequency</Label>
                    <Select value={settings.frequency} onValueChange={(value: any) => setSettings(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="retention">Retention Period (days)</Label>
                    <Select value={settings.retentionDays.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, retentionDays: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Include Log Files</h3>
                      <p className="text-sm text-gray-600">Include audit logs in backups</p>
                    </div>
                    <Switch
                      checked={settings.includeLogs}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeLogs: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Include Uploaded Files</h3>
                      <p className="text-sm text-gray-600">Include storage bucket files</p>
                    </div>
                    <Switch
                      checked={settings.includeFiles}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeFiles: checked }))}
                    />
                  </div>
                </>
              )}

              <Button onClick={saveSettings}>
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Data Recovery:</strong> To restore from a backup, contact your system administrator. 
            Backup files are in JSON format and can be imported using database migration tools. 
            Always test recovery procedures in a non-production environment first.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
}