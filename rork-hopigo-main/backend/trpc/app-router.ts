import { createTRPCRouter } from "./create-context";

// Import route modules
import { authRouter } from "./routes/auth/router";
import { marketplaceRouter } from "./routes/marketplace/router";
import { walletRouter } from "./routes/wallet/router";
import { notificationRouter } from "./routes/notification/router";
import { taxiRouter } from "./routes/taxi/router";
import { providerRouter } from "./routes/provider/router";
import { bookingRouter } from "./routes/booking/router";
import { userRouter } from "./routes/user/router";

// Legacy example route
import hiRoute from "./routes/example/hi/route";

export const appRouter = createTRPCRouter({
  // Legacy example - can be removed in production
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  
  // Core API modules
  auth: authRouter,
  user: userRouter,
  marketplace: marketplaceRouter,
  wallet: walletRouter,
  notifications: notificationRouter,
  taxi: taxiRouter,
  provider: providerRouter,
  booking: bookingRouter,
});

export type AppRouter = typeof appRouter;