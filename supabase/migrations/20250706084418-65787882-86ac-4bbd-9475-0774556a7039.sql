-- Database Performance Optimizations
-- Add indexes for unindexed foreign keys and remove unused indexes

-- 1. Add indexes for unindexed foreign keys (improves query performance)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON public.event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON public.service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- 2. Remove unused indexes (frees up storage and improves write performance)
DROP INDEX IF EXISTS idx_notifications_is_read;
DROP INDEX IF EXISTS idx_payments_type;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_user_type;
DROP INDEX IF EXISTS idx_users_verification_status;
DROP INDEX IF EXISTS idx_service_providers_category;
DROP INDEX IF EXISTS idx_service_providers_rating;
DROP INDEX IF EXISTS idx_ride_drivers_is_online;
DROP INDEX IF EXISTS idx_ride_drivers_rating;
DROP INDEX IF EXISTS idx_services_provider_id;
DROP INDEX IF EXISTS idx_services_category;
DROP INDEX IF EXISTS idx_service_bookings_customer_id;
DROP INDEX IF EXISTS idx_service_bookings_provider_id;
DROP INDEX IF EXISTS idx_service_bookings_status;
DROP INDEX IF EXISTS idx_ride_bookings_customer_id;
DROP INDEX IF EXISTS idx_ride_bookings_driver_id;
DROP INDEX IF EXISTS idx_ride_bookings_status;
DROP INDEX IF EXISTS idx_bills_status;
DROP INDEX IF EXISTS idx_bills_due_date;
DROP INDEX IF EXISTS idx_activities_type;
DROP INDEX IF EXISTS idx_activities_created_at;
DROP INDEX IF EXISTS idx_events_category;