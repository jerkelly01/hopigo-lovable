export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  onPress?: () => void;
}

export const advertisements: Advertisement[] = [
  {
    id: '1',
    title: 'Luxury Beach Getaway',
    description: 'Experience paradise with our exclusive 30% discount on all beach resorts this month.',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#FFFFFF',
    buttonText: 'Book Now',
  },
  {
    id: '2',
    title: 'Premium Car Rental',
    description: 'Explore the island in style with our luxury fleet. Free upgrade for bookings this week.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#FFFFFF',
    buttonText: 'Reserve',
  },
  {
    id: '3',
    title: 'Professional Car Detailing',
    description: 'Transform your vehicle with our premium detailing service. 25% off for first-time customers.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#FFFFFF',
    buttonText: 'Schedule Now',
  },
  {
    id: '4',
    title: 'Wellness Retreat',
    description: 'Rejuvenate your mind and body with our all-inclusive spa packages. Book a session today.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#FFFFFF',
    buttonText: 'Discover',
  },
  {
    id: '5',
    title: 'Thrilling Water Adventures',
    description: 'From jet skiing to parasailing, experience the ultimate adrenaline rush on crystal clear waters.',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#FFFFFF',
    buttonText: 'Explore Activities',
  },
];