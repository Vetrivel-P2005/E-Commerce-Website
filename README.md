# E-Commerce-Website

## 1. E-Commerce Website (Full Stack)

**Objective:**  
Build a full-stack e-commerce platform that allows users to browse products, add them to a shopping cart, and complete a checkout process. Users will be able to create accounts, log in, and manage their cart. Admins can manage products.

**Key Features:**

### Home Page:
- Display a list of products with images, name, price, and an "Add to Cart" button.
- A search bar to filter products by name.
- Product categories to help users filter products based on type (optional).

### Product Details Page:
- Display detailed product information (description, reviews, and price).
- "Add to Cart" functionality.

### Cart Page:
- Display all added items with quantity and price.
- Users can change quantity or remove items.
- Display the total price of the cart.

### User Authentication:
- Login and Signup pages using JWT for secure authentication.
- Protect routes so only logged-in users can access the cart and checkout pages.

### Admin Panel (Optional):
- Admin users can add, update, or delete products.
- Admin dashboard showing all products and orders.

### Order Management (Optional):
- After checkout, users can view their past orders.

### Responsive Design:
- The app should be mobile-friendly.

**Tech Stack:**
- **Frontend:** React (JSX), React Router, Axios for API calls, CSS or TailwindCSS for styling.
- **Backend:** Node.js + Express, JWT for authentication, bcrypt for password hashing.
- **Database:** SQLite (or MongoDB for more complex relationships).

**API Endpoints:**
- `GET /api/products` — Fetch all products.
- `GET /api/products/:id` — Fetch details of a specific product.
- `POST /api/cart` — Add a product to the cart.
- `GET /api/cart` — Get the user's cart.
- `DELETE /api/cart/:id` — Remove a product from the cart.
- `POST /api/auth/login` — User login.
- `POST /api/auth/signup` — User registration.

**Learning Outcomes:**
- Full-stack development with React for the frontend and Node.js/Express for the backend.
- Using JWT and bcrypt for secure authentication.
- Implementing CRUD operations for products.
- Working with a database (SQLite) and understanding relationships between tables (Users, Products, Cart).
- Building a user interface with React Router for navigation and handling user interaction.

**Bonus:**
- Add product reviews and ratings functionality.
- Order history management.
