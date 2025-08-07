-- Security Fixes Migration
-- Fix search path vulnerabilities and enable RLS on missing tables

-- 1. Fix search path for remaining functions that don't have it set
-- These functions need SET search_path = 'public' to prevent search path attacks

CREATE OR REPLACE FUNCTION public.transfer_money(sender_id uuid, recipient_id uuid, transfer_amount numeric, transfer_description text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  sender_wallet_id uuid;
  recipient_wallet_id uuid;
  transaction_id uuid;
BEGIN
  -- Get sender wallet
  SELECT id INTO sender_wallet_id
  FROM wallets
  WHERE user_id = sender_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sender wallet not found';
  END IF;
  
  -- Get recipient wallet
  SELECT id INTO recipient_wallet_id
  FROM wallets
  WHERE user_id = recipient_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recipient wallet not found';
  END IF;
  
  -- Check if sender has sufficient funds
  IF (SELECT balance FROM wallets WHERE id = sender_wallet_id) < transfer_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  
  -- Deduct from sender's wallet
  UPDATE wallets
  SET balance = balance - transfer_amount,
      updated_at = now()
  WHERE id = sender_wallet_id;
  
  -- Add to recipient's wallet
  UPDATE wallets
  SET balance = balance + transfer_amount,
      updated_at = now()
  WHERE id = recipient_wallet_id;
  
  -- Create transaction record for sender (outgoing)
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    currency,
    description,
    status,
    recipient_id,
    created_at
  ) VALUES (
    sender_id,
    'transfer',
    -transfer_amount,
    'AWG',
    transfer_description,
    'completed',
    recipient_id,
    now()
  );
  
  -- Create transaction record for recipient (incoming)
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    currency,
    description,
    status,
    recipient_id,
    created_at
  ) VALUES (
    recipient_id,
    'transfer',
    transfer_amount,
    'AWG',
    transfer_description,
    'completed',
    sender_id,
    now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_fraud_risk(p_user_id uuid, p_action_type text, p_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    risk_score INTEGER := 0;
    risk_factors JSONB := '[]'::jsonb;
    rule_record RECORD;
    result JSONB;
BEGIN
    -- Check fraud rules
    FOR rule_record IN 
        SELECT * FROM fraud_rules 
        WHERE is_active = true 
        AND rule_type = p_action_type
        ORDER BY priority DESC
    LOOP
        -- Apply rule conditions (simplified logic)
        IF rule_record.conditions->>'max_amount' IS NOT NULL THEN
            IF (p_data->>'amount')::DECIMAL > (rule_record.conditions->>'max_amount')::DECIMAL THEN
                risk_score := risk_score + 10;
                risk_factors := risk_factors || jsonb_build_object('rule', rule_record.name, 'factor', 'amount_exceeded');
            END IF;
        END IF;
        
        IF rule_record.conditions->>'suspicious_location' IS NOT NULL THEN
            -- Add location-based checks here
            risk_score := risk_score + 5;
            risk_factors := risk_factors || jsonb_build_object('rule', rule_record.name, 'factor', 'suspicious_location');
        END IF;
    END LOOP;
    
    -- Log security event if risk is high
    IF risk_score > 50 THEN
        INSERT INTO security_events (user_id, event_type, severity, description, metadata)
        VALUES (
            p_user_id,
            'suspicious_activity',
            CASE 
                WHEN risk_score > 80 THEN 'critical'
                WHEN risk_score > 60 THEN 'high'
                ELSE 'medium'
            END,
            'High fraud risk detected for ' || p_action_type,
            jsonb_build_object('risk_score', risk_score, 'risk_factors', risk_factors, 'action_data', p_data)
        );
    END IF;
    
    result := jsonb_build_object(
        'risk_score', risk_score,
        'risk_level', CASE 
            WHEN risk_score > 80 THEN 'critical'
            WHEN risk_score > 60 THEN 'high'
            WHEN risk_score > 30 THEN 'medium'
            ELSE 'low'
        END,
        'risk_factors', risk_factors,
        'recommendation', CASE 
            WHEN risk_score > 80 THEN 'block'
            WHEN risk_score > 60 THEN 'review'
            WHEN risk_score > 30 THEN 'monitor'
            ELSE 'allow'
        END
    );
    
    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_recommendations(p_user_id uuid, p_recommendation_type text, p_limit integer DEFAULT 5)
 RETURNS TABLE(item_id uuid, item_type text, score numeric, reason text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    -- Simple recommendation logic (can be enhanced with ML models)
    RETURN QUERY
    SELECT 
        sp.id::UUID,
        'service_provider'::TEXT,
        (0.8 + random() * 0.2)::DECIMAL(5,4) as score,
        'Based on your preferences and ratings'::TEXT as reason
    FROM service_providers sp
    WHERE sp.verified = true
    ORDER BY sp.rating DESC, random()
    LIMIT p_limit;
END;
$function$;

CREATE OR REPLACE FUNCTION public.analyze_sentiment(p_text text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    positive_words TEXT[] := ARRAY['good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'like', 'happy', 'satisfied'];
    negative_words TEXT[] := ARRAY['bad', 'terrible', 'awful', 'horrible', 'disappointed', 'hate', 'dislike', 'angry', 'frustrated', 'poor'];
    word_count INTEGER;
    positive_count INTEGER := 0;
    negative_count INTEGER := 0;
    sentiment_score DECIMAL(5,4);
    sentiment_label TEXT;
    result JSONB;
BEGIN
    -- Simple sentiment analysis
    word_count := array_length(string_to_array(lower(p_text), ' '), 1);
    
    -- Count positive words
    FOR i IN 1..array_length(positive_words, 1) LOOP
        positive_count := positive_count + 
            (length(p_text) - length(replace(lower(p_text), positive_words[i], ''))) / length(positive_words[i]);
    END LOOP;
    
    -- Count negative words
    FOR i IN 1..array_length(negative_words, 1) LOOP
        negative_count := negative_count + 
            (length(p_text) - length(replace(lower(p_text), negative_words[i], ''))) / length(negative_words[i]);
    END LOOP;
    
    -- Calculate sentiment score
    IF word_count > 0 THEN
        sentiment_score := (positive_count - negative_count)::DECIMAL / word_count;
    ELSE
        sentiment_score := 0;
    END IF;
    
    -- Determine sentiment label
    IF sentiment_score > 0.1 THEN
        sentiment_label := 'positive';
    ELSIF sentiment_score < -0.1 THEN
        sentiment_label := 'negative';
    ELSE
        sentiment_label := 'neutral';
    END IF;
    
    result := jsonb_build_object(
        'sentiment_score', sentiment_score,
        'sentiment_label', sentiment_label,
        'positive_words', positive_count,
        'negative_words', negative_count,
        'total_words', word_count
    );
    
    RETURN result;
END;
$function$;

-- Fix all other functions with missing search path
CREATE OR REPLACE FUNCTION public.update_rental_photos_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_level()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
    new_level_id UUID;
BEGIN
    -- Find the appropriate level based on points
    SELECT id INTO new_level_id
    FROM program_levels
    WHERE program_id = NEW.program_id
    AND NEW.points >= requirement_min
    AND (requirement_max IS NULL OR NEW.points <= requirement_max)
    ORDER BY requirement_min DESC
    LIMIT 1;
    
    -- Update user level if changed
    IF new_level_id IS NOT NULL AND new_level_id != NEW.current_level_id THEN
        NEW.current_level_id := new_level_id;
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_deal_purchase_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE deals 
        SET current_purchases = current_purchases + 1
        WHERE id = NEW.deal_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE deals 
        SET current_purchases = current_purchases - 1
        WHERE id = OLD.deal_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_redemption_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.redemption_code := 'DEAL-' || substr(md5(random()::text), 1, 8);
    NEW.qr_code := 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' || NEW.redemption_code;
    RETURN NEW;
END;
$function$;

-- Continue with remaining functions that need search path fixes
CREATE OR REPLACE FUNCTION public.update_notification_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
   BEGIN
     NEW.updated_at = now();
     RETURN NEW;
   END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invite_code()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
    code TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        -- Generate a random 8-character code
        code := upper(substr(md5(random()::text), 1, 8));
        
        -- Check if code already exists
        IF NOT EXISTS (SELECT 1 FROM invite_codes WHERE invite_codes.code = code) THEN
            RETURN code;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Unable to generate unique invite code after 100 attempts';
        END IF;
    END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_invite_code_usage()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE invite_codes 
        SET current_uses = current_uses + 1
        WHERE id = NEW.invite_code_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE invite_codes 
        SET current_uses = current_uses - 1
        WHERE id = OLD.invite_code_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_referral_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    -- Only process when status changes to 'completed'
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Create rewards for both referrer and referred user
        INSERT INTO referral_rewards (referral_id, user_id, reward_type, amount, currency)
        VALUES 
            (NEW.id, NEW.referrer_id, 'referrer', NEW.reward_amount, NEW.currency),
            (NEW.id, NEW.referred_id, 'referred', NEW.reward_amount, NEW.currency);
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_photos_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$function$;

-- Continue with more functions that need search path
CREATE OR REPLACE FUNCTION public.generate_ticket_number(event_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
    event_prefix TEXT;
    ticket_count INTEGER;
    ticket_number TEXT;
BEGIN
    -- Get event prefix (first 3 letters of title)
    SELECT UPPER(LEFT(REPLACE(title, ' ', ''), 3)) INTO event_prefix
    FROM events WHERE id = event_id;
    
    -- Get count of existing tickets for this event
    SELECT COALESCE(COUNT(*), 0) + 1 INTO ticket_count
    FROM tickets WHERE event_id = generate_ticket_number.event_id;
    
    -- Generate ticket number
    ticket_number := event_prefix || '-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(ticket_count::TEXT, 3, '0');
    
    RETURN ticket_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_event_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    -- Update event rating when ratings change
    UPDATE events 
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM event_ratings 
            WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM event_ratings 
            WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
        )
    WHERE id = COALESCE(NEW.event_id, OLD.event_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- 2. Enable RLS on tables that are missing it
-- These tables were identified as having no RLS but containing sensitive data

-- Check if tables exist before altering (some may not exist in this schema)
DO $$
BEGIN
    -- Enable RLS on payment_plans if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_plans' AND table_schema = 'public') THEN
        ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
        
        -- Add basic RLS policy for payment_plans
        CREATE POLICY "Users can view payment plans"
        ON public.payment_plans FOR SELECT
        TO authenticated
        USING (true); -- Payment plans are generally public info
        
        CREATE POLICY "Only admins can modify payment plans"
        ON public.payment_plans FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
    
    -- Enable RLS on security_activities if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'security_activities' AND table_schema = 'public') THEN
        ALTER TABLE public.security_activities ENABLE ROW LEVEL SECURITY;
        
        -- Add RLS policy for security_activities
        CREATE POLICY "Users can view their own security activities"
        ON public.security_activities FOR SELECT
        TO authenticated
        USING (user_id = auth.uid() OR public.is_admin());
        
        CREATE POLICY "Only system can insert security activities"
        ON public.security_activities FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());
    END IF;
    
    -- Enable RLS on subscriptions if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions' AND table_schema = 'public') THEN
        ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
        
        -- Add RLS policy for subscriptions
        CREATE POLICY "Users can view their own subscriptions"
        ON public.subscriptions FOR SELECT
        TO authenticated
        USING (user_id = auth.uid() OR public.is_admin());
        
        CREATE POLICY "Users can manage their own subscriptions"
        ON public.subscriptions FOR ALL
        TO authenticated
        USING (user_id = auth.uid() OR public.is_admin())
        WITH CHECK (user_id = auth.uid() OR public.is_admin());
    END IF;
    
    -- Enable RLS on user_security_settings if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_security_settings' AND table_schema = 'public') THEN
        ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;
        
        -- Add RLS policy for user_security_settings
        CREATE POLICY "Users can manage their own security settings"
        ON public.user_security_settings FOR ALL
        TO authenticated
        USING (user_id = auth.uid() OR public.is_admin())
        WITH CHECK (user_id = auth.uid() OR public.is_admin());
    END IF;
END
$$;