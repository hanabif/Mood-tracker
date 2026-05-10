# Mood Tracker App

This is a full-stack Mood Tracking application built with React (TypeScript, Vite, Tailwind CSS) for the frontend and Django (Django REST Framework) for the backend.

## Features

### Frontend
- User Authentication (Register, Login, Logout)
- Dashboard displaying:
  - ✨ Emoji-based Mood Picker
  - 🏷️ Feelings Selector (with emoticon tags)
  - 🌸 Today's Mood Entry summary
  - 📖 Relevant mood quote based on today's mood
  - 📉 Mood and Sleep Trends chart (last 11 entries)
  - 📊 Mood Distribution visualization
  - 🗓️ Interaction Mood Calendar
  - 🎞️ Mood History Strip
  - 🏆 Achievement Badges System
  - 🔍 Reflection Search & Self-Care Suggestions
  - ⚖️ Averages Comparison (last 5 vs. previous 5 entries)
- Settings page for updating user name and avatar
- 🌓 Dark/Light Mode with pastel theme support

### Backend
- Custom User Model (with avatar and name)
- JWT Authentication (`djangorestframework-simplejwt`)
- API Endpoints for:
  - User Registration
  - User Login (JWT token generation)
  - Token Refresh
  - User Profile (retrieve and update)
  - Mood Entries (CRUD operations with JSON support for feelings)
- Filtering Mood Entries by user and date
- Ensures only one mood entry per user per day
- Migrations

## Tech Stack

### Frontend
- **Framework:** React.js
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Query, React Context
- **Form Management:** React Hook Form, Zod (for validation)
- **Charts:** Recharts

### Backend
- **Framework:** Django
- **API:** Django REST Framework
- **Authentication:** Django REST Framework Simple JWT
- **Database:** SQLite (development), PostgreSQL (production)
- **CORS:** `django-cors-headers`

## Project Structure

```
.
├── backend/
│   ├── backend/             # Django project settings
│   ├── mood/                # Mood tracking app
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── user/                # Custom user app
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Standard UI components
│   │   │   ├── BadgesList.tsx
│   │   │   ├── EmojiMoodPicker.tsx
│   │   │   ├── FeelingsSelector.tsx
│   │   │   ├── MoodCalendar.tsx
│   │   │   ├── MoodDistribution.tsx
│   │   │   ├── MoodHistoryStrip.tsx
│   │   │   ├── MoodLogForm.tsx
│   │   │   ├── ReflectionSearch.tsx
│   │   │   ├── SelfCareSuggestions.tsx
│   │   │   └── ...
│   │   ├── context/         # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── data/            # Local data files (e.g., quotes.json)
│   │   │   └── quotes.json
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useCreateMoodEntry.ts
│   │   │   ├── useMoodEntries.ts
│   │   │   ├── useQuotes.ts
│   │   │   └── useUser.ts
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/        # API interaction and token management
│   │   │   ├── api.ts
│   │   │   └── token.ts
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── cn.ts
│   │   │   └── getTodayEntry.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .gitignore
├── README.md
└── requirements.txt
```

## Setup Instructions

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Python virtual environment and activate it:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate   # On Windows
    source venv/bin/activate # On macOS/Linux
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Apply database migrations:**
    ```bash
    python manage.py makemigrations user mood
    python manage.py migrate
    ```

5.  **Create a superuser (for Django Admin):**
    ```bash
    python manage.py createsuperuser
    ```

6.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://127.0.0.1:8000/api/`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file in the `frontend` directory based on the example below:**
    ```
    VITE_API_URL=http://localhost:8000/api
    ```

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## Environment Variables

### Frontend (`frontend/.env`)

-   `VITE_API_URL`: The URL of the Django backend API (e.g., `http://localhost:8000/api`).

### Backend (`backend/.env` - *optional, for production*)

In a production environment, you would typically use environment variables for sensitive settings like `SECRET_KEY`, database credentials, etc. For development, `settings.py` directly defines these.

Recommended backend environment variables:

- `DJANGO_SECRET_KEY`: Secret key for Django.
- `DEBUG`: Use `False` in production.
- `ALLOWED_HOSTS`: Comma-separated hosts, for example `your-api.onrender.com`.
- `CORS_ALLOWED_ORIGINS`: Comma-separated frontend origins, for example `https://your-frontend.onrender.com`.
- `CSRF_TRUSTED_ORIGINS`: Comma-separated trusted origins for unsafe requests from your frontend.
- `DATABASE_URL`: Render PostgreSQL connection string.

## Render Backend Deploy

If you deploy only the Django backend from the `backend/` folder on Render:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
- Start Command: `gunicorn backend.wsgi:application`

Important:

- Do not use `gunicorn config.wsgi:application` in this repo. The Django project package is `backend`, not `config`.
- Set `DEBUG=False` on Render.
- Set `ALLOWED_HOSTS` to your Render backend hostname.
- If your frontend is hosted separately, set both `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to that frontend URL.
- If you attach a Render Postgres database, Render will provide `DATABASE_URL` automatically if you connect it to the service.

## Example API Requests

### Authentication

-   **Register User**
    ```
    POST /api/auth/register/
    Body: {"username": "testuser", "password": "password123", "name": "Test User"}
    ```
-   **Login User**
    ```
    POST /api/auth/login/
    Body: {"username": "testuser", "password": "password123"}
    Response: {"access": "...", "refresh": "..."}
    ```
-   **Refresh Token**
    ```
    POST /api/auth/login/refresh/
    Body: {"refresh": "your_refresh_token"}
    Response: {"access": "..."}
    ```

### User Profile

-   **Get User Profile** (Requires Authorization header with Access Token)
    ```
    GET /api/auth/user/
    ```
-   **Update User Profile** (Requires Authorization header with Access Token)
    ```
    PATCH /api/auth/user/
    Body: {"name": "New Name"}
    ```
-   **Update User Avatar** (Requires Authorization header with Access Token)
    ```
    POST /api/auth/user/update/
    Content-Type: multipart/form-data
    Body: {"avatar": <image_file>}
    ```

### Mood Entries

-   **Create Mood Entry** (Requires Authorization header with Access Token)
    ```
    POST /api/mood-entries/
    Body: {
      "mood": 4, 
      "feelings": ["happy", "calm"], 
      "reflection": "Had a good day at work", 
      "sleep_hours": 7.5
    }
    ```
-   **List Mood Entries** (Requires Authorization header with Access Token)
    ```
    GET /api/mood-entries/
    ```
-   **List Mood Entries for a specific user and date** (Requires Authorization header with Access Token)
    ```
    GET /api/mood-entries/?user_id=1&date=2024-03-01
    ```

## Development Workflow

1.  Start the backend server.
2.  Start the frontend server.
3.  Register a new user or log in with existing credentials.
4.  Navigate to the dashboard to log mood entries, view trends, and comparisons.
5.  Visit the settings page to update your profile.

## Contribution

Feel free to fork the repository, make improvements, and open pull requests.
