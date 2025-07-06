export interface FeaturedService {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const featuredServices: FeaturedService[] = [
  {
    id: 'emergency',
    name: 'Emergency',
    icon: 'alert-triangle',
    description: 'Urgent help when you need it',
    color: '#FF6B6B',
  },
  {
    id: 'booking',
    name: 'My Bookings',
    icon: 'calendar',
    description: 'View and manage bookings',
    color: '#4ECDC4',
  },
  {
    id: 'favorites',
    name: 'Favorites',
    icon: 'heart',
    description: 'Your saved providers',
    color: '#FF8A80',
  },
  {
    id: 'reviews',
    name: 'Reviews',
    icon: 'star',
    description: 'Rate your experiences',
    color: '#FFD93D',
  },
  {
    id: 'support',
    name: 'Support',
    icon: 'help-circle',
    description: 'Get help and assistance',
    color: '#6C5CE7',
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: 'gift',
    description: 'Earn points and rewards',
    color: '#A8E6CF',
  },
];