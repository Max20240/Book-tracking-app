/*
  # Reading Tracker Database Schema

  ## Overview
  Complete database schema for the Reading Tracker Pro application with user authentication,
  book library management, reading sessions, achievements, and user goals.

  ## New Tables

  ### `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `books`
  User's book library
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text, required)
  - `author` (text)
  - `total_pages` (integer, required)
  - `current_page` (integer, default 0)
  - `genre` (text, default 'Other')
  - `status` (text, default 'To Read')
  - `cover_url` (text)
  - `isbn` (text)
  - `publisher` (text)
  - `publish_year` (integer)
  - `language` (text)
  - `series` (text)
  - `series_number` (integer)
  - `format` (text)
  - `description` (text)
  - `personal_notes` (text)
  - `rating` (integer, 0-5)
  - `start_date` (date)
  - `completed_date` (date)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `reading_sessions`
  Individual reading sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `book_id` (uuid, references books, nullable)
  - `date` (date, required)
  - `pages_read` (integer, required)
  - `minutes_read` (integer, default 0)
  - `notes` (text)
  - `session_start` (timestamptz)
  - `session_end` (timestamptz)
  - `created_at` (timestamptz)

  ### `daily_reading`
  Aggregated daily reading data
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `date` (date, required, unique per user)
  - `total_pages` (integer, default 0)
  - `total_minutes` (integer, default 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_goals`
  User reading goals
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, unique)
  - `daily_pages` (integer, default 20)
  - `daily_minutes` (integer, default 30)
  - `yearly_pages` (integer, default 10000)
  - `updated_at` (timestamptz)

  ### `user_achievements`
  User achievement progress
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `achievement_key` (text, required)
  - `unlocked` (boolean, default false)
  - `progress` (integer, default 0)
  - `unlocked_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - Unique constraint on (user_id, achievement_key)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Policies for SELECT, INSERT, UPDATE, DELETE operations
  - Profile automatically created on user signup via trigger
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  author text,
  total_pages integer NOT NULL,
  current_page integer DEFAULT 0,
  genre text DEFAULT 'Other',
  status text DEFAULT 'To Read',
  cover_url text,
  isbn text,
  publisher text,
  publish_year integer,
  language text,
  series text,
  series_number integer,
  format text,
  description text,
  personal_notes text,
  rating integer CHECK (rating >= 0 AND rating <= 5),
  start_date date,
  completed_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own books"
  ON books FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
  ON books FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own books"
  ON books FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reading_sessions table
CREATE TABLE IF NOT EXISTS reading_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE SET NULL,
  date date NOT NULL,
  pages_read integer NOT NULL,
  minutes_read integer DEFAULT 0,
  notes text,
  session_start timestamptz,
  session_end timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON reading_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON reading_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON reading_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON reading_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create daily_reading table
CREATE TABLE IF NOT EXISTS daily_reading (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_pages integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_reading ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily reading"
  ON daily_reading FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily reading"
  ON daily_reading FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily reading"
  ON daily_reading FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily reading"
  ON daily_reading FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  daily_pages integer DEFAULT 20,
  daily_minutes integer DEFAULT 30,
  yearly_pages integer DEFAULT 10000,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_key text NOT NULL,
  unlocked boolean DEFAULT false,
  progress integer DEFAULT 0,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_date ON reading_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_daily_reading_user_date ON daily_reading(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, achievement_key);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now());
  
  INSERT INTO public.user_goals (user_id, daily_pages, daily_minutes, yearly_pages)
  VALUES (new.id, 20, 30, 10000);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON books;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON daily_reading;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON daily_reading
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON user_goals;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON user_achievements;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
