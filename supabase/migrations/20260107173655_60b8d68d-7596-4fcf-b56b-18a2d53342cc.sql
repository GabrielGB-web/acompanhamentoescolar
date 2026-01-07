-- Add access_code column to students for public agenda access
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;

-- Create function to generate unique access codes
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_code BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.students WHERE access_code = code) INTO exists_code;
    EXIT WHEN NOT exists_code;
  END LOOP;
  RETURN code;
END;
$$;

-- Create trigger to auto-generate access code on student insert
CREATE OR REPLACE FUNCTION public.set_student_access_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.access_code IS NULL THEN
    NEW.access_code := public.generate_access_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_student_access_code
  BEFORE INSERT ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.set_student_access_code();

-- Update existing students with access codes
UPDATE public.students SET access_code = public.generate_access_code() WHERE access_code IS NULL;