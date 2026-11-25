CREATE TABLE public.leady (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  about text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  consent_contact boolean NOT NULL DEFAULT false,
  consent_rodo boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  email_error text
);
GRANT ALL ON public.leady TO service_role;
ALTER TABLE public.leady ENABLE ROW LEVEL SECURITY;