import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Check, X, AlertCircle, ExternalLink, Zap, Mail, CreditCard, MessageSquare, Globe, Database, Key, TestTube } from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSync?: string;
  webhookUrl?: string;
}

const availableIntegrations = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    category: 'Payment',
    icon: CreditCard,
    requiresAuth: true,
    fields: ['api_key', 'webhook_secret']
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery service',
    category: 'Communication',
    icon: Mail,
    requiresAuth: true,
    fields: ['api_key', 'from_email']
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and voice communications',
    category: 'Communication',
    icon: MessageSquare,
    requiresAuth: true,
    fields: ['account_sid', 'auth_token', 'phone_number']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automation workflows',
    category: 'Automation',
    icon: Zap,
    requiresAuth: false,
    fields: ['webhook_url']
  },
  {
    id: 'google_maps',
    name: 'Google Maps',
    description: 'Location and mapping services',
    category: 'Location',
    icon: Globe,
    requiresAuth: true,
    fields: ['api_key']
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Push notifications and analytics',
    category: 'Analytics',
    icon: Database,
    requiresAuth: true,
    fields: ['project_id', 'service_account_key']
  }
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      category: 'Payment',
      icon: CreditCard,
      status: 'connected',
      config: { api_key: 'sk_test_***', webhook_secret: '***' },
      lastSync: '2024-01-07 10:30:00',
      webhookUrl: 'https://api.hopigo.com/webhooks/stripe'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<any>(null);

  const connectIntegration = () => {
    if (!selectedIntegration) return;

    const newIntegration: Integration = {
      id: selectedIntegration.id,
      name: selectedIntegration.name,
      description: selectedIntegration.description,
      category: selectedIntegration.category,
      icon: selectedIntegration.icon,
      status: 'connected',
      config,
      lastSync: new Date().toISOString().replace('T', ' ').split('.')[0],
      webhookUrl: config.webhook_url || `https://api.hopigo.com/webhooks/${selectedIntegration.id}`
    };

    const exists = integrations.find(i => i.id === selectedIntegration.id);
    if (exists) {
      setIntegrations(integrations.map(i => i.id === selectedIntegration.id ? newIntegration : i));
    } else {
      setIntegrations([...integrations, newIntegration]);
    }

    setConfig({});
    setIsConfigOpen(false);
    toast.success(`${selectedIntegration.name} connected successfully`);
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(i => 
      i.id === integrationId ? { ...i, status: 'disconnected' as const } : i
    ));
    toast.success('Integration disconnected');
  };

  const testConnection = async (integration: Integration) => {
    setTestResult(null);
    toast.info('Testing connection...');

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      const result = {
        success,
        message: success ? 'Connection test successful' : 'Connection failed - check your credentials',
        response: success ? { status: 'ok', latency: '245ms' } : { error: 'Invalid API key' }
      };
      setTestResult(result);
      toast[success ? 'success' : 'error'](result.message);
    }, 2000);
  };

  const syncIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(i => 
      i.id === integrationId 
        ? { ...i, lastSync: new Date().toISOString().replace('T', ' ').split('.')[0] }
        : i
    ));
    toast.success('Integration synced successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Disconnected</Badge>;
    }
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const disconnectedIntegrations = availableIntegrations.filter(
    ai => !integrations.find(i => i.id === ai.id && i.status === 'connected')
  );

  return (
    <AdminLayout title="Integration Framework" description="Connect and manage third-party service integrations">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Plus className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{availableIntegrations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Database className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {[...new Set(availableIntegrations.map(i => i.category))].length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {connectedIntegrations.filter(i => i.webhookUrl).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connected" className="w-full">
          <TabsList>
            <TabsTrigger value="connected">Connected ({connectedIntegrations.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({disconnectedIntegrations.length})</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="mt-6">
            {connectedIntegrations.length === 0 ? (
              <Card className="p-8 text-center">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No integrations connected</h3>
                <p className="text-muted-foreground">Connect your first integration to get started</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <integration.icon className="h-6 w-6 text-primary" />
                          {integration.name}
                        </div>
                        {getStatusBadge(integration.status)}
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Category: {integration.category}</p>
                        <p>Last sync: {integration.lastSync}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testConnection(integration)}
                        >
                          <TestTube className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncIntegration(integration.id)}
                        >
                          Sync
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIntegration(availableIntegrations.find(ai => ai.id === integration.id));
                            setConfig(integration.config);
                            setIsConfigOpen(true);
                          }}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Config
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => disconnectIntegration(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disconnectedIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <integration.icon className="h-6 w-6 text-primary" />
                      {integration.name}
                    </CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category: {integration.category}</span>
                      <Badge variant="outline">{integration.requiresAuth ? 'API Key' : 'Webhook'}</Badge>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setConfig({});
                        setIsConfigOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-6">
            <div className="space-y-4">
              {connectedIntegrations.filter(i => i.webhookUrl).map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <integration.icon className="h-5 w-5 text-primary" />
                        {integration.name} Webhook
                      </div>
                      {getStatusBadge(integration.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input value={integration.webhookUrl} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(integration.webhookUrl || '');
                            toast.success('Webhook URL copied to clipboard');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Configuration Dialog */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Configure {selectedIntegration?.name}
              </DialogTitle>
              <DialogDescription>
                Enter your {selectedIntegration?.name} credentials and configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedIntegration?.fields?.map((field: string) => (
                <div key={field}>
                  <Label htmlFor={field}>
                    {field.split('_').map((word: string) => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Label>
                  {field.includes('key') || field.includes('secret') || field.includes('token') ? (
                    <Input
                      id={field}
                      type="password"
                      value={config[field] || ''}
                      onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                      placeholder={`Enter your ${field.replace('_', ' ')}`}
                    />
                  ) : field === 'service_account_key' ? (
                    <Textarea
                      id={field}
                      value={config[field] || ''}
                      onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                      placeholder="Paste your service account JSON here"
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={field}
                      value={config[field] || ''}
                      onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                      placeholder={`Enter your ${field.replace('_', ' ')}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={connectIntegration}>
                Connect Integration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Test Result Dialog */}
        <Dialog open={!!testResult} onOpenChange={() => setTestResult(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {testResult?.success ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                Connection Test Result
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>{testResult?.message}</p>
              {testResult?.response && (
                <div className="bg-muted p-3 rounded-md">
                  <pre className="text-sm">
                    {JSON.stringify(testResult.response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setTestResult(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}