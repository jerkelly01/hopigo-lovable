import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils';
import UsersPage from '@/pages/UsersPage';

// Mock the hooks
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock('@/hooks/useRoles', () => ({
  useRoles: () => ({
    roles: [
      { id: '1', name: 'admin', description: 'Administrator' },
      { id: '2', name: 'user', description: 'Regular User' },
    ],
    loading: false,
    assignRole: vi.fn(),
    removeRole: vi.fn(),
  }),
}));

vi.mock('@/hooks/useDataExport', () => ({
  useDataExport: () => ({
    exportCSV: vi.fn(),
    exportJSON: vi.fn(),
    exporting: false,
  }),
}));

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title and description', async () => {
    render(<UsersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Users Management')).toBeInTheDocument();
      expect(screen.getByText(/Manage user accounts, roles, and permissions/)).toBeInTheDocument();
    });
  });

  it('renders search and filter components', async () => {
    render(<UsersPage />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search users/i)).toBeInTheDocument();
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });

  it('renders export buttons', async () => {
    render(<UsersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Export JSON')).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    render(<UsersPage />);
    
    const searchInput = await screen.findByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'test user' } });
    
    expect(searchInput).toHaveValue('test user');
  });

  it('displays loading state initially', () => {
    render(<UsersPage />);
    
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });
});