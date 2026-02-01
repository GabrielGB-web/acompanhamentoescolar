-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
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
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site settings" ON public.site_settings
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial row if not exists
INSERT INTO public.site_settings (school_name, city, state)
SELECT 'Acompanhamento Escolar', 'Palmas', 'Tocantins'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
