-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Policies for grades
CREATE POLICY "Grades are viewable by authenticated users" 
ON public.grades FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Grades are manageable by admins" 
ON public.grades FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policies for subjects
CREATE POLICY "Subjects are viewable by authenticated users" 
ON public.subjects FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Subjects are manageable by admins" 
ON public.subjects FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Initial data for grades
INSERT INTO public.grades (name) VALUES 
('6º Ano'), ('7º Ano'), ('8º Ano'), ('9º Ano'), 
('1º Ano EM'), ('2º Ano EM'), ('3º Ano EM')
ON CONFLICT (name) DO NOTHING;

-- Initial data for subjects
INSERT INTO public.subjects (name) VALUES 
('Matemática'), ('Português'), ('Física'), ('Química'), 
('Biologia'), ('História'), ('Geografia'), ('Inglês'), ('Redação')
ON CONFLICT (name) DO NOTHING;
