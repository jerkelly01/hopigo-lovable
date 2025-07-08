import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Copy, RefreshCw, Settings, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardConnection {
  id: string;
  app_id: string;
  app_name: string;
  api_key: string;
  webhook_url: string | null;
  is_active: boolean;
  last_sync: string | null;
  sync_status: string;
  created_at: string;
}

export default function DashboardConnectionPage() {
  const [connections, setConnections] = useState<DashboardConnection[]>([]);
  const [newConnection, setNewConnection] = useState({
    app_id: '',
    app_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const { toast } = useToast();

  // Get the current domain for API URLs
  const baseUrl = window.location.origin;
  const apiUrl = `${baseUrl}/functions/v1/dashboard-api`;
  const webhookUrl = `${baseUrl}/functions/v1/app-webhooks`;

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dashboard_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard connections',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = () => {
    return 'dk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createConnection = async () => {
    if (!newConnection.app_id || !newConnection.app_name) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = generateApiKey();
      
      const { error } = await supabase
        .from('dashboard_connections')
        .insert({
          app_id: newConnection.app_id,
          app_name: newConnection.app_name,
          api_key: apiKey,
          webhook_url: webhookUrl,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Dashboard connection created successfully',
      });

      setNewConnection({ app_id: '', app_name: '' });
      loadConnections();
    } catch (error: any) {
      console.error('Error creating connection:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create dashboard connection',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (connection: DashboardConnection) => {
    setTestingConnection(connection.id);
    try {
      const response = await fetch(`${apiUrl}/status`, {
        headers: {
          'x-api-key': connection.api_key,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Connection test successful',
        });
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: 'Error',
        description: 'Connection test failed',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const toggleConnection = async (connection: DashboardConnection) => {
    try {
      const { error } = await supabase
        .from('dashboard_connections')
        .update({ is_active: !connection.is_active })
        .eq('id', connection.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Connection ${connection.is_active ? 'disabled' : 'enabled'}`,
      });

      loadConnections();
    } catch (error) {
      console.error('Error toggling connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to update connection status',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Connection</h1>
          <p className="text-muted-foreground mt-2">
            Connect your Rork app to this dashboard for real-time data synchronization
          </p>
        </div>
        <Button onClick={loadConnections} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Setup Instructions
          </CardTitle>
          <CardDescription>
            Follow these steps to connect your Rork app to this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Environment Variables</h4>
            <div className="bg-muted p-3 rounded-md font-mono text-sm space-y-1">
              <div>EXPO_PUBLIC_DASHBOARD_URL={apiUrl}</div>
              <div>EXPO_PUBLIC_DASHBOARD_WEBHOOK_URL={webhookUrl}</div>
              <div>EXPO_PUBLIC_DASHBOARD_API_KEY=your-api-key-from-below</div>
              <div>EXPO_PUBLIC_DASHBOARD_ID=your-app-id</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">2. Create Connection</h4>
            <p className="text-sm text-muted-foreground">
              Use the form below to create a new dashboard connection and get your API key
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Create New Connection */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Connection</CardTitle>
          <CardDescription>
            Add a new app connection to sync data with this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="app_id">App ID</Label>
              <Input
                id="app_id"
                value={newConnection.app_id}
                onChange={(e) => setNewConnection(prev => ({ ...prev, app_id: e.target.value }))}
                placeholder="e.g., rork-hopigo"
              />
            </div>
            <div>
              <Label htmlFor="app_name">App Name</Label>
              <Input
                id="app_name"
                value={newConnection.app_name}
                onChange={(e) => setNewConnection(prev => ({ ...prev, app_name: e.target.value }))}
                placeholder="e.g., Rork HopiGo App"
              />
            </div>
          </div>
          <Button onClick={createConnection} disabled={isLoading}>
            <Zap className="w-4 h-4 mr-2" />
            Create Connection
          </Button>
        </CardContent>
      </Card>

      {/* Existing Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Active Connections</CardTitle>
          <CardDescription>
            Manage your existing dashboard connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No connections found. Create your first connection above.
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{connection.app_name}</h3>
                      <p className="text-sm text-muted-foreground">App ID: {connection.app_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSyncStatusBadge(connection.sync_status)}
                      <Badge variant={connection.is_active ? "default" : "secondary"}>
                        {connection.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium">API Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="password"
                          value={connection.api_key}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(connection.api_key)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Webhook URL</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={connection.webhook_url || webhookUrl}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(connection.webhook_url || webhookUrl)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {connection.last_sync && (
                    <p className="text-xs text-muted-foreground">
                      Last sync: {new Date(connection.last_sync).toLocaleString()}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection(connection)}
                      disabled={testingConnection === connection.id || !connection.is_active}
                    >
                      {testingConnection === connection.id ? (
                        <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-2" />
                      )}
                      Test Connection
                    </Button>
                    <Button
                      size="sm"
                      variant={connection.is_active ? "destructive" : "default"}
                      onClick={() => toggleConnection(connection)}
                    >
                      {connection.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Endpoints Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available endpoints for your app integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">GET /dashboard-api/status</h4>
            <p className="text-sm text-muted-foreground">Health check endpoint</p>
          </div>
          <div>
            <h4 className="font-medium">GET /dashboard-api/users</h4>
            <p className="text-sm text-muted-foreground">Retrieve all users</p>
          </div>
          <div>
            <h4 className="font-medium">POST /dashboard-api/sync-user</h4>
            <p className="text-sm text-muted-foreground">Sync user data to dashboard</p>
          </div>
          <div>
            <h4 className="font-medium">POST /app-webhooks</h4>
            <p className="text-sm text-muted-foreground">Receive app events and data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
