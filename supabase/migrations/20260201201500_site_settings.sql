-- Create school_info table (renamed from site_settings to force cache refresh)
CREATE TABLE IF NOT EXISTS public.school_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_name TEXT NOT NULL DEFAULT 'Acompanhamento Escolar',
    address TEXT,
    city TEXT DEFAULT 'Palmas',
    state TEXT DEFAULT 'Tocantins',
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_info ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view school info" ON public.school_info
FOR SELECT USING (true);

CREATE POLICY "Admins can update school info" ON public.school_info
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert school info" ON public.school_info
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_school_info_updated_at
BEFORE UPDATE ON public.school_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial row if not exists
INSERT INTO public.school_info (id, school_name, city, state)
VALUES ('00000000-0000-0000-0000-000000000000', 'Acompanhamento Escolar', 'Palmas', 'Tocantins')
ON CONFLICT (id) DO NOTHING;
