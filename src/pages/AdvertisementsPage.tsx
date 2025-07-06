
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, Search, Plus, Edit, Eye, Calendar } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Advertisement = Tables<'advertisements'>;

export default function AdvertisementsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  useEffect(() => {
    const filtered = ads.filter(ad =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ad.target_audience && ad.target_audience.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredAds(filtered);
  }, [ads, searchTerm]);

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeAds = ads.filter(ad => ad.is_active).length;
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.click_count || 0), 0);
  const runningAds = ads.filter(ad => {
    const now = new Date();
    return new Date(ad.start_date) <= now && new Date(ad.end_date) >= now && ad.is_active;
  }).length;

  return (
    <AdminLayout title="Advertisement Management" description="Manage platform advertisements and promotional content">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Total Ads</CardTitle>
              <Megaphone className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ads.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Ads</CardTitle>
              <Megaphone className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeAds}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Running Now</CardTitle>
              <Calendar className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{runningAds}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Clicks</CardTitle>
              <Eye className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                All Advertisements ({filteredAds.length})
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ad
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search advertisements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading advertisements...</div>
              ) : (
                <div className="space-y-4">
                  {filteredAds.map((ad) => (
                    <div key={ad.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-orange-50 to-yellow-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <Megaphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                          {ad.description && (
                            <p className="text-sm text-gray-600 max-w-md truncate">{ad.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Target: {ad.target_audience || 'All'}</span>
                            <span>{ad.click_count || 0} clicks</span>
                            <span>{new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={ad.is_active ? "default" : "secondary"}>
                          {ad.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={
                          new Date() >= new Date(ad.start_date) && new Date() <= new Date(ad.end_date) 
                            ? "default" : "outline"
                        }>
                          {new Date() >= new Date(ad.start_date) && new Date() <= new Date(ad.end_date) 
                            ? "Running" : "Scheduled"}
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
