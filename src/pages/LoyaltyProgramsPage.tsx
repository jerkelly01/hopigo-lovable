
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Search, Plus, Edit, Star, DollarSign, Users, TrendingUp } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type LoyaltyProgram = Tables<'loyalty_programs'>;

export default function LoyaltyProgramsPage() {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<LoyaltyProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<LoyaltyProgram | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    reward_type: 'credit',
    points_required: 0,
    reward_value: 0,
    is_active: true
  });

  useEffect(() => {
    fetchLoyaltyPrograms();
  }, []);

  useEffect(() => {
    const filtered = programs.filter(program =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.reward_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPrograms(filtered);
  }, [programs, searchTerm]);

  const fetchLoyaltyPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching loyalty programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async () => {
    try {
      const { error } = await supabase
        .from('loyalty_programs')
        .insert([newProgram]);

      if (error) throw error;

      setIsCreateDialogOpen(false);
      setNewProgram({
        name: '',
        description: '',
        reward_type: 'credit',
        points_required: 0,
        reward_value: 0,
        is_active: true
      });
      fetchLoyaltyPrograms();
    } catch (error) {
      console.error('Error creating loyalty program:', error);
    }
  };

  const handleEditProgram = (program: LoyaltyProgram) => {
    setEditingProgram(program);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram) return;

    try {
      const { error } = await supabase
        .from('loyalty_programs')
        .update({
          name: editingProgram.name,
          description: editingProgram.description,
          reward_type: editingProgram.reward_type,
          points_required: editingProgram.points_required,
          reward_value: editingProgram.reward_value,
          is_active: editingProgram.is_active
        })
        .eq('id', editingProgram.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setEditingProgram(null);
      fetchLoyaltyPrograms();
    } catch (error) {
      console.error('Error updating loyalty program:', error);
    }
  };

  const activePrograms = programs.filter(p => p.is_active).length;
  const totalRewardValue = programs.reduce((sum, program) => sum + Number(program.reward_value), 0);
  const avgPointsRequired = programs.length > 0 
    ? programs.reduce((sum, p) => sum + p.points_required, 0) / programs.length 
    : 0;

  return (
    <AdminLayout title="Loyalty Programs" description="Manage customer loyalty programs and reward systems">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-100">Total Programs</CardTitle>
              <Gift className="h-4 w-4 text-pink-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{programs.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Programs</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activePrograms}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Avg Points</CardTitle>
              <Star className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Math.round(avgPointsRequired)}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">AWG {totalRewardValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Loyalty Programs ({filteredPrograms.length})
              </CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Program
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Loyalty Program</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Program Name</Label>
                      <Input
                        id="name"
                        value={newProgram.name}
                        onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                        placeholder="Enter program name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProgram.description}
                        onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                        placeholder="Enter program description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rewardType">Reward Type</Label>
                      <Select value={newProgram.reward_type} onValueChange={(value) => setNewProgram({...newProgram, reward_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">Credit</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="free_ride">Free Ride</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pointsRequired">Points Required</Label>
                      <Input
                        id="pointsRequired"
                        type="number"
                        value={newProgram.points_required}
                        onChange={(e) => setNewProgram({...newProgram, points_required: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rewardValue">Reward Value (AWG)</Label>
                      <Input
                        id="rewardValue"
                        type="number"
                        step="0.01"
                        value={newProgram.reward_value}
                        onChange={(e) => setNewProgram({...newProgram, reward_value: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={newProgram.is_active}
                        onCheckedChange={(checked) => setNewProgram({...newProgram, is_active: checked})}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <Button onClick={handleCreateProgram} className="w-full">
                      Create Program
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search loyalty programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading loyalty programs...</div>
              ) : (
                <div className="space-y-4">
                  {filteredPrograms.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-pink-50 to-purple-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{program.name}</h3>
                          {program.description && (
                            <p className="text-sm text-gray-600 max-w-md truncate">{program.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Type: {program.reward_type}</span>
                            <span>{program.points_required} points required</span>
                            <span>Value: AWG {Number(program.reward_value)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={program.is_active ? "default" : "secondary"}>
                          {program.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditProgram(program)}>
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
              <DialogTitle>Edit Loyalty Program</DialogTitle>
            </DialogHeader>
            {editingProgram && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName">Program Name</Label>
                  <Input
                    id="editName"
                    value={editingProgram.name}
                    onChange={(e) => setEditingProgram({...editingProgram, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={editingProgram.description || ''}
                    onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editRewardType">Reward Type</Label>
                  <Select value={editingProgram.reward_type} onValueChange={(value) => setEditingProgram({...editingProgram, reward_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="free_ride">Free Ride</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPointsRequired">Points Required</Label>
                  <Input
                    id="editPointsRequired"
                    type="number"
                    value={editingProgram.points_required}
                    onChange={(e) => setEditingProgram({...editingProgram, points_required: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="editRewardValue">Reward Value (AWG)</Label>
                  <Input
                    id="editRewardValue"
                    type="number"
                    step="0.01"
                    value={editingProgram.reward_value}
                    onChange={(e) => setEditingProgram({...editingProgram, reward_value: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editActive"
                    checked={editingProgram.is_active || false}
                    onCheckedChange={(checked) => setEditingProgram({...editingProgram, is_active: checked})}
                  />
                  <Label htmlFor="editActive">Active</Label>
                </div>
                <Button onClick={handleUpdateProgram} className="w-full">
                  Update Program
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
