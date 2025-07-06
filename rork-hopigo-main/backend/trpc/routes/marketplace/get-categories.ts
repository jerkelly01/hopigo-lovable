import { publicProcedure } from "../../create-context";

export const getCategoriesProcedure = publicProcedure.query(async () => {
  // Mock categories
  return [
    {
      id: "cleaning",
      name: "Cleaning",
      icon: "🧹",
      serviceCount: 45,
      isPopular: true,
    },
    {
      id: "landscaping",
      name: "Landscaping",
      icon: "🌱",
      serviceCount: 32,
      isPopular: true,
    },
    {
      id: "plumbing",
      name: "Plumbing",
      icon: "🔧",
      serviceCount: 28,
      isPopular: false,
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: "⚡",
      serviceCount: 21,
      isPopular: false,
    },
  ];
});