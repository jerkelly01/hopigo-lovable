export interface ProviderService {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const providerServices: ProviderService[] = [
  {
    id: 'training',
    name: 'Training',
    icon: 'graduation-cap',
    description: 'Skill development courses',
    color: '#4ECDC4',
  },
  {
    id: 'resources',
    name: 'Resources',
    icon: 'book-open',
    description: 'Tools and guides',
    color: '#6C5CE7',
  },
  {
    id: 'community',
    name: 'Community',
    icon: 'users',
    description: 'Connect with providers',
    color: '#A8E6CF',
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: 'wrench',
    description: 'Business management',
    color: '#FFD93D',
  },
  {
    id: 'support',
    name: 'Support',
    icon: 'headphones',
    description: 'Get help and assistance',
    color: '#FF8A80',
  },
  {
    id: 'insights',
    name: 'Insights',
    icon: 'trending-up',
    description: 'Performance analytics',
    color: '#FF6B6B',
  },
];