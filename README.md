# TruPay

## Authentication Setup (Google + Phone OTP)

This project now uses Firebase Authentication in [src/lib/firebase.ts](src/lib/firebase.ts) and [src/pages/Login.tsx](src/pages/Login.tsx).

### 1. Create local env file

Copy [.env.example](.env.example) to `.env` and fill values from Firebase project settings.

Required keys:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional for Analytics:

- `VITE_FIREBASE_MEASUREMENT_ID`

### 2. Enable auth providers in Firebase Console

- Enable `Google` sign-in provider.
- Enable `Phone` sign-in provider.
- Add your app domain to Authorized domains.

### 3. Session behavior

- Auth persistence is configured to browser local storage on startup.
- Protected routes require active Firebase auth and redirect to login when signed out.
- The login route is public-only and redirects signed-in users to Home.

### 4. Phone OTP notes

- Firebase Phone Auth requires reCAPTCHA and works on `localhost` during development.
- Use E.164 format in login (example: `+919876543210`).
- Add test phone numbers in Firebase Auth settings for safe development testing.

### 5. Run app

```bash
npm install
npm run dev
```
