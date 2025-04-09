# Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v8 or higher)
- Git
- Firebase CLI (`npm install -g firebase-tools`)
- VS Code (recommended)

## Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/nicowaelti/business_network_app.git
cd business_network_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

1. Create a new Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Follow the setup wizard
   - Enable Google Analytics (recommended)

2. Enable required Firebase services:
   - Authentication
     - Go to Authentication > Sign-in method
     - Enable Email/Password authentication
   
   - Firestore Database
     - Go to Firestore Database
     - Create database
     - Choose a location close to your users
     - Start in production mode

3. Get Firebase credentials:
   - Go to Project Settings
   - Click the web icon (</>)
   - Register app
   - Copy the firebaseConfig object

### 4. Environment Configuration

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Firebase Local Development Setup

1. Login to Firebase CLI:
```bash
firebase login
```

2. Initialize Firebase in your project:
```bash
firebase init
```
Select the following options:
- Firestore
- Authentication
- Hosting
- Emulators

3. Configure emulators in firebase.json:
```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true
    }
  }
}
```

## Development

### Starting the Development Environment

1. Start Firebase emulators:
```bash
firebase emulators:start
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application:
- Main app: http://localhost:3000
- Firebase Emulator UI: http://localhost:4000

### Available Scripts
```bash
npm run dev          # Start development server
npm run build       # Build for production
npm run start       # Run production build locally
npm run lint        # Run ESLint
firebase:emulators  # Start Firebase emulators
```

## Initial Data Setup

### Create Admin User
```bash
node scripts/create-admin-user.js
```

### Import Test Data (Optional)
```bash
node scripts/create-test-data.js
```

## Testing

### Manual Testing Checklist

1. Authentication
   - [ ] Registration
   - [ ] Login
   - [ ] Password Reset
   - [ ] Profile Creation

2. Database Operations
   - [ ] Create/Edit/Delete Jobs
   - [ ] Create/Edit/Delete Availability Posts
   - [ ] Create/Edit/Delete Events
   - [ ] Update User Profile

3. Security Rules
   - [ ] User Role Restrictions
   - [ ] Data Access Permissions
   - [ ] API Endpoint Protection

## Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy
```

### Post-Deployment Checklist
- [ ] Verify authentication works
- [ ] Check database connections
- [ ] Test main functionality
- [ ] Verify environment variables
- [ ] Check security rules
- [ ] Monitor error logs

## Troubleshooting

### Common Issues

1. Firebase Configuration
```
Error: Firebase App not initialized
Solution: Check .env.local file and Firebase config in src/lib/firebase/config.ts
```

2. Build Errors
```
Error: Module not found
Solution: Run npm install and check package.json
```

3. Authentication Issues
```
Error: Invalid login credentials
Solution: Verify Firebase Authentication is enabled and rules are correct
```

### Debug Tools
- Firebase Console Logs
- Firebase Authentication Logs
- Firebase Emulator UI
- Browser Developer Tools
- Next.js Error Logs

## Security Considerations

### 1. Environment Variables
- Never commit .env files
- Use different Firebase projects for development/production
- Restrict API key usage in Firebase Console

### 2. Firebase Security Rules
- Test security rules thoroughly
- Use the Firebase Security Rules Simulator
- Implement proper role-based access
- Validate data on write operations

### 3. Authentication
- Implement proper session handling
- Use secure password requirements
- Enable Email verification
- Set up proper error handling

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

### Tools
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

### Support
- GitHub Issues
- Firebase Support
- Next.js Discussions
- Stack Overflow

This setup guide provides a complete walkthrough for setting up and deploying the application with Firebase integration.
