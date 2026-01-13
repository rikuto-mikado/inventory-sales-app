# Inventory Sales App

Full-stack inventory and sales management application built with Django REST Framework and React.

## Tech Stack

**Backend:**
- Django 6.0.1
- Django REST Framework
- PostgreSQL 15
- Python 3.x

**Frontend:**
- React 19.2.0
- TypeScript
- Vite
- Tailwind CSS

## Prerequisites

- Python 3.8+
- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inventory-sales-app
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

Start PostgreSQL using Docker Compose (run from project root):

```bash
docker-compose up -d
```

This will start PostgreSQL on `localhost:5432` with:
- Database: `inventory_db`
- User: `postgres`
- Password: `postgres`

### 4. Django Migrations

```bash
cd backend
source .venv/bin/activate
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

### 6. VS Code Setup (Important)

To resolve import warnings and enable proper Python IntelliSense:

1. Open Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
2. Type: `Python: Select Interpreter`
3. Select: `./backend/.venv/bin/python`

This ensures VS Code uses the virtual environment where Django is installed.

## Running the Application

### Start Backend Server

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

## Development Commands

### Backend

```bash
# Run migrations
python manage.py migrate

# Create new migration
python manage.py makemigrations

# Start Django shell
python manage.py shell

# Create superuser
python manage.py createsuperuser
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
inventory-sales-app/
├── backend/
│   ├── .venv/              # Python virtual environment
│   ├── config/             # Django project settings
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
└── docker-compose.yml      # PostgreSQL container config
```

## License

This project is licensed under the MIT License.
