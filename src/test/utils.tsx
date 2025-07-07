import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from 'next-themes';
import { vi } from 'vitest';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
export { waitFor, screen, fireEvent };

// Mock implementations for common hooks and modules
export const mockSupabaseClient = {
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      list: vi.fn(),
    })),
  },
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  recovery_sent_at: new Date().toISOString(),
  email_change_sent_at: new Date().toISOString(),
  new_email: null,
  invited_at: null,
  action_link: null,
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  identities: [],
  factors: [],
  ...overrides,
});

export const createMockRole = (overrides = {}) => ({
  id: 'test-role-id',
  name: 'test-role',
  description: 'Test Role Description',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockNotification = (overrides = {}) => ({
  id: 'test-notification-id',
  user_id: 'test-user-id',
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info',
  is_read: false,
  created_at: new Date().toISOString(),
  ...overrides,
});