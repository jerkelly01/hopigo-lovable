import { ServiceProvider } from '@/types/marketplace';

export const providers: ServiceProvider[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    services: ['house-cleaning', 'deep-cleaning', 'move-cleaning'],
    description: 'Professional cleaner with 5+ years of experience. I take pride in making your home spotless and comfortable.',
    serviceDescription: 'Professional house cleaning and deep sanitization services',
    location: 'Oranjestad',
    category: '2',
    pricing: {
      'house-cleaning': {
        amount: 25,
        currency: 'AWG',
        description: 'Regular house cleaning per hour'
      },
      'deep-cleaning': {
        amount: 40,
        currency: 'AWG',
        description: 'Deep cleaning service per hour'
      },
      'move-cleaning': {
        amount: 35,
        currency: 'AWG',
        description: 'Move-in/Move-out cleaning per hour'
      }
    },
    availability: 'Mon-Sat: 8AM-6PM',
    responseTime: '< 1 hour',
    completedJobs: 127,
    tags: ['cleaning', 'home-services', 'professional'],
    contact: {
      phone: '+297-123-4567',
      email: 'sarah.johnson@email.com',
      whatsapp: '+297-123-4567'
    }
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviewCount: 203,
    verified: true,
    services: ['plumbing-repair', 'pipe-installation', 'emergency-plumbing'],
    description: 'Licensed plumber with 8+ years of experience. Available for emergency calls 24/7.',
    serviceDescription: 'Expert plumbing repairs and installation services',
    location: 'San Nicolas',
    category: '2',
    pricing: {
      'plumbing-repair': {
        amount: 45,
        currency: 'AWG',
        description: 'General plumbing repairs per hour'
      },
      'pipe-installation': {
        amount: 65,
        currency: 'AWG',
        description: 'Pipe installation service per hour'
      },
      'emergency-plumbing': {
        amount: 80,
        currency: 'AWG',
        description: 'Emergency plumbing service per hour'
      }
    },
    availability: 'Daily: 7AM-7PM',
    responseTime: '< 30 min',
    completedJobs: 203,
    tags: ['plumbing', 'emergency', 'licensed'],
    contact: {
      phone: '+297-234-5678',
      email: 'mike.rodriguez@email.com',
      whatsapp: '+297-234-5678'
    }
  },
  {
    id: '3',
    name: 'Elena Vasquez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviewCount: 89,
    verified: true,
    services: ['electrical-repair', 'wiring-installation', 'lighting-setup'],
    description: 'Certified electrician specializing in residential and commercial electrical work.',
    serviceDescription: 'Professional electrical repairs and installations',
    location: 'Palm Beach',
    category: '2',
    pricing: {
      'electrical-repair': {
        amount: 50,
        currency: 'AWG',
        description: 'Electrical repair service per hour'
      },
      'wiring-installation': {
        amount: 70,
        currency: 'AWG',
        description: 'Wiring installation per hour'
      },
      'lighting-setup': {
        amount: 55,
        currency: 'AWG',
        description: 'Lighting setup service per hour'
      }
    },
    availability: 'Mon-Fri: 8AM-5PM',
    responseTime: '< 45 min',
    completedJobs: 89,
    tags: ['electrical', 'certified', 'residential'],
    contact: {
      phone: '+297-345-6789',
      email: 'elena.vasquez@email.com',
      whatsapp: '+297-345-6789'
    }
  },
  {
    id: '4',
    name: 'Carlos Martinez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviewCount: 145,
    verified: true,
    services: ['car-detailing', 'oil-change', 'car-wash'],
    description: 'Professional automotive specialist with expertise in car care and maintenance.',
    serviceDescription: 'Professional car detailing and maintenance services',
    location: 'Noord',
    category: '1',
    pricing: {
      'car-detailing': {
        amount: 50,
        currency: 'AWG',
        description: 'Complete car detailing service'
      },
      'oil-change': {
        amount: 30,
        currency: 'AWG',
        description: 'Oil change service'
      },
      'car-wash': {
        amount: 20,
        currency: 'AWG',
        description: 'Professional car wash'
      }
    },
    availability: 'Mon-Sat: 7AM-6PM',
    responseTime: '< 2 hours',
    completedJobs: 145,
    tags: ['automotive', 'detailing', 'maintenance'],
    contact: {
      phone: '+297-456-7890',
      email: 'carlos.martinez@email.com',
      whatsapp: '+297-456-7890'
    }
  },
  {
    id: '5',
    name: 'Lisa Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviewCount: 76,
    verified: true,
    services: ['massage-therapy', 'wellness-consultation', 'relaxation-therapy'],
    description: 'Licensed massage therapist specializing in therapeutic and relaxation treatments.',
    serviceDescription: 'Professional massage therapy and wellness treatments',
    location: 'Eagle Beach',
    category: '3',
    pricing: {
      'massage-therapy': {
        amount: 60,
        currency: 'AWG',
        description: 'Therapeutic massage session'
      },
      'wellness-consultation': {
        amount: 40,
        currency: 'AWG',
        description: 'Wellness consultation session'
      },
      'relaxation-therapy': {
        amount: 70,
        currency: 'AWG',
        description: 'Relaxation therapy session'
      }
    },
    availability: 'Mon-Sat: 9AM-6PM',
    responseTime: '< 1 hour',
    completedJobs: 76,
    tags: ['massage', 'wellness', 'therapy'],
    contact: {
      phone: '+297-567-8901',
      email: 'lisa.chen@email.com',
      whatsapp: '+297-567-8901'
    }
  },
  {
    id: '6',
    name: 'David Thompson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviewCount: 134,
    verified: true,
    services: ['landscaping', 'garden-maintenance', 'tree-trimming'],
    description: 'Professional landscaper with expertise in tropical garden design and maintenance.',
    serviceDescription: 'Professional landscaping and garden maintenance',
    location: 'Savaneta',
    category: '2',
    pricing: {
      'landscaping': {
        amount: 35,
        currency: 'AWG',
        description: 'Landscaping service per hour'
      },
      'garden-maintenance': {
        amount: 25,
        currency: 'AWG',
        description: 'Garden maintenance per hour'
      },
      'tree-trimming': {
        amount: 45,
        currency: 'AWG',
        description: 'Tree trimming service per hour'
      }
    },
    availability: 'Mon-Sat: 6AM-4PM',
    responseTime: '< 3 hours',
    completedJobs: 134,
    tags: ['landscaping', 'gardening', 'maintenance'],
    contact: {
      phone: '+297-678-9012',
      email: 'david.thompson@email.com',
      whatsapp: '+297-678-9012'
    }
  }
];

// Legacy Provider interface for backward compatibility
export interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  serviceDescription: string;
  serviceImage: string;
  category: string;
  price: string;
  location: string;
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  availability: 'available' | 'busy' | 'offline';
  services: string[];
  bio: string;
  experience: string;
  languages: string[];
  certifications: string[];
  portfolio: string[];
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
}