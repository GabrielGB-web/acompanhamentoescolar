-- Add feedback column to lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS feedback TEXT;
