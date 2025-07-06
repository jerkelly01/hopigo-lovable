
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Search, Plus, Send, Users, MessageSquare } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Notification = Tables<'notifications'>;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const filtered = notifications.filter(notification =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotifications(filtered);
  }, [notifications, searchTerm]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const notificationTypes = new Set(notifications.map(n => n.type)).size;

  return (
    <AdminLayout title="Notifications Management" description="Manage system notifications and user communications">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{notifications.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Unread</CardTitle>
              <Bell className="h-4 w-4 text-red-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{unreadCount}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Types</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{notificationTypes}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Read Rate</CardTitle>
              <Users className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {notifications.length > 0 ? Math.round(((notifications.length - unreadCount) / notifications.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  All Notifications ({filteredNotifications.length})
                </CardTitle>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading notifications...</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredNotifications.map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${notification.is_read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                          <div>
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 truncate max-w-md">{notification.message}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Badge variant="outline" className="text-xs">{notification.type}</Badge>
                              <span>{notification.created_at ? new Date(notification.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={notification.is_read ? "secondary" : "default"}>
                          {notification.is_read ? "Read" : "Unread"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notification
                </Button>
                <Button className="w-full" variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Broadcast Message
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  User Segments
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
