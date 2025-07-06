
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Phone, MapPin, Clock, Users, Shield } from 'lucide-react';

export default function EmergencyPage() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  const emergencyContacts = [
    { name: 'Police', number: '911', type: 'police' },
    { name: 'Fire Department', number: '912', type: 'fire' },
    { name: 'Medical Emergency', number: '913', type: 'medical' },
    { name: 'Platform Support', number: '+297-123-4567', type: 'support' }
  ];

  const recentIncidents = [
    { id: 1, type: 'Safety Alert', location: 'Downtown Area', time: '2 hours ago', status: 'resolved' },
    { id: 2, type: 'Medical Emergency', location: 'Airport Road', time: '5 hours ago', status: 'active' },
    { id: 3, type: 'Technical Issue', location: 'System Wide', time: '1 day ago', status: 'resolved' }
  ];

  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
  };

  return (
    <AdminLayout title="Emergency Management" description="Emergency protocols, safety alerts, and incident management">
      <div className="space-y-6">
        {emergencyMode && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Emergency mode is currently active. All non-essential services have been suspended.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Active Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {recentIncidents.filter(i => i.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Safety Alerts</CardTitle>
              <Shield className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4.2m</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Resolved Today</CardTitle>
              <Users className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                  <div>
                    <h3 className="font-medium text-red-900">Emergency Mode</h3>
                    <p className="text-sm text-red-700">Suspend all non-essential services</p>
                  </div>
                  <Button 
                    variant={emergencyMode ? "destructive" : "outline"}
                    onClick={toggleEmergencyMode}
                  >
                    {emergencyMode ? "Deactivate" : "Activate"}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Send Safety Alert
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Notify All Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Authorities
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{incident.type}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </div>
                      <p className="text-sm text-gray-500">{incident.time}</p>
                    </div>
                  </div>
                  <Badge variant={incident.status === 'active' ? "destructive" : "default"}>
                    {incident.status}
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
