# Kyodo AI Dynamic Integration Guide

## Overview

This guide outlines the changes made to convert the static Kyodo AI application into a dynamic web application using Supabase as the backend.

## 1. Database Schema

The database schema is defined in `SUPABASE_SCHEMA.md` and includes:

- `emails` table: Stores emails fetched from the user's inbox
- `deals` table: Stores deals extracted from emails
- `messages` table: Stores message history for each deal
- Row Level Security (RLS) policies for data isolation

## 2. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Execute the SQL commands in `SUPABASE_SCHEMA.md` to create the tables
3. Configure authentication (Email/Password)
4. Get your API keys and add them to environment variables:

```
// Frontend (.env file)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

// Backend (.env file)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-key
```

## 3. Frontend Implementation

### Dashboard Component
- Fetches deals from Supabase for the logged-in user
- Displays deals as cards
- Handles AI activation toggle (updates Supabase)
- Manages email scanning and rescanning

### Chat Rooms Component
- Fetches AI-active deals for the logged-in user
- Fetches message history for each deal
- Allows sending new messages
- Stores messages in Supabase

### Authentication
- Uses Supabase Auth for user management
- Stores user preferences in profiles table

## 4. Backend Implementation

### Email Scanning Endpoint
- Fetches emails (mock or real Gmail)
- Processes emails to extract deals
- Stores emails and deals in Supabase
- Links deals to the correct user

### Chat Message Processing
- Simulates AI processing with timeline
- Stores chat messages in Supabase
- Returns suggested actions

## 5. Testing

1. Register a new user
2. Scan for emails
3. Verify deals are displayed on the dashboard
4. Toggle AI active on a deal
5. Open chatrooms to see AI-active deals
6. Send messages and verify they're saved

## 6. Future Enhancements

1. Real-time updates using Supabase subscriptions
2. More advanced email filtering
3. Analytics dashboard for deal tracking
4. Invoice generation integration
