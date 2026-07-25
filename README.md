# CodeBlog

A full-stack MERN blogging platform with authentication, a rich-text post
editor, comments, and an admin dashboard.

## Features

- Email/password and Google sign-in (Firebase Auth)
- Readers, approved **Writers**, and **Admins** with different permissions
- Anyone can apply to become a writer; admins approve or reject requests
- Rich-text post editor with cover image upload
- Comments with likes and replies
- Admin dashboard: manage users, posts, comments, and writer requests

## Tech stack

| Layer    | Tech                                              |
| -------- | -------------------------------------------------- |
| Frontend | React, Vite, Redux Toolkit, React Router, Tailwind CSS, Flowbite |
| Backend  | Node.js, Express, MongoDB (Mongoose), JWT auth      |
| Auth     | Firebase (Google sign-in), JWT cookies (email/password) |

## Project structure

```
CodeBlog/
├── backend/            Express API
│   ├── src/
│   │   ├── controllers/  Request handlers
│   │   ├── models/       Mongoose schemas (User, Post, Comment)
│   │   ├── routes/       Express routers
│   │   └── utils/        Auth middleware, error helpers
│   ├── index.js           App entry point
│   ├── package.json
│   └── .env.example
└── frontend/           React app
    ├── src/
    │   ├── components/    Reusable UI + dashboard panels
    │   ├── pages/          Route-level pages
    │   ├── redux/          Redux Toolkit store & slices
    │   └── firebase.js     Firebase config
    ├── package.json
    └── .env.example
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB database (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Firebase](https://firebase.google.com) project with Google sign-in enabled (for the "Continue with Google" button)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env and fill in MONGO and JWT_SECRET
npm run dev
```

The API runs on `http://localhost:3000` by default.

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env and fill in VITE_BACKEND_URL and your Firebase config
npm run dev
```

The app runs on `http://localhost:5173` by default and proxies API calls to `VITE_BACKEND_URL`.

## How to write and publish a post

Posting isn't open to just anyone by default — here's the flow:

1. **Sign up** for an account (or sign in with Google).
2. Go to your **Dashboard → Profile** and click **"Apply to become a writer"**.
   This sends a request that's visible to admins under Dashboard → Writer Requests.
3. An **admin approves** your request (Dashboard → Writer Requests → Approve).
   You don't need to log out or back in — access unlocks immediately.
4. Once approved, a **"Create a post"** button appears on your profile, and a
   **Posts** tab appears in your dashboard sidebar.
5. Click **Create a post**, fill in a title, category, cover image, and content
   in the rich-text editor, then click **Publish**.
6. Your post is live at `/post/<your-post-slug>`. You can edit or delete your
   own posts anytime from Dashboard → Posts.

**Admins** automatically have writer access and can also edit or delete
*any* post or manage all users, comments, and writer requests from the
dashboard sidebar.

To make the first account an admin (there's no UI for this, by design —
otherwise anyone could self-promote), run:

```bash
cd backend
npm run seed:admin
```

This creates an admin account (or promotes an existing account with a
matching email to admin) using the credentials in `scripts/seedAdmin.js`
— by default `amankumar@gmail.com` / `AmanKumar2004`. Override them by
setting `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_USERNAME` env vars if
you'd rather not hardcode credentials in the script.

## Deployment

Both `backend/` and `frontend/` include a `vercel.json` and can be deployed
as two separate Vercel projects:

1. Deploy `backend/` first, set its environment variables (`MONGO`,
   `JWT_SECRET`, `CLIENT_URL` — your frontend's URL, `NODE_ENV=production`),
   and note its deployment URL.
2. Deploy `frontend/`, setting `VITE_BACKEND_URL` to the backend's URL and
   your Firebase env vars.
3. Once the frontend has a URL, go back to the backend's environment
   variables and set `CLIENT_URL` to it, then redeploy the backend so CORS
   allows requests from it.

## License

ISC
