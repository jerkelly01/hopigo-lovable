import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search, Trash2 } from 'lucide-react';

interface UserRole {
  user_id: string;
  user_email: string;
  user_name: string;
  role_name: string;
}

interface UserRoleAssignmentsProps {
  userRoles: UserRole[];
  onAssignRole: () => void;
  onRemoveRole: (userId: string, roleName: string) => void;
}

export function UserRoleAssignments({ userRoles, onAssignRole, onRemoveRole }: UserRoleAssignmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredUserRoles = userRoles.filter(
    (assignment) =>
      assignment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="h-5 w-5" />
            User Role Assignments ({userRoles.length})
          </CardTitle>
          <Button onClick={onAssignRole}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredUserRoles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'No assignments match your search.' : 'No role assignments found.'}
            </p>
          ) : (
            filteredUserRoles.map((assignment, index) => (
              <div
                key={`${assignment.user_id}-${assignment.role_name}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {assignment.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{assignment.user_name}</p>
                    <p className="text-sm text-gray-600">{assignment.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(assignment.role_name)}>
                    {assignment.role_name}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onRemoveRole(assignment.user_id, assignment.role_name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}