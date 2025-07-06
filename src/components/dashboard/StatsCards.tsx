import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, Car, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalDrivers: number;
  totalRevenue: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
  formatCurrency: (amount: number) => string;
}

export function StatsCards({ stats, formatCurrency }: StatsCardsProps) {
  const statsData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100',
      change: '+12% from last month'
    },
    {
      title: 'Service Providers',
      value: stats.totalProviders,
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100',
      change: '+8% from last month'
    },
    {
      title: 'Taxi Drivers',
      value: stats.totalDrivers,
      icon: Car,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-100',
      change: '+15% from last month'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-100',
      change: '+20% from last month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => (
        <Card key={stat.title} className={`border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className={`text-xs ${stat.textColor}`}>{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}