-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies (Wrapped in DO blocks for idempotency)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END
$$;

-- 2. Accounts Table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('wallet', 'bank', 'cash', 'savings', 'other')) NOT NULL,
  balance NUMERIC DEFAULT 0 NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_included_in_balance BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own accounts') THEN
        CREATE POLICY "Users can manage their own accounts" ON public.accounts FOR ALL USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- NULL for global/default categories
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  UNIQUE(name, type, user_id)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can only view their own categories') THEN
        CREATE POLICY "Users can only view their own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own categories') THEN
        CREATE POLICY "Users can manage their own categories" ON public.categories FOR ALL USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense', 'transfer')) NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own transactions') THEN
        CREATE POLICY "Users can manage their own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 5. Checklist Items Table
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0 NOT NULL,
  category TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('one-time', 'daily', 'weekly', 'monthly')) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own checklist items') THEN
        CREATE POLICY "Users can manage their own checklist items" ON public.checklist_items FOR ALL USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Functions & Triggers

-- Trigger to create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert some default categories
INSERT INTO public.categories (name, type, icon, color) 
VALUES
('Salary', 'income', 'briefcase', '#10b981'),
('Gifts', 'income', 'gift', '#ec4899'),
('Food', 'expense', 'utensils', '#f97316'),
('Transport', 'expense', 'bus', '#3b82f6'),
('Rent', 'expense', 'home', '#8b5cf6'),
('Entertainment', 'expense', 'clapperboard', '#f43f5e'),
('Health', 'expense', 'heart', '#ef4444'),
('Shopping', 'expense', 'shopping-bag', '#f59e0b')
ON CONFLICT (name, type, user_id) DO NOTHING;

-- Function to increment/decrement account balance safely
CREATE OR REPLACE FUNCTION public.increment_balance(account_id UUID, amount_to_add NUMERIC)
RETURNS void AS $$
BEGIN
  UPDATE public.accounts
  SET balance = balance + amount_to_add
  WHERE id = account_id;
END;
$$ LANGUAGE plpgsql;
