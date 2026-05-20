-- ReelVibe Database Schema
-- Run this in Supabase SQL Editor to create the necessary tables

-- Create videos table
create table if not exists videos (
  id          text primary key,
  title       text,
  description text,
  creator     text,
  downloads   integer default 0,
  thumb_url   text,
  stream_url  text,
  metadata    jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable Row Level Security
alter table videos enable row level security;

-- Create policy for public read access
create policy "Public read" on videos for select using (true);

-- Create full-text search index
create index if not exists videos_title_idx on videos using gin(to_tsvector('english', title));
create index if not exists videos_creator_idx on videos (creator);
create index if not exists videos_downloads_idx on videos (downloads desc);
create index if not exists videos_created_at_idx on videos (created_at desc);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-update updated_at
drop trigger if exists update_videos_updated_at on videos;
create trigger update_videos_updated_at
  before update on videos
  for each row
  execute function update_updated_at_column();