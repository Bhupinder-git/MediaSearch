# MediaSearch

MediaSearch is a full-stack media discovery application. Search for photos, videos, GIFs, and stickers, save items to a personal collection, and manage that collection across sessions.

## Features

- Search media from Unsplash, Pexels, and GIPHY.
- Filter results by photos, videos, GIFs, and stickers.
- Create an account and sign in with cookie-based JWT authentication.
- Add, remove, and clear collection items.
- Persist collections in MongoDB through the Express API.
- Keep a local collection cache for a responsive interface.
- Responsive React interface built with Tailwind CSS.

## Tech Stack

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens
- bcrypt

## Project Structure

```text
src/
  components/       Reusable UI components
  pages/            Search, collection, sign-in, and sign-up pages
  redux/            Redux store and slices
  services/         Media and authentication API clients
server/
  config/           MongoDB connection
  controllers/      Authentication and collection handlers
  middlewares/      JWT authentication middleware
  models/           User and media item schemas
  routes/           Auth and collection routes
  index.js          Express server entry point
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- API keys for Unsplash, Pexels, and GIPHY

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone https://github.com/YOUR_USERNAME/MediaSearch.git
cd MediaSearch
npm install
cd server
npm install
cd ..
```

Create a `.env` file in the project root for frontend variables:

```env
VITE_GIPHY_API_KEY=your_giphy_api_key
VITE_UNSPLASH_API_KEY=your_unsplash_api_key
VITE_PEXELS_API_KEY=your_pexels_api_key
VITE_SERVER_URL=http://localhost:4000/api
```

Create `server/.env` for backend variables:

```env
PORT=4000
CLIENT_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Never commit either `.env` file. They are ignored by the repository's `.gitignore` file.

## Running Locally

Start the frontend and backend together from the project root:

```bash
npm run dev
```

The application runs at [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:4000](http://localhost:4000).

To run them separately:

```bash
# Frontend
npm run start

# Backend, from the project root
npm run server
```

The backend health check is available at:

```text
GET http://localhost:4000/api/health
```

## Available Scripts

### Root scripts

| Script            | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start the frontend and backend together |
| `npm run start`   | Start the Vite development server       |
| `npm run build`   | Build the frontend for production       |
| `npm run preview` | Preview the production frontend build   |
| `npm run lint`    | Run ESLint                              |
| `npm run server`  | Start the backend in development mode   |

### Server scripts

Run these from the `server` directory:

| Script        | Description                           |
| ------------- | ------------------------------------- |
| `npm run dev` | Start the Express server with Nodemon |
| `npm start`   | Start the Express server              |

## API Routes

All API routes use the `/api` prefix.

### Authentication

| Method | Route              | Description                     |
| ------ | ------------------ | ------------------------------- |
| `POST` | `/api/auth/signup` | Create an account               |
| `POST` | `/api/auth/login`  | Sign in and set the auth cookie |
| `POST` | `/api/auth/logout` | Clear the auth cookie           |
| `GET`  | `/api/auth/me`     | Get the current user            |

### Collection

Collection routes require authentication.

| Method   | Route                     | Description                       |
| -------- | ------------------------- | --------------------------------- |
| `GET`    | `/api/collection`         | Get the current user's collection |
| `POST`   | `/api/collection`         | Add an item to the collection     |
| `DELETE` | `/api/collection/:itemId` | Remove one item                   |
| `DELETE` | `/api/collection`         | Clear the collection              |

## Deployment

The frontend and backend are separate applications. Deploy the Vite frontend to Vercel and deploy the Express server to Render, Railway, or another Node.js host.

For the frontend, use:

```text
Build command: npm run build
Output directory: dist
```

Set these frontend environment variables in the hosting provider:

```env
VITE_GIPHY_API_KEY=your_giphy_api_key
VITE_UNSPLASH_API_KEY=your_unsplash_api_key
VITE_PEXELS_API_KEY=your_pexels_api_key
VITE_SERVER_URL=https://your-backend-domain.com/api
```

Set these backend environment variables:

```env
PORT=4000
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_production_secret
```

Configure MongoDB Atlas network access for the backend host, and use a production JWT secret. Do not expose `MONGODB_URL` or `JWT_SECRET` in frontend variables.

## Security Notes

- Do not commit API keys, database credentials, or JWT secrets.
- `VITE_*` variables are included in the browser bundle. Treat media API keys as public client credentials and restrict them in their provider dashboards where possible.
- Use HTTPS in production so authentication cookies are transmitted securely.
