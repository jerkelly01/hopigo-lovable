import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

// These environment variables should be set in your deployment environment
// For local development, you can use .env.local
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key
// This client has admin privileges and should only be used in secure server environments
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper functions for role management
export async function assignRoleToUser(userId: string, roleName: 'admin' | 'provider' | 'user') {
  try {
    const { data, error } = await supabaseAdmin.rpc('assign_role', {
      user_id: userId,
      role_name: roleName,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, error };
  }
}

export async function getUserRoles(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .select(`
        roles (
          id,
          name,
          description
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return { 
      success: true, 
      roles: data?.map(item => item.roles) || [] 
    };
  } catch (error) {
    console.error('Error getting user roles:', error);
    return { success: false, error };
  }
}

export async function checkUserHasRole(userId: string, roleName: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .select(`
        roles!inner (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('roles.name', roleName)
      .maybeSingle();

    if (error) throw error;
    return { success: true, hasRole: !!data };
  } catch (error) {
    console.error('Error checking user role:', error);
    return { success: false, error };
  }
}

export async function getAllUsers() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    return { success: true, users: data.users };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, error };
  }
}

export async function getAllRoles() {
  try {
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return { success: true, roles: data };
  } catch (error) {
    console.error('Error getting roles:', error);
    return { success: false, error };
  }
}