import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRequireRole } from '@/hooks/useRequireRole';
import { supabaseAdmin, getAllUsers, getAllRoles } from '@/lib/supabase-admin';
import { Users, Shield, Settings, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AdminDashboard() {
  const router = useRouter();
  const { hasRequiredRole, isLoading: roleLoading } = useRequireRole('admin', '/(tabs)');
  
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (hasRequiredRole) {
      loadDashboardData();
    }
  }, [hasRequiredRole]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load users and roles
      const [usersResult, rolesResult] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      
      if (!usersResult.success) {
        throw new Error('Failed to load users');
      }
      
      if (!rolesResult.success) {
        throw new Error('Failed to load roles');
      }
      
      setUsers(usersResult.users || []);
      setRoles(rolesResult.roles || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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
          title: 'Admin Dashboard',
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
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage users, roles, and application settings
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading dashboard data...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              title="Try Again" 
              onPress={loadDashboardData}
              style={styles.retryButton}
            />
          </Card>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <Card style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Users size={24} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{users.length}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </Card>
              
              <Card style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Shield size={24} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{roles.length}</Text>
                <Text style={styles.statLabel}>Roles</Text>
              </Card>
            </View>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/admin/users')}
              >
                <Card style={styles.actionCardContent}>
                  <Users size={32} color={Colors.primary} />
                  <Text style={styles.actionTitle}>Manage Users</Text>
                  <Text style={styles.actionDescription}>
                    View, edit, and assign roles to users
                  </Text>
                </Card>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/admin/roles')}
              >
                <Card style={styles.actionCardContent}>
                  <Shield size={32} color={Colors.primary} />
                  <Text style={styles.actionTitle}>Manage Roles</Text>
                  <Text style={styles.actionDescription}>
                    Create and configure user roles and permissions
                  </Text>
                </Card>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/admin/settings')}
              >
                <Card style={styles.actionCardContent}>
                  <Settings size={32} color={Colors.primary} />
                  <Text style={styles.actionTitle}>App Settings</Text>
                  <Text style={styles.actionDescription}>
                    Configure global application settings
                  </Text>
                </Card>
              </TouchableOpacity>
            </View>
            
            <Card style={styles.recentActivityCard}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Text style={styles.emptyStateText}>
                Activity logs will appear here
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
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
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    margin: 0,
    marginHorizontal: 8,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionCard: {
    marginBottom: 12,
  },
  actionCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recentActivityCard: {
    margin: 20,
    padding: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});