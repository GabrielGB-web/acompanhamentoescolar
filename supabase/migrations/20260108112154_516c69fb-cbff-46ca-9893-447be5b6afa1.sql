-- Add status column to events table
ALTER TABLE public.events 
ADD COLUMN status text NOT NULL DEFAULT 'pendente';

-- Add check constraint for valid status values
ALTER TABLE public.events
ADD CONSTRAINT events_status_check CHECK (status IN ('pendente', 'realizado', 'cancelado'));