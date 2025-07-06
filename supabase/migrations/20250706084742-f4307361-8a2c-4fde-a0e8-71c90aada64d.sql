-- Add missing foreign key indexes for optimal query performance
-- Foreign key indexes are essential for joins even if not used yet

-- Add indexes for remaining unindexed foreign keys
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON public.event_tickets(event_id);

-- Note: Keep all other foreign key indexes even if showing as "unused"
-- They are critical for query performance when joining tables:
-- - idx_user_roles_role_id: Used by is_admin() and role checking functions
-- - idx_services_provider_id: Essential for service-provider joins
-- - idx_service_bookings_service_id: Critical for booking-service joins  
-- - idx_service_bookings_provider_id: Important for provider booking queries
-- - idx_ride_bookings_driver_id: Essential for driver booking queries