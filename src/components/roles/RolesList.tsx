import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Edit, Plus } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Role = Tables<'roles'>;

interface RoleWithStats extends Role {
  userCount: number;
}

interface RolesListProps {
  roles: RoleWithStats[];
  onCreateRole: () => void;
}

export function RolesList({ roles, onCreateRole }: RolesListProps) {
  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'provider':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'driver':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="h-5 w-5" />
            Available Roles ({roles.length})
          </CardTitle>
          <Button onClick={onCreateRole} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge className={getRoleColor(role.name)}>
                  {role.name}
                </Badge>
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <h4 className="font-medium text-gray-900 capitalize mb-2">{role.name}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {role.description || 'No description provided'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{role.userCount} users</span>
                <span className="text-xs text-gray-400">
                  Created {new Date(role.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}