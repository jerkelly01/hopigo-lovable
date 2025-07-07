import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthContext } from '@/components/AuthProvider';
import { createMockUser, waitFor } from '../utils';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null user when not authenticated', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuthContext());

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should return user when authenticated', async () => {
    const mockUser = createMockUser();
    const { supabase } = await import('@/integrations/supabase/client');
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { 
        session: { 
          user: mockUser,
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Date.now() + 3600000
        } 
      },
      error: null,
    });

    const { result } = renderHook(() => useAuthContext());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle sign out', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuthContext());

    await result.current.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});