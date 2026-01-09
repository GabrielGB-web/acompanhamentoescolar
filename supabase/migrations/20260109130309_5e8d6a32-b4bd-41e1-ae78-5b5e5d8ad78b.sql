-- Drop the overly permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more restrictive policy: users can only view their own profile, admins can view all
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles
FOR SELECT
USING (
  user_id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);