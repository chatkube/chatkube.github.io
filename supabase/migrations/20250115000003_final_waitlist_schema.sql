-- Final waitlist table schema for the current form
-- This migration ensures all current form fields exist in the database

-- Add all the columns we need for the current form
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS primary_devops_domain TEXT,
ADD COLUMN IF NOT EXISTS tech_stack TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_primary_domain ON public.waitlist(primary_devops_domain);
CREATE INDEX IF NOT EXISTS idx_waitlist_company_size ON public.waitlist(company_size);

-- Add comments for documentation
COMMENT ON COLUMN public.waitlist.name IS 'User name (required)';
COMMENT ON COLUMN public.waitlist.email IS 'User email (required)';
COMMENT ON COLUMN public.waitlist.company_size IS 'Size of their company (optional)';
COMMENT ON COLUMN public.waitlist.primary_devops_domain IS 'Comma-separated list of DevOps domains they work in (optional)';
COMMENT ON COLUMN public.waitlist.tech_stack IS 'Free text description of technologies they currently use (optional)'; 