-- Update get_lessons_by_access_code RPC to include feedback
CREATE OR REPLACE FUNCTION public.get_lessons_by_access_code(code TEXT)
RETURNS TABLE (
  lesson_id UUID,
  lesson_date DATE,
  lesson_time TIME,
  lesson_subject TEXT,
  lesson_duration TEXT,
  lesson_status lesson_status,
  teacher_name TEXT,
  lesson_feedback TEXT
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
    t.name as teacher_name,
    l.feedback as lesson_feedback
  FROM public.lessons l
  INNER JOIN public.teachers t ON l.teacher_id = t.id
  WHERE l.student_id = student_id_var
  ORDER BY l.date ASC;
END;
$$;
