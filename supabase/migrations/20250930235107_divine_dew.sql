/*
  # Set default Free subscription for new users

  1. New Tables
    - No new tables created
  
  2. Changes
    - Update handle_new_user function to automatically create Free subscription
    - Ensure all new users get Free plan by default
  
  3. Security
    - Maintains existing RLS policies
    - No security changes needed
*/

-- Update the handle_new_user function to create a default Free subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Insert default Free subscription
  INSERT INTO public.user_subscriptions (user_id, plan)
  VALUES (new.id, 'free');
  
  RETURN new;
END;
$$;