# CORS Configuration

When running the frontend and backend on separate origins (e.g., Vite dev server on `localhost:5173` and Django on `localhost:8000`), the browser blocks cross-origin requests by default. The following settings in `backend/config/settings.py` enable CORS:

- **`"corsheaders"` in `INSTALLED_APPS`** — Registers the [`django-cors-headers`](https://github.com/adamchainz/django-cors-headers) package.
- **`"corsheaders.middleware.CorsMiddleware"` in `MIDDLEWARE`** — Adds `Access-Control-Allow-Origin` headers to responses. Must be placed before `CommonMiddleware`.
- **`CORS_ALLOWED_ORIGINS`** — Whitelists origins allowed to make requests. Set to `["http://localhost:5173"]` only when `DEBUG=True` (development only).

These are required whenever the frontend and backend are served from different origins.
