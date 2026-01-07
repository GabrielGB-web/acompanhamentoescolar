-- Fix permissive RLS policies to require authentication

-- Students table
DROP POLICY IF EXISTS "Allow all access to students" ON public.students;

CREATE POLICY "Authenticated users can view students"
ON public.students
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete students"
ON public.students
FOR DELETE
TO authenticated
USING (true);

-- Teachers table
DROP POLICY IF EXISTS "Allow all access to teachers" ON public.teachers;

CREATE POLICY "Authenticated users can view teachers"
ON public.teachers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert teachers"
ON public.teachers
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update teachers"
ON public.teachers
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete teachers"
ON public.teachers
FOR DELETE
TO authenticated
USING (true);

-- Lessons table
DROP POLICY IF EXISTS "Allow all access to lessons" ON public.lessons;

CREATE POLICY "Authenticated users can view lessons"
ON public.lessons
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert lessons"
ON public.lessons
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update lessons"
ON public.lessons
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete lessons"
ON public.lessons
FOR DELETE
TO authenticated
USING (true);

-- Receipts table
DROP POLICY IF EXISTS "Allow all access to receipts" ON public.receipts;

CREATE POLICY "Authenticated users can view receipts"
ON public.receipts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert receipts"
ON public.receipts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update receipts"
ON public.receipts
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete receipts"
ON public.receipts
FOR DELETE
TO authenticated
USING (true);

-- Events table
DROP POLICY IF EXISTS "Allow all access to events" ON public.events;

CREATE POLICY "Authenticated users can view events"
ON public.events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (true);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'name', new.email), new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();