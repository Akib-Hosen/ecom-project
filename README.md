# bdMart - E-Commerce Platform 🛒

bdMart is a modern, full-stack e-commerce web application designed with a clean UI and robust backend architecture. It features a complete shopping experience for customers and a comprehensive management dashboard for sellers/admins.

## 🚀 Tech Stack

### Frontend
* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
* **HTTP Client:** Axios
* **State Management:** React Context API

### Backend
* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Authentication:** JWT (JSON Web Tokens) & bcryptjs
* **Image Hosting:** Cloudinary

---

## ✨ Features

### Customer Features
* **Authentication:** Secure registration and login.
* **Product Catalog:** Browse products by category.
* **Shopping Cart:** Add, update, and remove items from the cart.
* **Checkout:** Place orders with Cash on Delivery (COD).
* **Order History:** View past orders and track their status.

### Admin/Seller Features
* **Role-based Access:** Dedicated admin panel secured by JWT role verification.
* **Product Management:** Create, edit, and soft-delete products.
* **Image Uploads:** Direct integration with Cloudinary for product images.
* **Category Management:** Organize products into categories.
* **Order Management:** View all orders and update statuses (Pending, Processing, Shipped, Delivered, Cancelled).
* **User Management:** View registered users and manage accounts.

---

## 🛠️ Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **PostgreSQL** installed and running
* A **Cloudinary** account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ecom-project.git
cd ecom-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_postgres_user
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=ecom_db

# Security
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

Start the backend development server:
```bash
npm run start:dev
```
*Note: TypeORM is configured to automatically synchronize and create the database tables on startup.*

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Default Admin Account
If you need to access the seller dashboard on a fresh database installation, create a new account via the UI and select the **Seller** role, or use your existing database admin account.

To access the admin panel, login and navigate to: `http://localhost:3000/seller/dashboard`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
