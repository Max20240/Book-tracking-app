# Reading Tracker Pro - Backend Setup Guide

This guide will help you set up the backend with Supabase authentication and database storage.

## Prerequisites

- A Supabase account (free tier works fine)
- The Supabase project is already provisioned for you

## Database Setup

The database schema has already been created with the following tables:

### Tables Created
- **profiles** - User profile information
- **books** - User's book library
- **reading_sessions** - Individual reading sessions
- **daily_reading** - Aggregated daily reading data
- **user_goals** - User reading goals
- **user_achievements** - Achievement tracking

All tables have Row Level Security (RLS) enabled and policies configured to ensure users can only access their own data.

## Environment Variables

The Supabase connection details are automatically available in your environment:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

These are automatically injected by the Supabase platform.

## Authentication

The app uses Supabase's built-in email/password authentication:

### Sign Up
1. Users enter their email and password
2. A profile is automatically created
3. Default goals are set up
4. Users can start tracking their reading immediately

### Sign In
1. Users enter their credentials
2. All their data is loaded from the database
3. They can continue tracking their reading progress

### Data Security
- All data is protected by Row Level Security
- Users can only see and modify their own data
- Authentication state is managed automatically
- Sessions are persisted across page reloads

## Features

### 1. Book Library Management
- Add books with detailed information (title, author, pages, genre, etc.)
- Track reading progress for each book
- Change book status (To Read, Reading, Completed)
- Delete books from library
- All synced to Supabase database

### 2. Reading Sessions
- Log reading sessions with date, pages, and minutes
- Associate sessions with specific books
- Add notes to reading sessions
- Track daily reading statistics
- All data stored in Supabase

### 3. Goals & Progress
- Set daily page goals
- Set daily time goals
- Set yearly page goals
- Track progress toward goals
- Goals synced across devices

### 4. Achievements
- Unlock achievements as you read
- Track achievement progress
- Achievements saved to database
- Persistent across devices

### 5. Data Sync
- All data automatically synced to Supabase
- Real-time updates
- No manual saving required
- Access your data from any device

## API Endpoints (Automatic)

The app uses Supabase's auto-generated REST API:

- `GET /books` - Fetch user's books
- `POST /books` - Add a new book
- `PATCH /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book
- `GET /reading_sessions` - Fetch reading sessions
- `POST /reading_sessions` - Log a reading session
- `GET /daily_reading` - Fetch daily reading data
- `GET /user_goals` - Fetch user goals
- `POST /user_goals` - Save user goals
- `GET /user_achievements` - Fetch achievements
- `POST /user_achievements` - Save achievement

All endpoints are automatically secured with RLS.

## Testing the Setup

1. Open the app in your browser
2. You'll see a sign-in modal
3. Click "Sign Up" to create an account
4. Enter your email and password (minimum 6 characters)
5. You'll be automatically logged in
6. Start adding books and logging reading sessions
7. All data will be saved to Supabase automatically

## Troubleshooting

### Issue: Can't sign in
- Check that your Supabase URL and key are correctly set
- Make sure you're using the correct email and password
- Check browser console for error messages

### Issue: Data not saving
- Check browser console for errors
- Verify you're logged in (user icon should be visible in header)
- Check Supabase dashboard to verify database connection

### Issue: Auth modal not showing
- Clear your browser cache
- Check browser console for JavaScript errors
- Verify all script files are loading correctly

## Development Notes

### File Structure
```
js/
  ├── config.js        # Supabase client configuration
  ├── auth.js          # Authentication service
  ├── auth-ui.js       # Authentication UI components
  ├── database.js      # Database operations
  ├── app.js           # Main application logic
  ├── translations.js  # Multi-language support
  └── retrospective.js # Retrospective analytics
```

### Key Functions

**Authentication**
- `AuthService.init()` - Initialize auth and check session
- `AuthService.signUp(email, password)` - Create new account
- `AuthService.signIn(email, password)` - Sign in user
- `AuthService.signOut()` - Sign out user

**Database**
- `DatabaseService.loadAllData()` - Load all user data
- `DatabaseService.addBook(bookData)` - Add a book
- `DatabaseService.updateBook(id, updates)` - Update a book
- `DatabaseService.logReadingSession(data)` - Log reading
- `DatabaseService.saveGoals(goals)` - Save goals

## Security Best Practices

1. **Never commit credentials**
   - The `js/env.js` file is in `.gitignore`
   - Environment variables are injected by Supabase

2. **Row Level Security**
   - All tables have RLS enabled
   - Users can only access their own data
   - Policies are restrictive by default

3. **Authentication**
   - Passwords are hashed by Supabase
   - Sessions are managed securely
   - No sensitive data in localStorage

## Next Steps

Your Reading Tracker Pro app is now fully functional with:
- Secure authentication
- Cloud database storage
- Real-time data sync
- Multi-device support

Start tracking your reading and building your reading habit!
