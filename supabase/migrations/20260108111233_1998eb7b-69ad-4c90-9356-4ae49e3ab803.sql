-- Allow public access to students by access_code (read only)
CREATE POLICY "Public can view students by access code" 
ON public.students 
FOR SELECT 
TO anon
USING (access_code IS NOT NULL);

-- Allow public access to lessons for students with access codes (read only)
CREATE POLICY "Public can view lessons for students with access codes" 
ON public.lessons 
FOR SELECT 
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = lessons.student_id 
    AND students.access_code IS NOT NULL
  )
);

-- Allow public access to teachers (only name for display)
CREATE POLICY "Public can view teachers" 
ON public.teachers 
FOR SELECT 
TO anon
USING (true);