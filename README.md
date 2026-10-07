NUVORA 🛍️

A modern full-stack e-commerce web application built with the MERN stack. Nuvora focuses on providing a clean shopping experience with secure authentication, product management, cart functionality, and a scalable backend architecture.

🚀 Features

User Features

- User registration and login
- Secure authentication using JWT
- Browse products
- View detailed product information
- Add/remove products from cart
- Manage cart quantity
- User profile
- Responsive UI

Admin Features

- Admin authentication and authorization
- Add new products
- Update products
- Delete products
- Manage product inventory
- Admin dashboard

Additional Features

- Product search
- Pagination
- Image uploads
- Email/OTP verification
- Online payments with Razorpay
- Protected routes
- Backend validation and error handling

«Note: Some features are currently under development.»

---

🛠️ Tech Stack

Frontend

- React.js
- Tailwind CSS
- React Router
- Redux Toolkit
- Axios

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

Other Services

- Cloudinary — Image storage
- Razorpay — Payment processing
- Email/OTP service — Account verification
- Vercel — Frontend deployment
- Render/Railway — Backend deployment

---

📁 Project Structure

Nuvora/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── utils/
│   └── server.js
│
└── README.md

---

⚙️ Installation

1. Clone the repository

git clone YOUR_REPOSITORY_URL
cd Nuvora

2. Install frontend dependencies

cd frontend
npm install

3. Install backend dependencies

cd ../backend
npm install

---

🔐 Environment Variables

Create a ".env" file inside the "backend" directory.

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

Create a ".env" file inside the "frontend" directory if required:

VITE_API_URL=http://localhost:5000

Never commit your ".env" files or API keys to GitHub.

The backend accepts `MONGODB_URI` (recommended) or the legacy `MONGODB_URL`
variable for the MongoDB connection string.

---

▶️ Running the Project

Start the backend

cd backend
npm run dev

Start the frontend

Open another terminal:

cd frontend
npm run dev

The application will then be available at the local development URL shown by Vite.

---

🔒 Authentication

Nuvora uses JWT-based authentication to protect user-specific and administrative operations.

Protected backend routes verify the user's authentication token before allowing access.

Admin-only operations are additionally protected using authorization middleware.

---

🗄️ Database

Nuvora uses MongoDB with Mongoose for database management.

Main data models include:

- User
- Product
- Cart
- Order

The database structure is designed to keep user, product, cart, and order data separate while maintaining the required relationships.

---

💳 Payment

The project uses Razorpay for online payment processing.

The payment flow is handled through the backend to prevent sensitive payment credentials from being exposed on the client.

---

📸 Image Management

Product images are uploaded and stored using Cloudinary instead of storing large image files directly inside MongoDB.

---

🧠 What I Learned

While building Nuvora, I am focusing on understanding:

- React component architecture
- State management with Redux Toolkit
- REST API development
- JWT authentication
- Authorization and protected routes
- MongoDB and Mongoose
- Backend middleware
- File uploads
- Payment integration
- API security
- Frontend performance
- Deployment

---

🔮 Future Improvements

- Product reviews and ratings
- Wishlist
- Advanced filtering
- Order tracking
- Better admin analytics
- Performance optimization
- Improved security
- Automated testing

---

👨‍💻 Author

Sahil Ayre

Nuvora is a personal project built to strengthen my understanding of modern full-stack web development and real-world application architecture.

---

📄 License

This project is for educational and personal development purposes.
