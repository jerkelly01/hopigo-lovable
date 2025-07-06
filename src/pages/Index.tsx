
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/AuthProvider';
import { LogOut, User, Wallet, MapPin, Bell, Car, Home, Utensils, Wrench, Music, Gift2, CreditCard, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const serviceCategories = [
  { 
    title: 'Taxi Service', 
    description: 'Quick and reliable rides', 
    icon: Car, 
    color: 'bg-blue-500',
    route: '/taxi'
  },
  { 
    title: 'Home Services', 
    description: 'Cleaning, repairs & maintenance', 
    icon: Home, 
    color: 'bg-green-500',
    route: '/home-services'
  },
  { 
    title: 'Food Delivery', 
    description: 'Your favorite restaurants', 
    icon: Utensils, 
    color: 'bg-orange-500',
    route: '/food-delivery'
  },
  { 
    title: 'Handyman', 
    description: 'Professional repair services', 
    icon: Wrench, 
    color: 'bg-purple-500',
    route: '/handyman'
  },
  { 
    title: 'Events & Tickets', 
    description: 'Book tickets for events', 
    icon: Music, 
    color: 'bg-pink-500',
    route: '/events'
  },
  { 
    title: 'Lifestyle Services', 
    description: 'Beauty, wellness & more', 
    icon: Gift2, 
    color: 'bg-indigo-500',
    route: '/lifestyle'
  },
  { 
    title: 'Bill Payments', 
    description: 'Pay utilities & bills', 
    icon: CreditCard, 
    color: 'bg-red-500',
    route: '/bills'
  },
  { 
    title: 'Mobile Top-up', 
    description: 'Recharge your phone', 
    icon: Smartphone, 
    color: 'bg-cyan-500',
    route: '/topup'
  }
];

const quickActions = [
  { title: 'Profile', icon: User, route: '/profile' },
  { title: 'Wallet', icon: Wallet, route: '/wallet' },
  { title: 'Services', icon: MapPin, route: '/services' },
  { title: 'Notifications', icon: Bell, route: '/notifications' }
];

export default function Index() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAuthAction = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HopiGo
              </h1>
              <span className="ml-2 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full">
                Aruba
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleAuthAction} variant="outline" size="sm">
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your All-in-One Service Marketplace
          </h2>
          <p className="text-lg text-gray-600">
            Book services, manage payments, and discover local providers all in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate(action.route)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                <action.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Service Categories */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Popular Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <Card 
                key={category.title}
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 group"
                onClick={() => navigate(category.route)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-12 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">What's New</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">HopiGo Plus</CardTitle>
                <CardDescription className="text-blue-100">
                  Premium membership with exclusive benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Loyalty Rewards</CardTitle>
                <CardDescription className="text-green-100">
                  Earn points with every service booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  View Rewards
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Special Offers</CardTitle>
                <CardDescription className="text-orange-100">
                  Limited time deals on popular services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  View Deals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
