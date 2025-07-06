import { publicProcedure } from "../../create-context";

export const getFeaturedServicesProcedure = publicProcedure.query(async () => {
  // Mock featured services
  return [
    {
      id: "service-1",
      name: "House Cleaning",
      description: "Professional house cleaning service",
      price: 45.00,
      duration: 120,
      category: "cleaning",
      providerId: "provider-1",
      providerName: "Clean Pro Services",
      rating: 4.8,
      reviewCount: 127,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
      isPopular: true,
    },
    {
      id: "service-2",
      name: "Lawn Mowing",
      description: "Professional lawn mowing and maintenance",
      price: 25.00,
      duration: 60,
      category: "landscaping",
      providerId: "provider-2",
      providerName: "Green Thumb Landscaping",
      rating: 4.6,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      isPopular: true,
    },
  ];
});