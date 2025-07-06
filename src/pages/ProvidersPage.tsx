
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, Plus, Edit, Star, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type ServiceProvider = Tables<'service_providers'>;
type User = Tables<'users'>;

// Define a simple category type since service_categories table types aren't available yet
interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon_name?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface ProviderWithUser extends ServiceProvider {
  user?: User;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderWithUser[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ProviderWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<ProviderWithUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    business_name: '',
    description: '',
    category: '',
    user_id: ''
  });

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = providers.filter(provider => {
      const matchesSearch = 
        provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || provider.category === filterCategory;
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && provider.is_active) ||
        (filterStatus === 'inactive' && !provider.is_active) ||
        (filterStatus === 'verified' && provider.is_verified) ||
        (filterStatus === 'unverified' && !provider.is_verified);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredProviders(filtered);
  }, [providers, searchTerm, filterCategory, filterStatus]);

  const fetchProviders = async () => {
    try {
      // First get service providers
      const { data: providersData, error: providersError } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (providersError) throw providersError;

      // Then get users for each provider
      const providersWithUsers = await Promise.all(
        (providersData || []).map(async (provider) => {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', provider.user_id)
            .single();

          return {
            ...provider,
            user: userData
          };
        })
      );

      setProviders(providersWithUsers);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Try to fetch from service_categories table, but handle if it doesn't exist yet
      const { data, error } = await supabase
        .rpc('sql', { 
          query: 'SELECT * FROM service_categories WHERE is_active = true ORDER BY sort_order' 
        }) as any;

      if (error) {
        // Fallback to hardcoded categories if table doesn't exist
        console.log('Service categories table not ready, using defaults');
        setCategories([
          { id: '1', name: 'Cleaning', description: 'Home and office cleaning services', icon_name: 'Sparkles', is_active: true, sort_order: 1, created_at: new Date().toISOString() },
          { id: '2', name: 'Handyman', description: 'General repair and maintenance', icon_name: 'Wrench', is_active: true, sort_order: 2, created_at: new Date().toISOString() },
          { id: '3', name: 'Landscaping', description: 'Garden and lawn care services', icon_name: 'Trees', is_active: true, sort_order: 3, created_at: new Date().toISOString() },
          { id: '4', name: 'Beauty', description: 'Beauty and wellness services', icon_name: 'Scissors', is_active: true, sort_order: 4, created_at: new Date().toISOString() },
        ]);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use default categories
      setCategories([
        { id: '1', name: 'Cleaning', description: 'Home and office cleaning services', icon_name: 'Sparkles', is_active: true, sort_order: 1, created_at: new Date().toISOString() },
        { id: '2', name: 'Handyman', description: 'General repair and maintenance', icon_name: 'Wrench', is_active: true, sort_order: 2, created_at: new Date().toISOString() },
        { id: '3', name: 'Landscaping', description: 'Garden and lawn care services', icon_name: 'Trees', is_active: true, sort_order: 3, created_at: new Date().toISOString() },
        { id: '4', name: 'Beauty', description: 'Beauty and wellness services', icon_name: 'Scissors', is_active: true, sort_order: 4, created_at: new Date().toISOString() },
      ]);
    }
  };

  const handleEditProvider = (provider: ProviderWithUser) => {
    setEditingProvider(provider);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProvider = async () => {
    if (!editingProvider) return;

    try {
      const { error } = await supabase
        .from('service_providers')
        .update({
          business_name: editingProvider.business_name,
          description: editingProvider.description,
          category: editingProvider.category,
          is_verified: editingProvider.is_verified,
          is_active: editingProvider.is_active
        })
        .eq('id', editingProvider.id);

      if (error) throw error;

      toast.success('Provider updated successfully');
      setIsEditDialogOpen(false);
      setEditingProvider(null);
      fetchProviders();
    } catch (error) {
      console.error('Error updating provider:', error);
      toast.error('Failed to update provider');
    }
  };

  const handleCreateProvider = async () => {
    try {
      // First, get a user to assign this provider to (in a real app, you'd have a user selector)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (usersError) throw usersError;
      if (!users || users.length === 0) {
        toast.error('No users available to create provider');
        return;
      }

      const { error } = await supabase
        .from('service_providers')
        .insert({
          business_name: newProvider.business_name,
          description: newProvider.description,
          category: newProvider.category,
          user_id: users[0].id
        });

      if (error) throw error;

      toast.success('Provider created successfully');
      setIsCreateDialogOpen(false);
      setNewProvider({ business_name: '', description: '', category: '', user_id: '' });
      fetchProviders();
    } catch (error) {
      console.error('Error creating provider:', error);
      toast.error('Failed to create provider');
    }
  };

  const toggleProviderStatus = async (providerId: string, field: 'is_active' | 'is_verified', value: boolean) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ [field]: value })
        .eq('id', providerId);

      if (error) throw error;

      toast.success(`Provider ${field.replace('is_', '')} status updated`);
      fetchProviders();
    } catch (error) {
      console.error(`Error updating provider ${field}:`, error);
      toast.error(`Failed to update provider ${field.replace('is_', '')} status`);
    }
  };

  const totalProviders = providers.length;
  const activeProviders = providers.filter(p => p.is_active).length;
  const verifiedProviders = providers.filter(p => p.is_verified).length;
  const averageRating = providers.length > 0 
    ? providers.reduce((sum, p) => sum + Number(p.rating || 0), 0) / providers.length 
    : 0;
  const totalEarnings = providers.reduce((sum, p) => sum + Number(p.total_earnings || 0), 0);

  return (
    <AdminLayout title="Service Providers" description="Manage service providers, their profiles, and verification status">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Providers</CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalProviders}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Providers</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeProviders}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Verified Providers</CardTitle>
              <Star className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{verifiedProviders}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">AWG {totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Providers ({filteredProviders.length})
              </CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Provider
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Provider</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={newProvider.business_name}
                        onChange={(e) => setNewProvider({...newProvider, business_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProvider.description}
                        onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProvider.category} onValueChange={(value) => setNewProvider({...newProvider, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateProvider} className="w-full">
                      Create Provider
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading providers...</div>
              ) : (
                <div className="space-y-4">
                  {filteredProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={provider.user?.avatar_url || undefined} />
                          <AvatarFallback>
                            {provider.business_name?.charAt(0) || provider.user?.full_name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {provider.business_name || 'Unnamed Business'}
                          </h3>
                          <p className="text-sm text-gray-600">{provider.user?.email}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>Category: {provider.category}</span>
                            <span>•</span>
                            <span>Rating: {Number(provider.rating || 0).toFixed(1)}</span>
                            <span>•</span>
                            <span>Earnings: AWG {Number(provider.total_earnings || 0).toLocaleString()}</span>
                            <span>•</span>
                            <span>Bookings: {provider.total_bookings || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={provider.is_verified ? "default" : "secondary"}>
                          {provider.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={provider.is_active ? "default" : "destructive"}>
                          {provider.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={provider.is_verified || false}
                            onCheckedChange={(checked) => toggleProviderStatus(provider.id, 'is_verified', checked)}
                          />
                          <Switch
                            checked={provider.is_active || false}
                            onCheckedChange={(checked) => toggleProviderStatus(provider.id, 'is_active', checked)}
                          />
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleEditProvider(provider)}>
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Provider</DialogTitle>
            </DialogHeader>
            {editingProvider && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={editingProvider.business_name || ''}
                    onChange={(e) => setEditingProvider({...editingProvider, business_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingProvider.description || ''}
                    onChange={(e) => setEditingProvider({...editingProvider, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={editingProvider.category} onValueChange={(value) => setEditingProvider({...editingProvider, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={editingProvider.is_verified || false}
                    onCheckedChange={(checked) => setEditingProvider({...editingProvider, is_verified: checked})}
                  />
                  <Label htmlFor="verified">Verified</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={editingProvider.is_active || false}
                    onCheckedChange={(checked) => setEditingProvider({...editingProvider, is_active: checked})}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button onClick={handleUpdateProvider} className="w-full">
                  Update Provider
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
