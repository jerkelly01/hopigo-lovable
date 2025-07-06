import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRequireRole } from '@/hooks/useRequireRole';
import { getAllRoles } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Shield, Plus, CreditCard as Edit, Trash } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ManageRolesScreen() {
  const router = useRouter();
  const { hasRequiredRole, isLoading: roleLoading } = useRequireRole('admin', '/(tabs)');
  
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (hasRequiredRole) {
      loadRoles();
    }
  }, [hasRequiredRole]);
  
  const loadRoles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAllRoles();
      
      if (!result.success) {
        throw new Error('Failed to load roles');
      }
      
      setRoles(result.roles || []);
    } catch (error) {
      console.error('Error loading roles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      Alert.alert('Error', 'Role name is required');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('roles')
        .insert({
          name: newRoleName.trim().toLowerCase(),
          description: newRoleDescription.trim() || null,
        });
      
      if (error) throw error;
      
      Alert.alert('Success', 'Role created successfully');
      setNewRoleName('');
      setNewRoleDescription('');
      setShowAddRole(false);
      loadRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      Alert.alert('Error', 'Failed to create role');
    }
  };
  
  const handleUpdateRole = async () => {
    if (!selectedRole || !selectedRole.name.trim()) {
      Alert.alert('Error', 'Role name is required');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('roles')
        .update({
          name: selectedRole.name.trim().toLowerCase(),
          description: selectedRole.description?.trim() || null,
        })
        .eq('id', selectedRole.id);
      
      if (error) throw error;
      
      Alert.alert('Success', 'Role updated successfully');
      setIsEditing(false);
      loadRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update role');
    }
  };
  
  const handleDeleteRole = async (roleId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this role? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('roles')
                .delete()
                .eq('id', roleId);
              
              if (error) throw error;
              
              Alert.alert('Success', 'Role deleted successfully');
              setSelectedRole(null);
              loadRoles();
            } catch (error) {
              console.error('Error deleting role:', error);
              Alert.alert('Error', 'Failed to delete role');
            }
          }
        }
      ]
    );
  };
  
  if (roleLoading || !hasRequiredRole) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Manage Roles',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Roles</Text>
          <Button
            title="Add New Role"
            onPress={() => {
              setShowAddRole(true);
              setSelectedRole(null);
              setIsEditing(false);
            }}
            icon={<Plus size={20} color={Colors.white} />}
            style={styles.addButton}
          />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading roles...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              title="Try Again" 
              onPress={loadRoles}
              style={styles.retryButton}
            />
          </Card>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.rolesList}>
              <ScrollView>
                {roles.length === 0 ? (
                  <Text style={styles.emptyStateText}>
                    No roles found
                  </Text>
                ) : (
                  roles.map((role) => (
                    <TouchableOpacity
                      key={role.id}
                      style={[
                        styles.roleItem,
                        selectedRole?.id === role.id && styles.selectedRoleItem
                      ]}
                      onPress={() => {
                        setSelectedRole(role);
                        setIsEditing(false);
                        setShowAddRole(false);
                      }}
                    >
                      <View style={styles.roleItemContent}>
                        <Shield size={20} color={Colors.primary} />
                        <View style={styles.roleInfo}>
                          <Text style={styles.roleName}>{role.name}</Text>
                          {role.description && (
                            <Text style={styles.roleDescription} numberOfLines={1}>
                              {role.description}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
            
            <View style={styles.roleDetails}>
              {showAddRole ? (
                <Card style={styles.roleFormCard}>
                  <Text style={styles.formTitle}>Add New Role</Text>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Role Name</Text>
                    <Input
                      value={newRoleName}
                      onChangeText={setNewRoleName}
                      placeholder="Enter role name"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Description (Optional)</Text>
                    <Input
                      value={newRoleDescription}
                      onChangeText={setNewRoleDescription}
                      placeholder="Enter role description"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  
                  <View style={styles.formActions}>
                    <Button
                      title="Cancel"
                      variant="outline"
                      onPress={() => setShowAddRole(false)}
                      style={styles.formButton}
                    />
                    <Button
                      title="Create Role"
                      onPress={handleAddRole}
                      style={styles.formButton}
                    />
                  </View>
                </Card>
              ) : isEditing && selectedRole ? (
                <Card style={styles.roleFormCard}>
                  <Text style={styles.formTitle}>Edit Role</Text>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Role Name</Text>
                    <Input
                      value={selectedRole.name}
                      onChangeText={(text) => setSelectedRole({...selectedRole, name: text})}
                      placeholder="Enter role name"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Description (Optional)</Text>
                    <Input
                      value={selectedRole.description || ''}
                      onChangeText={(text) => setSelectedRole({...selectedRole, description: text})}
                      placeholder="Enter role description"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  
                  <View style={styles.formActions}>
                    <Button
                      title="Cancel"
                      variant="outline"
                      onPress={() => setIsEditing(false)}
                      style={styles.formButton}
                    />
                    <Button
                      title="Update Role"
                      onPress={handleUpdateRole}
                      style={styles.formButton}
                    />
                  </View>
                </Card>
              ) : selectedRole ? (
                <Card style={styles.roleDetailsCard}>
                  <View style={styles.roleDetailHeader}>
                    <Text style={styles.roleDetailTitle}>{selectedRole.name}</Text>
                    <View style={styles.roleActions}>
                      <TouchableOpacity 
                        style={styles.roleAction}
                        onPress={() => setIsEditing(true)}
                      >
                        <Edit size={20} color={Colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.roleAction}
                        onPress={() => handleDeleteRole(selectedRole.id)}
                      >
                        <Trash size={20} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.roleDetailContent}>
                    <Text style={styles.roleDetailLabel}>Description</Text>
                    <Text style={styles.roleDetailDescription}>
                      {selectedRole.description || 'No description provided'}
                    </Text>
                    
                    <Text style={styles.roleDetailLabel}>Created At</Text>
                    <Text style={styles.roleDetailText}>
                      {new Date(selectedRole.created_at).toLocaleString()}
                    </Text>
                    
                    <Text style={styles.roleDetailLabel}>ID</Text>
                    <Text style={styles.roleDetailId}>{selectedRole.id}</Text>
                  </View>
                  
                  <View style={styles.roleDetailActions}>
                    <Button
                      title="View Users with this Role"
                      variant="outline"
                      onPress={() => Alert.alert('Not Implemented', 'This feature is not yet implemented')}
                    />
                  </View>
                </Card>
              ) : (
                <View style={styles.noRoleSelectedContainer}>
                  <Text style={styles.noRoleSelectedText}>
                    Select a role to view details or click "Add New Role" to create one
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    paddingHorizontal: 16,
  },
  errorCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rolesList: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  roleItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedRoleItem: {
    backgroundColor: Colors.primary + '10',
  },
  roleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleInfo: {
    marginLeft: 12,
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    textTransform: 'capitalize',
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  roleDetails: {
    flex: 1,
    padding: 16,
  },
  roleFormCard: {
    padding: 20,
    margin: 0,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  formButton: {
    minWidth: 120,
  },
  roleDetailsCard: {
    padding: 20,
    margin: 0,
  },
  roleDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roleDetailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textTransform: 'capitalize',
  },
  roleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  roleAction: {
    padding: 8,
  },
  roleDetailContent: {
    marginBottom: 24,
  },
  roleDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  roleDetailDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  roleDetailText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  roleDetailId: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  roleDetailActions: {
    marginTop: 16,
  },
  noRoleSelectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRoleSelectedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});