
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Search, Plus, Edit, MapPin, Users, DollarSign } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = events.reduce((sum, event) => {
    const soldTickets = event.total_tickets - event.available_tickets;
    return sum + (soldTickets * Number(event.ticket_price));
  }, 0);

  const upcomingEvents = events.filter(e => new Date(e.event_date) > new Date()).length;
  const totalTicketsSold = events.reduce((sum, event) => sum + (event.total_tickets - event.available_tickets), 0);

  return (
    <AdminLayout title="Events Management" description="Manage platform events, tickets, and scheduling">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{upcomingEvents}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Tickets Sold</CardTitle>
              <Users className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalTicketsSold}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">AWG {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                All Events ({filteredEvents.length})
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading events...</div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {event.venue}
                          </div>
                          <p className="text-sm text-gray-600">Category: {event.category}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>{new Date(event.event_date).toLocaleDateString()}</span>
                            <span>AWG {Number(event.ticket_price)}</span>
                            <span>{event.available_tickets}/{event.total_tickets} tickets available</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={event.is_active ? "default" : "secondary"}>
                          {event.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={new Date(event.event_date) > new Date() ? "default" : "destructive"}>
                          {new Date(event.event_date) > new Date() ? "Upcoming" : "Past"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
