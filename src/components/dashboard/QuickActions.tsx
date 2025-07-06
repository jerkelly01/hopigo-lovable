import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShoppingBag, BarChart3, Settings } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Manage Users',
      icon: Users,
      color: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700'
    },
    {
      title: 'View Providers',
      icon: ShoppingBag,
      color: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      color: 'from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Settings',
      icon: Settings,
      color: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-700'
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        <CardDescription className="text-gray-600">Common management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-20 flex flex-col border-0 bg-gradient-to-br ${action.color} transition-all duration-200`}
            >
              <action.icon className={`h-6 w-6 mb-2 ${action.iconColor}`} />
              <span className={action.textColor}>{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}