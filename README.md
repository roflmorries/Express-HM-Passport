# Express Passport Authentication

This study project demonstrates a modern authentication system using Node.js, Express.js, and Passport.js.
It supports local authentication (email & password), Google OAuth, session management, and password reset via email.
---

## Features

- Local authentication (registration, login, logout)
- Google OAuth 2.0 authentication
- Session management with `express-session`
- Protected routes (only accessible to authenticated users)
- Password reset via email (using Nodemailer)
- Modular, best-practice project structure

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add:

   ```
   PORT=3001
   SESSION_SECRET=your_session_secret

   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
   ```

   - For Google OAuth credentials, see [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - For Gmail app password, see [Google App Passwords](https://myaccount.google.com/apppasswords).

4. **Start the server:**
   ```sh
   node src/app.js
   ```
   or with nodemon:
   ```sh
   npx nodemon src/app.js
   ```

---

## Usage

- **Register:**  
  `POST /auth/register` with `{ "email": "...", "password": "..." }`
- **Login:**  
  `POST /auth/login` with `{ "email": "...", "password": "..." }`
- **Logout:**  
  `POST /auth/logout`
- **Google OAuth:**  
  Visit `http://localhost:3001/auth/google` in your browser
- **Password reset:**  
  - `POST /auth/forgot` with `{ "email": "..." }`  
  - Follow the link sent to your email and `POST /auth/reset/:token` with `{ "password": "..." }`
- **Protected route:**  
  `GET /protected` (requires authentication)

---

## Project Structure

```
src/
  config/           # Passport strategies
  controllers/      # Route handlers
  middlewares/      # Custom middleware
  models/           # Data access layer
  routes/           # Express routers
  app.js            # Main application entry
.env                # Environment variables (not committed)
```