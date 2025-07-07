import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Code, 
  Search, 
  Database, 
  Key, 
  Globe,
  FileText,
  Copy,
  CheckCircle,
  Terminal,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  example: string;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/users',
    description: 'Get list of users with pagination',
    auth: true,
    parameters: [
      { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 10)' },
      { name: 'search', type: 'string', required: false, description: 'Search term for filtering' }
    ],
    response: '{ "data": [...], "count": number, "page": number }',
    example: 'curl -H "Authorization: Bearer YOUR_TOKEN" https://your-project.supabase.co/rest/v1/users'
  },
  {
    method: 'POST',
    path: '/users',
    description: 'Create a new user',
    auth: true,
    parameters: [
      { name: 'email', type: 'string', required: true, description: 'User email address' },
      { name: 'full_name', type: 'string', required: false, description: 'User full name' },
      { name: 'user_type', type: 'string', required: false, description: 'Type of user account' }
    ],
    response: '{ "id": "uuid", "email": "string", ... }',
    example: 'curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"email":"user@example.com"}\' https://your-project.supabase.co/rest/v1/users'
  },
  {
    method: 'GET',
    path: '/service-providers',
    description: 'Get active service providers',
    auth: false,
    parameters: [
      { name: 'category', type: 'string', required: false, description: 'Filter by service category' },
      { name: 'verified', type: 'boolean', required: false, description: 'Filter by verification status' }
    ],
    response: '{ "data": [...], "count": number }',
    example: 'curl https://your-project.supabase.co/rest/v1/service_providers?is_verified=eq.true'
  },
  {
    method: 'POST',
    path: '/service-bookings',
    description: 'Create a new service booking',
    auth: true,
    parameters: [
      { name: 'service_id', type: 'uuid', required: true, description: 'ID of the service to book' },
      { name: 'booking_date', type: 'datetime', required: true, description: 'Date and time for the booking' },
      { name: 'total_amount', type: 'number', required: true, description: 'Total booking amount' }
    ],
    response: '{ "id": "uuid", "status": "pending", ... }',
    example: 'curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"service_id":"uuid","booking_date":"2024-01-15T10:00:00Z","total_amount":50.00}\' https://your-project.supabase.co/rest/v1/service_bookings'
  },
  {
    method: 'GET',
    path: '/notifications',
    description: 'Get user notifications',
    auth: true,
    parameters: [
      { name: 'is_read', type: 'boolean', required: false, description: 'Filter by read status' },
      { name: 'type', type: 'string', required: false, description: 'Filter by notification type' }
    ],
    response: '{ "data": [...], "count": number }',
    example: 'curl -H "Authorization: Bearer YOUR_TOKEN" https://your-project.supabase.co/rest/v1/notifications?is_read=eq.false'
  },
  {
    method: 'PUT',
    path: '/notifications/{id}',
    description: 'Mark notification as read',
    auth: true,
    parameters: [
      { name: 'is_read', type: 'boolean', required: true, description: 'Read status' }
    ],
    response: '{ "id": "uuid", "is_read": true, ... }',
    example: 'curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"is_read":true}\' https://your-project.supabase.co/rest/v1/notifications?id=eq.UUID'
  },
  {
    method: 'POST',
    path: '/payments',
    description: 'Process a payment',
    auth: true,
    parameters: [
      { name: 'amount', type: 'number', required: true, description: 'Payment amount' },
      { name: 'payment_method', type: 'string', required: true, description: 'Payment method used' },
      { name: 'type', type: 'string', required: true, description: 'Type of payment' }
    ],
    response: '{ "id": "uuid", "status": "completed", ... }',
    example: 'curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d \'{"amount":25.00,"payment_method":"credit_card","type":"service_payment"}\' https://your-project.supabase.co/rest/v1/payments'
  },
  {
    method: 'GET',
    path: '/events',
    description: 'Get active events',
    auth: false,
    parameters: [
      { name: 'category', type: 'string', required: false, description: 'Filter by event category' },
      { name: 'date_from', type: 'date', required: false, description: 'Filter events from this date' }
    ],
    response: '{ "data": [...], "count": number }',
    example: 'curl https://your-project.supabase.co/rest/v1/events?is_active=eq.true'
  }
];

export default function ApiDocsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const filteredEndpoints = apiEndpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedExample(id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout title="API Documentation" description="Complete API reference and examples">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Endpoints</CardTitle>
              <Globe className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{apiEndpoints.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Public APIs</CardTitle>
              <Zap className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {apiEndpoints.filter(e => !e.auth).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Authenticated</CardTitle>
              <Key className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {apiEndpoints.filter(e => e.auth).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Database Tables</CardTitle>
              <Database className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">15+</div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="prose max-w-none">
                  <h3>HopiGo API Overview</h3>
                  <p>
                    The HopiGo API is built on Supabase and provides RESTful endpoints for managing users, 
                    services, bookings, payments, and more. All API endpoints use standard HTTP methods 
                    and return JSON responses.
                  </p>
                  
                  <h4>Base URL</h4>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    https://mswxfxvqlhfqsmckezci.supabase.co/rest/v1/
                  </div>
                  
                  <h4>Content Type</h4>
                  <p>All requests should include the Content-Type header:</p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    Content-Type: application/json
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="auth" className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Authentication</h3>
                  <p>
                    HopiGo API uses Bearer token authentication. Include your access token in the 
                    Authorization header for protected endpoints.
                  </p>
                  
                  <h4>Headers Required</h4>
                  <div className="space-y-2">
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      Authorization: Bearer YOUR_ACCESS_TOKEN
                    </div>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </div>
                  </div>
                  
                  <h4>Getting an Access Token</h4>
                  <p>Use the Supabase Auth endpoints to sign in and receive an access token:</p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    POST /auth/v1/token?grant_type=password
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Quick Examples</h3>
                  
                  <h4>JavaScript/Fetch</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
                    <pre>{`const response = await fetch('https://your-project.supabase.co/rest/v1/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'apikey': 'YOUR_ANON_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}</pre>
                  </div>
                  
                  <h4>Python</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
                    <pre>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'apikey': 'YOUR_ANON_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://your-project.supabase.co/rest/v1/users', headers=headers)
data = response.json()`}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Endpoints ({filteredEndpoints.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredEndpoints.map((endpoint, index) => (
                <div key={index} className="p-6 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <div>
                        <h3 className="font-mono font-semibold text-gray-900">{endpoint.path}</h3>
                        <p className="text-sm text-gray-600">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {endpoint.auth && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Key className="h-3 w-3" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {endpoint.parameters && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Parameters</h4>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-center space-x-3 text-sm">
                            <Badge variant={param.required ? "default" : "secondary"} className="text-xs">
                              {param.name}
                            </Badge>
                            <span className="text-gray-600">{param.type}</span>
                            <span className="text-gray-500">{param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Response</h4>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      {endpoint.response}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-700">Example</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.example, `${endpoint.method}-${endpoint.path}`)}
                      >
                        {copiedExample === `${endpoint.method}-${endpoint.path}` ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                      {endpoint.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            <strong>Rate Limiting:</strong> API requests are limited to 100 requests per minute per IP address. 
            For higher limits, please contact support. All responses include rate limit headers for monitoring usage.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
}