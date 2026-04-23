-- Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  instagram_handle TEXT NOT NULL,
  phone TEXT,
  year TEXT CHECK (year IN ('1st', '2nd', '3rd', '4th')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- PG Listings table
CREATE TABLE pg_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  room_type TEXT NOT NULL, -- Single / Double Sharing / Triple Sharing
  location TEXT NOT NULL,
  rent INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  available_from DATE NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  gender_preference TEXT NOT NULL, -- Male / Female / Any
  description TEXT,
  contact_instagram TEXT NOT NULL,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- Item Listings table
CREATE TABLE item_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Electronics / Furniture / Kitchen / Books / Clothing / Misc
  condition TEXT NOT NULL, -- New / Excellent / Good / Fair
  price INTEGER NOT NULL,
  is_negotiable BOOLEAN DEFAULT FALSE,
  description TEXT,
  contact_instagram TEXT NOT NULL,
  contact_phone TEXT,
  is_sold BOOLEAN DEFAULT FALSE,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

-- RLS Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_listings ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- PG Listings: Public read for active, owner all
CREATE POLICY "Active PG listings are viewable by everyone" ON pg_listings FOR SELECT USING (is_active = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own PG listings" ON pg_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own PG listings" ON pg_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own PG listings" ON pg_listings FOR DELETE USING (auth.uid() = user_id);

-- Item Listings: Public read for unsold, owner all
CREATE POLICY "Unsold item listings are viewable by everyone" ON item_listings FOR SELECT USING (is_sold = false OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own item listings" ON item_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own item listings" ON item_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own item listings" ON item_listings FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket setup should be done in Supabase dashboard: 'listing-images'
