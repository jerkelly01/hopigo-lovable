
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, MapPin, Clock, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceProvider {
  id: string;
  business_name: string;
  description: string;
  category: string;
  rating: number;
  user_id: string;
  services: {
    id: string;
    title: string;
    price: number;
    duration_minutes: number;
  }[];
}

export default function Marketplace() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all', 'cleaning', 'landscaping', 'handyman', 'beauty', 'fitness', 'tutoring'
  ];

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          services (
            id,
            title,
            price,
            duration_minutes
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Marketplace</h1>
          <p className="text-gray-600">Find and book trusted local service providers</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for services or providers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{provider.business_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {provider.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {provider.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Aruba</span>
                </div>
              </CardHeader>
              <CardContent>
                {provider.services && provider.services.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-sm">Services:</h4>
                    {provider.services.slice(0, 2).map((service) => (
                      <div key={service.id} className="flex justify-between items-center text-sm">
                        <span>{service.title}</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-500">{service.duration_minutes}min</span>
                          <span className="font-medium">AWG {service.price}</span>
                        </div>
                      </div>
                    ))}
                    {provider.services.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{provider.services.length - 2} more services
                      </p>
                    )}
                  </div>
                )}
                <Button className="w-full">
                  View Profile & Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
