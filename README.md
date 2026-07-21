# Sproutly — Nutrition App

[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20TypeScript-61dafb?style=flat-square)](client)
[![Backend](https://img.shields.io/badge/backend-Express%205%20%2B%20MySQL-3c873a?style=flat-square)](server)
[![Build](https://img.shields.io/badge/build-Vite%207-646cff?style=flat-square)](client)

A full-stack nutrition tracker for logging meals, hitting your macro and water goals, and keeping a daily streak going. You can add foods by hand, save the meals you eat often, or just scan a barcode and let the app fill in the details.

## What it does

- Tracks calories, protein, carbs, and fat against targets you set yourself
- Logs water and (optionally) creatine, with a daily streak to keep you honest
- Scans barcodes to pull product info, with OCR as a fallback for reading numbers straight off packaging
- Lets you save reusable meals and ingredients, or log one-off items for a single day
- Signs you in with email/password or Google, both backed by JWT
- Runs as a PWA with light/dark themes and multi-language support

When you save a day to history, water, creatine, and any one-time items reset for the next one.

## Running it locally

You'll need Node 20.19+ (or 22.12+) and MySQL 8.

```bash
git clone https://github.com/KoZsombat/Sproutly
cd nutrition-app

# install both sides
cd client && npm install
cd ../server && npm install

# set up the database
cd ..
mysql -u root -p < database/schema.sql
```

Next, set up your environment. Copy the server example and fill it in:

```bash
cp server/.env.example server/.env
```

The important ones are your MySQL connection (`DBHOST`, `DBUSER`, `DBPASSWORD`, `DBNAME`), a `JWT_SECRET` and `SESSION_SECRET`, and `FRONTEND_URL` / `BACKEND_URL`. Google login is optional — leave `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` blank to skip it.

Then create `client/.env` with one line pointing at the API:

```bash
VITE_API_URL=http://localhost:3000
```

Start both and open the app:

```bash
# in server/
npm start

# in client/
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Under the hood

React 19 + TypeScript on the front, Express 5 + MySQL on the back. Barcode scanning uses the Scanbot Web SDK with ZXing and Tesseract.js for OCR, auth is JWT with optional Google OAuth via Passport, and the build is Vite with PWA support. The API and database schema live in `server/src/routes` and `database/schema.sql` if you want to dig in.

## License

Built as a portfolio project, provided as-is.
