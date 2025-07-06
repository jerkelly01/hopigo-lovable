import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tables } from '@/integrations/supabase/types';

type Role = Tables<'roles'>;

interface UserSummary {
  id: string;
  email: string;
  full_name: string | null;
  name: string | null;
}

interface RoleAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserSummary[];
  roles: Role[];
  onAssign: (userId: string, roleName: string) => Promise<void>;
}

export function RoleAssignmentDialog({ 
  open, 
  onOpenChange, 
  users, 
  roles, 
  onAssign 
}: RoleAssignmentDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedUserId || !selectedRoleName) return;

    setIsLoading(true);
    try {
      await onAssign(selectedUserId, selectedRoleName);
      // Reset form
      setSelectedUserId('');
      setSelectedRoleName('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Role to User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col">
                      <span>{user.full_name || user.name || 'Unknown'}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRoleName} onValueChange={setSelectedRoleName}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    <div className="flex flex-col">
                      <span className="capitalize">{role.name}</span>
                      <span className="text-sm text-gray-500">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedUserId || !selectedRoleName || isLoading}
            >
              {isLoading ? 'Assigning...' : 'Assign Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}