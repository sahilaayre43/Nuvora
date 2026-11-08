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
- Email verification and password reset links
- Online payments with Razorpay
- Protected routes
- Backend validation and error handling

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
- Email service — Account verification and password reset
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

### Frontend deployment on Vercel

Import the repository into Vercel and set `frontend` as the root directory. Use
`npm run build` as the build command and `dist` as the output directory.

Add `VITE_API_URL` to the Vercel project environment variables, using the base
URL of your Render backend (for example, `https://your-backend.onrender.com`,
without `/api`). The frontend build fetches the product and category catalogs
from Render and includes them as static files. Visitors can browse products
without waiting for Render to wake up; account, order, review, and admin actions
still use the live backend.
The storefront refreshes the static catalog from Render in the background when
visitors open it, so the published products remain usable immediately while
newer products appear once the backend responds.

Set `FRONTEND_URL` on Render to your Vercel site URL so the backend accepts
browser requests from the deployed frontend. Each Vercel deployment refreshes
the static catalog, so redeploy after changing products or categories.

---

🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@gmail.com
SMTP_PASS=your_16_character_google_app_password
EMAIL_FROM=NUVORA Support <you@gmail.com>

FRONTEND_URL=https://nuvora-ecom.vercel.app
EMAIL_VERIFICATION_ENABLED=false
NODE_ENV=development

For local development, optionally create a `.env` file inside `frontend` to
point the Vite API proxy at a different backend URL:

VITE_API_PROXY_TARGET=http://127.0.0.1:5000

For a local production build that should generate the same static catalog, set
`VITE_API_URL` to your backend's base URL as well.

Never commit your ".env" files or API keys to GitHub.

The backend accepts `MONGODB_URI` (recommended) or the legacy `MONGODB_URL`
variable for the MongoDB connection string.
Email is sent through SMTP using Nodemailer. For a no-cost Gmail setup, enable
2-Step Verification on your Google account, create an App Password in your
Google Account security settings, and use that password as `SMTP_PASS` (not
your regular Gmail password). Set `SMTP_USER` and `EMAIL_FROM` to that Gmail
address. The default SMTP port is 587; use port 465 with `SMTP_SECURE=true` as
shown above. Gmail and other SMTP providers apply their own sending limits and
policies, and some hosting providers restrict outbound SMTP connections.
The mailer also accepts the existing `GMAIL_USER` and `GMAIL_PASSWORD`
variables; with those set, it defaults to Gmail SMTP on port 465. If
`EMAIL_FROM` is omitted, the authenticated email address is used as the sender.

Set `EMAIL_VERIFICATION_ENABLED=true` to require email verification at signup
and login. It defaults to `false` so accounts can be created and signed into
without sending verification email while email delivery is being configured.
When enabled, verification and password-reset links expire after one hour and
can only be used once. Set
`FRONTEND_URL` to the frontend origin so those links return to the correct
pages. Resetting a password invalidates the account's existing sign-in tokens.
With verification enabled, new signups are held in a temporary
`PendingRegistration` collection; a `User` record is created only after the
verification link is used. Pending signups are automatically deleted after one
hour. Existing unverified accounts can request a new verification email from
the sign-in page.

---

▶️ Running the Project

From the project root, start both services together:

```bash
npm run dev
```

The backend waits for MongoDB before listening on port 5000. If MongoDB is unavailable or its URI is missing, startup exits with a clear error instead of leaving the frontend running against a dead API. The combined development command stops both services if either one exits.

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
