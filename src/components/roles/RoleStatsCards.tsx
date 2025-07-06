import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, UserCheck, Crown } from 'lucide-react';

interface UserRole {
  user_id: string;
  user_email: string;
  user_name: string;
  role_name: string;
}

interface RoleStatsCardsProps {
  totalRoles: number;
  totalAssignments: number;
  userRoles: UserRole[];
}

export function RoleStatsCards({ totalRoles, totalAssignments, userRoles }: RoleStatsCardsProps) {
  const adminCount = userRoles.filter(ur => ur.role_name === 'admin').length;
  const providerCount = userRoles.filter(ur => ur.role_name === 'provider').length;

  const stats = [
    {
      title: 'Total Roles',
      value: totalRoles,
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100'
    },
    {
      title: 'Role Assignments',
      value: totalAssignments,
      icon: UserCheck,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100'
    },
    {
      title: 'Admin Users',
      value: adminCount,
      icon: Crown,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-100'
    },
    {
      title: 'Service Providers',
      value: providerCount,
      icon: Users,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className={`border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}