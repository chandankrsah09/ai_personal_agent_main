-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  auth_provider TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own record
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own record
CREATE POLICY "Users can update their own record" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- (Optional) If you want the API to be able to insert new users upon first sign-in:
-- For security, you might prefer a database trigger on auth.users instead of a client-side insert.
-- But since the application does a client-side insert, we must allow inserts:
CREATE POLICY "Users can insert their own record" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);
