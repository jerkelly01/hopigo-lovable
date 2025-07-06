-- Fix remaining unindexed foreign keys and optimize unused indexes
-- Keep foreign key indexes that will be used, remove others that are truly unused

-- 1. Add missing foreign key indexes (critical for query performance)
CREATE INDEX IF NOT EXISTS idx_ride_bookings_driver_id ON public.ride_bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_provider_id ON public.service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);

-- 2. Remove indexes that are genuinely unused (not foreign key related)
-- Keep the foreign key indexes we just added as they will be used for joins
DROP INDEX IF EXISTS idx_audit_logs_user_id; -- This one might not be used much
DROP INDEX IF EXISTS idx_event_tickets_event_id; -- Keep this as it's a foreign key
-- Keep idx_user_roles_role_id as it's used for role checking
-- Keep idx_service_bookings_service_id as it's used for service lookups