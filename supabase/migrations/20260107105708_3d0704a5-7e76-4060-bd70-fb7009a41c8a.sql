-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  grade TEXT,
  responsible_name TEXT,
  responsible_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson status enum
CREATE TYPE public.lesson_status AS ENUM ('agendada', 'concluída', 'cancelada');

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration TEXT NOT NULL,
  status lesson_status NOT NULL DEFAULT 'agendada',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transaction type enum
CREATE TYPE public.transaction_type AS ENUM ('entrada', 'saida');

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type transaction_type NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receipts table
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events/reminders table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  color TEXT DEFAULT 'primary',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all tables (will be restricted after authentication is implemented)
CREATE POLICY "Allow all access to students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to receipts" ON public.receipts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();