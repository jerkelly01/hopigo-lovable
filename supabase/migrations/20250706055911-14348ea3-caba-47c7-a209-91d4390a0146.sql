
-- Create missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_provider_id ON service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_ride_bookings_customer_id ON ride_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_ride_bookings_driver_id ON ride_bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Add missing foreign key constraints
ALTER TABLE services 
ADD CONSTRAINT fk_services_provider_id 
FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE;

ALTER TABLE service_bookings 
ADD CONSTRAINT fk_service_bookings_customer_id 
FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE service_bookings 
ADD CONSTRAINT fk_service_bookings_provider_id 
FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE;

ALTER TABLE service_bookings 
ADD CONSTRAINT fk_service_bookings_service_id 
FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;

ALTER TABLE ride_bookings 
ADD CONSTRAINT fk_ride_bookings_customer_id 
FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE ride_bookings 
ADD CONSTRAINT fk_ride_bookings_driver_id 
FOREIGN KEY (driver_id) REFERENCES ride_drivers(id) ON DELETE SET NULL;

ALTER TABLE money_transfers 
ADD CONSTRAINT fk_money_transfers_sender_id 
FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE money_transfers 
ADD CONSTRAINT fk_money_transfers_receiver_id 
FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sender's balance for money transfers
  IF TG_TABLE_NAME = 'money_transfers' AND NEW.status = 'completed' THEN
    UPDATE users 
    SET wallet_balance = wallet_balance - NEW.amount 
    WHERE id = NEW.sender_id;
    
    UPDATE users 
    SET wallet_balance = wallet_balance + NEW.amount 
    WHERE id = NEW.receiver_id;
  END IF;
  
  -- Update balance for payments
  IF TG_TABLE_NAME = 'payments' AND NEW.status = 'completed' THEN
    IF NEW.type = 'add_funds' THEN
      UPDATE users 
      SET wallet_balance = wallet_balance + NEW.amount 
      WHERE id = NEW.user_id;
    ELSIF NEW.type = 'service_payment' OR NEW.type = 'ride_payment' THEN
      UPDATE users 
      SET wallet_balance = wallet_balance - NEW.amount 
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for wallet balance updates
DROP TRIGGER IF EXISTS trigger_update_wallet_balance_transfers ON money_transfers;
CREATE TRIGGER trigger_update_wallet_balance_transfers
  AFTER UPDATE ON money_transfers
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_wallet_balance();

DROP TRIGGER IF EXISTS trigger_update_wallet_balance_payments ON payments;
CREATE TRIGGER trigger_update_wallet_balance_payments
  AFTER UPDATE ON payments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_wallet_balance();

-- Create function to award loyalty points
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award points for completed service bookings
  IF TG_TABLE_NAME = 'service_bookings' AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO loyalty_transactions (user_id, points, transaction_type, description)
    VALUES (NEW.customer_id, FLOOR(NEW.total_amount / 10), 'earned', 'Service booking completion');
    
    UPDATE users 
    SET loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 10)
    WHERE id = NEW.customer_id;
  END IF;
  
  -- Award points for completed ride bookings
  IF TG_TABLE_NAME = 'ride_bookings' AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO loyalty_transactions (user_id, points, transaction_type, description)
    VALUES (NEW.customer_id, FLOOR(NEW.fare_amount / 5), 'earned', 'Ride completion');
    
    UPDATE users 
    SET loyalty_points = loyalty_points + FLOOR(NEW.fare_amount / 5)
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for loyalty points
DROP TRIGGER IF EXISTS trigger_award_loyalty_points_services ON service_bookings;
CREATE TRIGGER trigger_award_loyalty_points_services
  AFTER UPDATE ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION award_loyalty_points();

DROP TRIGGER IF EXISTS trigger_award_loyalty_points_rides ON ride_bookings;
CREATE TRIGGER trigger_award_loyalty_points_rides
  AFTER UPDATE ON ride_bookings
  FOR EACH ROW
  EXECUTE FUNCTION award_loyalty_points();

-- Create function to send notifications
CREATE OR REPLACE FUNCTION create_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Service booking notifications
  IF TG_TABLE_NAME = 'service_bookings' THEN
    IF NEW.status = 'pending' AND OLD.status IS NULL THEN
      -- Notify provider of new booking
      INSERT INTO notifications (user_id, type, title, message)
      SELECT sp.user_id, 'booking', 'New Service Booking', 
             'You have a new booking request for ' || s.title
      FROM service_providers sp
      JOIN services s ON s.provider_id = sp.id
      WHERE sp.id = NEW.provider_id AND s.id = NEW.service_id;
    ELSIF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
      -- Notify customer of accepted booking
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (NEW.customer_id, 'booking', 'Booking Accepted', 'Your service booking has been accepted!');
    END IF;
  END IF;
  
  -- Money transfer notifications
  IF TG_TABLE_NAME = 'money_transfers' AND NEW.status = 'completed' THEN
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (NEW.receiver_id, 'payment', 'Money Received', 
            'You received ' || NEW.amount || ' AWG from another user');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notification triggers
DROP TRIGGER IF EXISTS trigger_service_booking_notifications ON service_bookings;
CREATE TRIGGER trigger_service_booking_notifications
  AFTER INSERT OR UPDATE ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_notification();

DROP TRIGGER IF EXISTS trigger_money_transfer_notifications ON money_transfers;
CREATE TRIGGER trigger_money_transfer_notifications
  AFTER UPDATE ON money_transfers
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION create_notification();

-- Enable realtime for key tables
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE service_bookings REPLICA IDENTITY FULL;
ALTER TABLE ride_bookings REPLICA IDENTITY FULL;
ALTER TABLE money_transfers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE service_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE ride_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE money_transfers;

-- Insert some sample data for development
INSERT INTO service_providers (user_id, business_name, description, category) VALUES
(auth.uid(), 'Clean Pro Services', 'Professional cleaning services for homes and offices', 'cleaning'),
(auth.uid(), 'Green Thumb Landscaping', 'Complete landscaping and garden maintenance', 'landscaping'),
(auth.uid(), 'HandyFix Solutions', 'Home repairs and maintenance services', 'handyman')
ON CONFLICT DO NOTHING;

INSERT INTO services (provider_id, title, description, category, price, duration_minutes) 
SELECT sp.id, 'House Cleaning', 'Complete house cleaning service', 'cleaning', 45.00, 120
FROM service_providers sp WHERE sp.business_name = 'Clean Pro Services'
ON CONFLICT DO NOTHING;

INSERT INTO services (provider_id, title, description, category, price, duration_minutes) 
SELECT sp.id, 'Lawn Mowing', 'Professional lawn mowing and trimming', 'landscaping', 25.00, 60
FROM service_providers sp WHERE sp.business_name = 'Green Thumb Landscaping'
ON CONFLICT DO NOTHING;

INSERT INTO events (title, description, category, venue, event_date, ticket_price, total_tickets, available_tickets) VALUES
('Aruba Music Festival', 'Annual music festival featuring local and international artists', 'music', 'Eagle Beach Arena', '2024-08-15 19:00:00+00', 75.00, 1000, 850),
('Food & Wine Expo', 'Taste the best of Aruban cuisine and international wines', 'food', 'Renaissance Convention Center', '2024-07-20 16:00:00+00', 35.00, 500, 420)
ON CONFLICT DO NOTHING;

INSERT INTO loyalty_programs (name, description, reward_type, points_required, reward_value) VALUES
('Free Service Credit', 'Get AWG 10 credit for services', 'service_credit', 100, 10.00),
('Ride Discount', 'Get 20% off your next ride', 'ride_discount', 50, 5.00),
('VIP Status', 'Unlock VIP benefits and priority booking', 'vip_status', 500, 0.00)
ON CONFLICT DO NOTHING;
