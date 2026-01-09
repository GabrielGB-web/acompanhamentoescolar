-- Drop the insecure public policies
DROP POLICY IF EXISTS "Public can view students by access code" ON public.students;
DROP POLICY IF EXISTS "Public can view lessons for students with access codes" ON public.lessons;

-- Create secure RPC function to get student info by access code
CREATE OR REPLACE FUNCTION public.get_student_by_access_code(code TEXT)
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  student_grade TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate code format (8 uppercase hex characters)
  IF code IS NULL OR code !~ '^[A-Fa-f0-9]{8}$' THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    s.id as student_id,
    s.name as student_name,
    s.grade as student_grade
  FROM public.students s
  WHERE s.access_code = UPPER(code);
END;
$$;

-- Grant execute to anon for public agenda access
GRANT EXECUTE ON FUNCTION public.get_student_by_access_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_student_by_access_code(TEXT) TO authenticated;

-- Create secure RPC function to get lessons by access code
CREATE OR REPLACE FUNCTION public.get_lessons_by_access_code(code TEXT)
RETURNS TABLE (
  lesson_id UUID,
  lesson_date DATE,
  lesson_time TIME,
  lesson_subject TEXT,
  lesson_duration TEXT,
  lesson_status lesson_status,
  teacher_name TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  student_id_var UUID;
BEGIN
  -- Validate code format (8 uppercase hex characters)
  IF code IS NULL OR code !~ '^[A-Fa-f0-9]{8}$' THEN
    RETURN;
  END IF;
  
  -- Get student ID for the access code
  SELECT s.id INTO student_id_var
  FROM public.students s
  WHERE s.access_code = UPPER(code);
  
  IF student_id_var IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    l.id as lesson_id,
    l.date as lesson_date,
    l.time as lesson_time,
    l.subject as lesson_subject,
    l.duration as lesson_duration,
    l.status as lesson_status,
    t.name as teacher_name
  FROM public.lessons l
  INNER JOIN public.teachers t ON l.teacher_id = t.id
  WHERE l.student_id = student_id_var
  ORDER BY l.date ASC;
END;
$$;

-- Grant execute to anon for public agenda access
GRANT EXECUTE ON FUNCTION public.get_lessons_by_access_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_lessons_by_access_code(TEXT) TO authenticated;

-- Create sequence for receipt numbers to fix race condition
CREATE SEQUENCE IF NOT EXISTS public.receipt_number_seq START 1;

-- Create function to generate atomic receipt number
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  year_part TEXT;
  seq_number BIGINT;
BEGIN
  year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  seq_number := nextval('public.receipt_number_seq');
  RETURN 'REC-' || year_part || '-' || LPAD(seq_number::TEXT, 3, '0');
END;
$$;

-- Set default on receipts table for automatic receipt number generation
ALTER TABLE public.receipts 
ALTER COLUMN receipt_number SET DEFAULT public.generate_receipt_number();