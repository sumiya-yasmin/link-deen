# LinkDeen - A Spiritual Social Network

**LinkDeen** is a full-stack social media application focused on Deen and spirituality, where users can connect, share, and grow in faith together. Built using the MERN stack (MongoDB, Express.js, React, Node.js), it provides a clean, modern UI with features like posting, commenting, following users, authentication, and profile management.

## ✨ Features

- ✅ User Authentication (JWT-based)
- ✅ Public profile with profile image and bio
- ✅ Follow/Unfollow users
- ✅ Create, edit, and delete posts
- ✅ Like and comment on posts
- ✅ Explore posts based on time and tags
- ✅ Persistent login using refresh tokens
- ✅ Responsive and modern UI (Tailwind CSS + shadcn/ui)
- ✅ Route protection (authenticated pages only)
- ✅ Modular, clean codebase using controllers, routers, services

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS v4
- Shadcn/UI
- React Router DOM
- Axios / React Query
- Zod (schema validation)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Zod for input validation
- JWT for authentication
- HttpOnly Cookies for refresh token storage

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js >= 18.x
- MongoDB installed (or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

---

## 🧩 Folder Structure (Monorepo style recommended)

root/
- ├── client/ # React frontend
- ├── server/ # Express backend
- ├── README.md


---

## 🔧 Installation Steps

### 1. Clone the Repository

```
git clone https://github.com/your-username/linkdeen.git
cd linkdeen
```

Setup Backend
```
cd server
npm install
```
Create a .env file in /server:


NODE_ENV === 'development'
PORT=8000
MongoURI=your_mongo_uri
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

Then start the backend:

```
npm run dev
```
Backend runs on http://localhost:8000

## Setup Frontend
cd ../client
```
npm install
```
Then start the frontend:

```
npm run dev
```
Frontend runs on http://localhost:5173