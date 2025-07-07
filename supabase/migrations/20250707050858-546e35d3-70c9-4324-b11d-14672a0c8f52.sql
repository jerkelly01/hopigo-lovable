-- Remove earnings tracking from taxi drivers and ride bookings

-- Remove total_earnings column from ride_drivers table
ALTER TABLE ride_drivers DROP COLUMN IF EXISTS total_earnings;

-- Remove fare_amount column from ride_bookings table  
ALTER TABLE ride_bookings DROP COLUMN IF EXISTS fare_amount;