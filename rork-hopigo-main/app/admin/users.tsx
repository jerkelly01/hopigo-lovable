import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRequireRole } from '@/hooks/useRequireRole';
import { getAllUsers, assignRoleToUser, getUserRoles } from '@/lib/supabase-admin';
import { ArrowLeft, Search, User, Shield, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ManageUsersScreen() {
  const router = useRouter();
  const { hasRequiredRole, isLoading: roleLoading } = useRequireRole('admin', '/(tabs)');
  
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  
  useEffect(() => {
    if (hasRequiredRole) {
      loadUsers();
    }
  }, [hasRequiredRole]);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);
  
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAllUsers();
      
      if (!result.success) {
        throw new Error('Failed to load users');
      }
      
      setUsers(result.users || []);
      setFilteredUsers(result.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUserSelect = async (user: any) => {
    setSelectedUser(user);
    setIsLoadingRoles(true);
    
    try {
      const result = await getUserRoles(user.id);
      
      if (!result.success) {
        throw new Error('Failed to load user roles');
      }
      
      setUserRoles(result.roles || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
      Alert.alert('Error', 'Failed to load user roles');
    } finally {
      setIsLoadingRoles(false);
    }
  };
  
  const handleAssignRole = async (userId: string, roleName: 'admin' | 'provider' | 'user') => {
    try {
      const result = await assignRoleToUser(userId, roleName);
      
      if (!result.success) {
        throw new Error('Failed to assign role');
      }
      
      // Refresh user roles
      await handleUserSelect(selectedUser);
      
      Alert.alert('Success', `Role "${roleName}" assigned successfully`);
    } catch (error) {
      console.error('Error assigning role:', error);
      Alert.alert('Error', 'Failed to assign role');
    }
  };
  
  const hasRole = (roleName: string) => {
    return userRoles.some(role => role.name === roleName);
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
          title: 'Manage Users',
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
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={Colors.textSecondary} />}
            containerStyle={styles.searchInput}
          />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              title="Try Again" 
              onPress={loadUsers}
              style={styles.retryButton}
            />
          </Card>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.usersList}>
              <ScrollView>
                {filteredUsers.length === 0 ? (
                  <Text style={styles.emptyStateText}>
                    {searchQuery ? 'No users match your search' : 'No users found'}
                  </Text>
                ) : (
                  filteredUsers.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      style={[
                        styles.userItem,
                        selectedUser?.id === user.id && styles.selectedUserItem
                      ]}
                      onPress={() => handleUserSelect(user)}
                    >
                      <View style={styles.userAvatar}>
                        <User size={20} color={Colors.white} />
                      </View>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {user.user_metadata?.name || 'Unnamed User'}
                        </Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
            
            <View style={styles.userDetails}>
              {selectedUser ? (
                <Card style={styles.userDetailsCard}>
                  <Text style={styles.detailsTitle}>User Details</Text>
                  
                  <View style={styles.userProfile}>
                    <View style={styles.userProfileAvatar}>
                      <User size={32} color={Colors.white} />
                    </View>
                    <View style={styles.userProfileInfo}>
                      <Text style={styles.userProfileName}>
                        {selectedUser.user_metadata?.name || 'Unnamed User'}
                      </Text>
                      <Text style={styles.userProfileEmail}>{selectedUser.email}</Text>
                      <Text style={styles.userProfileId}>ID: {selectedUser.id}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.userRolesSection}>
                    <Text style={styles.sectionTitle}>Roles</Text>
                    
                    {isLoadingRoles ? (
                      <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                      <View style={styles.rolesContainer}>
                        <View style={styles.roleItem}>
                          <View style={styles.roleInfo}>
                            <Shield size={20} color={Colors.primary} />
                            <Text style={styles.roleName}>Admin</Text>
                          </View>
                          {hasRole('admin') ? (
                            <CheckCircle size={20} color={Colors.success} />
                          ) : (
                            <TouchableOpacity
                              onPress={() => handleAssignRole(selectedUser.id, 'admin')}
                            >
                              <Text style={styles.assignRoleText}>Assign</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        
                        <View style={styles.roleItem}>
                          <View style={styles.roleInfo}>
                            <Shield size={20} color={Colors.primary} />
                            <Text style={styles.roleName}>Provider</Text>
                          </View>
                          {hasRole('provider') ? (
                            <CheckCircle size={20} color={Colors.success} />
                          ) : (
                            <TouchableOpacity
                              onPress={() => handleAssignRole(selectedUser.id, 'provider')}
                            >
                              <Text style={styles.assignRoleText}>Assign</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        
                        <View style={styles.roleItem}>
                          <View style={styles.roleInfo}>
                            <Shield size={20} color={Colors.primary} />
                            <Text style={styles.roleName}>User</Text>
                          </View>
                          {hasRole('user') ? (
                            <CheckCircle size={20} color={Colors.success} />
                          ) : (
                            <TouchableOpacity
                              onPress={() => handleAssignRole(selectedUser.id, 'user')}
                            >
                              <Text style={styles.assignRoleText}>Assign</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.userActions}>
                    <Button
                      title="Reset Password"
                      variant="outline"
                      style={styles.actionButton}
                      onPress={() => Alert.alert('Not Implemented', 'This feature is not yet implemented')}
                    />
                    <Button
                      title="Disable User"
                      variant="outline"
                      style={[styles.actionButton, styles.dangerButton]}
                      textStyle={styles.dangerButtonText}
                      onPress={() => Alert.alert('Not Implemented', 'This feature is not yet implemented')}
                    />
                  </View>
                </Card>
              ) : (
                <View style={styles.noUserSelectedContainer}>
                  <Text style={styles.noUserSelectedText}>
                    Select a user to view details
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    marginBottom: 0,
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
  usersList: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedUserItem: {
    backgroundColor: Colors.primary + '10',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
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
  userDetails: {
    flex: 1,
    padding: 16,
  },
  userDetailsCard: {
    padding: 20,
    margin: 0,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  userProfileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userProfileInfo: {
    flex: 1,
  },
  userProfileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userProfileEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userProfileId: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  userRolesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  rolesContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleName: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  assignRoleText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    minWidth: 120,
  },
  dangerButton: {
    borderColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.error,
  },
  noUserSelectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserSelectedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});