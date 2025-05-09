# 🩺 DocConnect

**DocConnect** is a modern web application that helps users discover and filter doctors based on specialization, city, and other preferences. The platform is designed to be fast, responsive, and SEO-friendly, making it ideal for healthcare discovery and listings.

## 🚀 Features

- 🔍 Search & filter doctors by specialization, city, etc.
- ➕ Add new doctor entries via a form (admin-side)
- 📄 Paginated doctor listing
- 🌐 SEO-friendly using Next.js
- 📱 Fully responsive on all devices

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- React Icons

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with Mongoose

## 📂 Project Structure

```
docconnect/
├── frontend/     # Next.js frontend
│   ├── app/
│   ├── components/
│   └── ...
├── backend/      # Express.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ...
└── README.md
```

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/docconnect.git
cd docconnect
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
npm start
```

> ⚠️ Make sure MongoDB is running locally or update your connection URI in the backend configuration.

## 🧪 API Endpoints

- `POST /api/add-doctor` - Add a new doctor
- `GET /api/list-doctor-with-filter?page=1&specialization=cardiologist&city=delhi` - List doctors with optional filters and pagination

## ✨ Future Improvements

- Doctor profile pages
- Login & authentication
- Admin dashboard
- Ratings & reviews

## 🤝 Contributing

Contributions are welcome! Please fork this repo and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---

> Made with ❤️ by [Raj Singh](https://github.com/raj-singhh)
