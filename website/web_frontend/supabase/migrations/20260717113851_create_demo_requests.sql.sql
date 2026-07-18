/*
# Create demo_requests table for Skolaroid lead capture

1. Purpose
   - Stores "Request a Demo" submissions from the Skolaroid marketing website.
   - Each row is a qualified lead from a school decision-maker.
   - Supports future CRM, sales pipeline and follow-up integration.

2. New Tables
   - `demo_requests`
     - `id` (uuid, primary key)
     - `full_name` (text, not null) — submitter name
     - `work_email` (text, not null) — work email
     - `phone` (text, not null) — phone number
     - `job_title` (text) — role of the submitter
     - `school_name` (text, not null) — institution name
     - `school_website` (text) — optional website
     - `city` (text) — city
     - `state` (text) — state
     - `country` (text, default 'India') — country
     - `school_type` (text) — school/college/trust type
     - `student_count` (text) — number of students (range label)
     - `branch_count` (text) — number of branches
     - `current_software` (text) — existing software used
     - `modules_of_interest` (text[]) — requested modules
     - `challenges` (text) — current challenges
     - `timeline` (text) — desired implementation timeline
     - `preferred_date` (date) — preferred demo date
     - `preferred_time` (text) — preferred demo time
     - `meeting_type` (text) — online/on-site
     - `additional_requirements` (text) — free text
     - `source_page` (text) — page the lead came from
     - `referrer` (text) — HTTP referrer
     - `campaign` (text) — campaign parameter
     - `consent` (boolean, default false) — consent checkbox
     - `lead_status` (text, default 'new') — new/contacted/qualified/closed
     - `assigned_to` (text) — assigned salesperson
     - `created_at` (timestamptz, default now())

3. Security
   - Enable RLS on `demo_requests`.
   - Public INSERT allowed (anon + authenticated) so the marketing site can submit leads.
   - No public SELECT/UPDATE/DELETE — leads are only readable from the Supabase dashboard / service role.

4. Notes
   - This is a single-tenant lead-capture table (no per-user ownership).
   - `USING (true)` is NOT used for SELECT — SELECT is denied to anon/authenticated by omitting the policy.
   - The website only inserts; lead management happens in the dashboard.
*/

CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  work_email text NOT NULL,
  phone text NOT NULL,
  job_title text,
  school_name text NOT NULL,
  school_website text,
  city text,
  state text,
  country text DEFAULT 'India',
  school_type text,
  student_count text,
  branch_count text,
  current_software text,
  modules_of_interest text[],
  challenges text,
  timeline text,
  preferred_date date,
  preferred_time text,
  meeting_type text,
  additional_requirements text,
  source_page text,
  referrer text,
  campaign text,
  consent boolean NOT NULL DEFAULT false,
  lead_status text NOT NULL DEFAULT 'new',
  assigned_to text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to INSERT new demo requests from the website.
DROP POLICY IF EXISTS "anon_insert_demo_requests" ON demo_requests;
CREATE POLICY "anon_insert_demo_requests"
ON demo_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies: leads are only accessible via the
-- Supabase dashboard / service role, never from the public anon client.

CREATE INDEX IF NOT EXISTS demo_requests_created_at_idx ON demo_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS demo_requests_lead_status_idx ON demo_requests (lead_status);
CREATE INDEX IF NOT EXISTS demo_requests_work_email_idx ON demo_requests (work_email);
