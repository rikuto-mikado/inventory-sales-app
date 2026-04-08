# Migrating from `runserver` to Docker Compose

## Background

Previously, the backend was started manually with `python manage.py runserver`.
To make the setup more consistent and portable, the backend was containerized and added to Docker Compose.

## Changes Made

### 1. `backend/Dockerfile` (new)

Created a Dockerfile for the backend service.
It installs dependencies from `requirements.txt`, runs migrations, and starts the development server on port 8000 inside the container.

### 2. `docker-compose.yml`

Added a `backend` service that:
- Builds from `./backend`
- Maps host port **8001** → container port **8000**
- Loads environment variables from `.env`
- Depends on the `db` service

### 3. `.env`

| Variable | Before | After | Reason |
|---|---|---|---|
| `POSTGRES_HOST` | `localhost` | `db` | Inside Docker, services communicate via service names |
| `POSTGRES_PORT` | `5433` | `5432` | `5433` is the host-mapped port; inside Docker the internal port is `5432` |

### 4. `backend/requirements.txt`

Added `django-cors-headers` which was installed locally but missing from `requirements.txt`, causing the container to crash on startup.

### 5. `frontend/src/api/client.ts`

Changed `API_BASE_URL` to point to port `8001` to match the Docker port mapping.

## How Docker Networking Works

Inside the Docker Compose network, `backend` connects to `db:5432` directly using the service name.
The host port `5433` is only used when connecting to the database from outside Docker (e.g., a local DB client).

## How to Start

```bash
docker compose up -d --build
```

Then start the frontend separately:

```bash
cd frontend && npm run dev
```
