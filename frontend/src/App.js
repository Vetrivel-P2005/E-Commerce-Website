import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { ShoppingCart, User, Search, Star, Plus, Minus, Trash2, Package } from 'lucide-react';
import './index.css';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Context for managing authentication and cart state
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// API functions
const apiService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  async getProducts(search = '', category = '', page = 1) {
    const response = await api.get('/products', {
      params: { search, category, page, limit: 12 }
    });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  async updateCartQuantity(productId, quantity) {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  async removeFromCart(productId) {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  async checkout(shippingAddress) {
    const response = await api.post('/cart/checkout', { shippingAddress });
    return response.data;
  }
};

// App Context Provider
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      loadCart();
    }
  }, []);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      await loadCart();
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.register(name, email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }

    try {
      const updatedCart = await apiService.addToCart(product._id, quantity);
      setCart(updatedCart);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await apiService.updateCartQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedCart = await apiService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove from cart');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product?.price * item.quantity || 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    user,
    cart,
    products,
    setProducts,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Error Display Component
const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
      <div className="flex justify-between items-center">
        <span>{error}</span>
        <button onClick={onClose} className="ml-4 text-red-700 hover:text-red-900">
          ×
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ currentPage, setCurrentPage, searchTerm, setSearchTerm }) => {
  const { user, logout, getCartItemsCount } = useApp();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            ShopEasy
          </h1>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 hover:bg-blue-700 rounded-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{user.name}</span>
                <button
                  onClick={logout}
                  className="text-sm bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('auth')}
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart, user, setError } = useApp();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-600">
              ({product.numReviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isAddingToCart ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Products Page
const ProductsPage = ({ searchTerm, selectedCategory, setSelectedCategory }) => {
  const { products, setProducts, loading } = useApp();
  const categories = ['all', 'Electronics', 'Clothing', 'Fashion', 'Sports'];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiService.getProducts(searchTerm, selectedCategory === 'all' ? '' : selectedCategory);
        setProducts(response.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      }
    };

    loadProducts();
  }, [searchTerm, selectedCategory, setProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};

// Cart Page
const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, user } = useApp();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }
    
    const shippingAddress = {
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'US'
    };

    try {
      await apiService.checkout(shippingAddress);
      alert('Order placed successfully!');
    } catch (error) {
      alert('Checkout failed. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Start shopping to add items to your cart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {cart.map(item => (
              <div key={item.product?._id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.product?.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.product?.description}</p>
                  <p className="text-blue-600 font-bold text-lg">${item.product?.price?.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.product?._id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">{item.product?.name} × {item.quantity}</span>
                  <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Page (Login/Register)
const AuthPage = ({ setCurrentPage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { login, register, loading, error } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      setCurrentPage('home');
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { error, setError } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'cart':
        return <CartPage />;
      case 'auth':
        return <AuthPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <ProductsPage
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorAlert error={error} onClose={() => setError('')} />
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

// Wrap App with AppProvider
const AppWithProvider = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWithProvider;