# LinkDeen 
**A Spiritual Social Network**

**LinkDeen** is a full-stack social media application focused on Deen and spirituality, where users can connect, share, and grow in faith together. 

## 🌐 Live Demo

## 🚀 Features

### 🔐 Authentication & Security

- **User Authentication:** Secure signup and login with email/password

- **JWT-based Security:** Session management using access & refresh tokens

- **Persistent Login:** Refresh tokens ensure a seamless experience

- **Route Protection:** Guards private routes so only authenticated users can access

### 👤 User Profiles & Social Graph

- **Personalized Profiles:** Public-facing user profiles with profile picture & bio

- **Profile Management:** Edit/update profile info & change profile picture anytime

- **Follow/Unfollow System:** Build your own social graph by connecting with others

### 📝 Post Management & Content Creation

- **CRUD Operations:** Create, read, update, and delete text & image-based posts

- **Engagement:** Like and comment on posts

- **Image Uploads:** Integrated with Cloudinary for secure and scalable media storage

### 🔍 Discoverability & Exploration

- **Search Functionality:** Find users and posts by keywords

- **Content Exploration:** Browse posts based on tags and recency

### 🎨 UI/UX & Design

- **Responsive Design:** Mobile-first, optimized for all screen sizes

- **Modern UI:** Built with Tailwind CSS v4 and shadcn/ui for a clean experience

### 🛡️ Technical Stack & Architecture

- **Secure & Scalable Backend:** Node.js, Express, and MongoDB Atlas

- **Data Validation:** Strong validation with Zod

- **Cloud Media Handling:** Image uploads handled with Cloudinary

- **Clean Codebase:** Modular architecture with controllers, routers, services, and middlewares  


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

```
linkdeen/
│── client/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── hooks/
│
│── server/         # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── middlewares/
│
└── README.md
```

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

```
NODE_ENV === 'development'
PORT=8000
MongoURI=your_mongo_uri
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```

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