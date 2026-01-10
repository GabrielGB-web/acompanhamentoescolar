
-- Events table: Update policies to check for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON public.events;

CREATE POLICY "Authenticated users can view events" ON public.events
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert events" ON public.events
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update events" ON public.events
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete events" ON public.events
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Lessons table: Update policies to check for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated users can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated users can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated users can delete lessons" ON public.lessons;

CREATE POLICY "Authenticated users can view lessons" ON public.lessons
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert lessons" ON public.lessons
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update lessons" ON public.lessons
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete lessons" ON public.lessons
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Students table: Update policies to check for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can insert students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can update students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can delete students" ON public.students;

CREATE POLICY "Authenticated users can view students" ON public.students
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert students" ON public.students
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update students" ON public.students
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete students" ON public.students
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Receipts table: Update policies to check for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view receipts" ON public.receipts;
DROP POLICY IF EXISTS "Authenticated users can insert receipts" ON public.receipts;
DROP POLICY IF EXISTS "Authenticated users can update receipts" ON public.receipts;
DROP POLICY IF EXISTS "Authenticated users can delete receipts" ON public.receipts;

CREATE POLICY "Authenticated users can view receipts" ON public.receipts
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert receipts" ON public.receipts
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update receipts" ON public.receipts
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete receipts" ON public.receipts
FOR DELETE USING (auth.uid() IS NOT NULL);
