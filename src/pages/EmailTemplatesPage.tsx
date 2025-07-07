import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { Mail, Send, Eye, Settings, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailTemplatesPage() {
  const { emailTemplates, sending, sendEmail } = useEmailTemplates();
  const [testEmail, setTestEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [testData, setTestData] = useState<Record<string, string>>({});
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const handleTestEmail = async () => {
    if (!testEmail || !selectedTemplate) {
      toast.error('Please select a template and enter an email address');
      return;
    }

    const template = emailTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Validate required fields
    const missingFields = template.requiredFields.filter(field => !testData[field]);
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      await sendEmail(testEmail, selectedTemplate, testData);
      setIsTestDialogOpen(false);
      setTestEmail('');
      setTestData({});
    } catch (error) {
      console.error('Test email failed:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      // Initialize test data with sample values
      const sampleData: Record<string, string> = {};
      template.requiredFields.forEach(field => {
        switch (field) {
          case 'name':
          case 'customerName':
            sampleData[field] = 'John Doe';
            break;
          case 'loginUrl':
            sampleData[field] = `${window.location.origin}/auth`;
            break;
          case 'resetUrl':
            sampleData[field] = `${window.location.origin}/reset-password?token=sample123`;
            break;
          case 'serviceName':
            sampleData[field] = 'Taxi Service';
            break;
          case 'bookingDate':
            sampleData[field] = new Date().toLocaleDateString();
            break;
          case 'bookingTime':
            sampleData[field] = '14:30';
            break;
          case 'providerName':
            sampleData[field] = 'Premium Transport';
            break;
          case 'totalAmount':
            sampleData[field] = '25.00';
            break;
          case 'bookingId':
            sampleData[field] = 'BK-2024-001';
            break;
          case 'amount':
            sampleData[field] = '25.00';
            break;
          case 'paymentMethod':
            sampleData[field] = 'Credit Card';
            break;
          case 'transactionId':
            sampleData[field] = 'TXN-2024-001';
            break;
          case 'paymentDate':
            sampleData[field] = new Date().toLocaleDateString();
            break;
          default:
            sampleData[field] = `Sample ${field}`;
        }
      });
      setTestData(sampleData);
    }
  };

  return (
    <AdminLayout 
      title="Email Templates" 
      description="Manage automated email templates and notifications"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Templates</CardTitle>
              <Mail className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{emailTemplates.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active</CardTitle>
              <Settings className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{emailTemplates.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Categories</CardTitle>
              <FileText className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Recipients</CardTitle>
              <Users className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">All Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Email Templates List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates ({emailTemplates.length})
              </CardTitle>
              <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Test Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send Test Email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="testEmail">Test Email Address</Label>
                      <Input
                        id="testEmail"
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>

                    {selectedTemplate && (
                      <div className="space-y-3">
                        <Label>Template Data</Label>
                        {emailTemplates.find(t => t.id === selectedTemplate)?.requiredFields.map((field) => (
                          <div key={field}>
                            <Label htmlFor={field} className="text-xs text-gray-600">
                              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                            <Input
                              id={field}
                              value={testData[field] || ''}
                              onChange={(e) => setTestData(prev => ({ ...prev, [field]: e.target.value }))}
                              placeholder={`Enter ${field}`}
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <Button 
                      onClick={handleTestEmail} 
                      disabled={sending || !testEmail || !selectedTemplate}
                      className="w-full"
                    >
                      {sending ? 'Sending...' : 'Send Test Email'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {emailTemplates.map((template) => (
                <div key={template.id} className="p-6 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">Required Fields:</Label>
                    <div className="flex flex-wrap gap-1">
                      {template.requiredFields.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Eye className="h-5 w-5" />
              Email Template Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create a Resend account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a></li>
                  <li>Verify your sending domain in Resend dashboard</li>
                  <li>Create an API key in your Resend account</li>
                  <li>Add the RESEND_API_KEY to your Supabase Edge Function secrets</li>
                  <li>Test your email templates using the "Test Email" button above</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Available Templates:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Welcome Email:</strong> Automatically sent to new users</li>
                  <li><strong>Booking Confirmation:</strong> Sent when bookings are confirmed</li>
                  <li><strong>Password Reset:</strong> Sent for password reset requests</li>
                  <li><strong>Payment Receipt:</strong> Sent after successful payments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}