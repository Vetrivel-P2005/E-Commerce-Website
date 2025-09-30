const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    numReviews: 128
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Advanced fitness tracking and smart notifications',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    numReviews: 89
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton tee',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 100,
    rating: 4.3,
    numReviews: 56
  },
  {
    name: 'Gaming Laptop Pro 15',
    description: 'Powerful gaming laptop with RTX graphics and fast refresh display',
    price: 1499.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 20,
    rating: 4.8,
    numReviews: 210
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated bottle keeps drinks hot or cold for 24 hours',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1560841615-4e4c90b7b62a?w=400&h=400&fit=crop',
    category: 'Accessories',
    stock: 200,
    rating: 4.6,
    numReviews: 342
  },
  {
    name: 'Running Shoes X200',
    description: 'Lightweight running shoes with superior cushioning',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Sports',
    stock: 75,
    rating: 4.4,
    numReviews: 178
  },
  {
    name: 'Classic Leather Wallet',
    description: 'Minimalist and stylish genuine leather wallet',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=400&h=400&fit=crop&auto=format&q=80',
    category: 'Accessories',
    stock: 90,
    rating: 4.2,
    numReviews: 67
  },
  {
    name: 'Noise Cancelling Earbuds',
    description: 'Compact earbuds with immersive sound and ANC technology',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1606813902779-5d9f1a6e2dff?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 120,
    rating: 4.5,
    numReviews: 134
  },
  {
    name: 'Smartphone Tripod Stand',
    description: 'Adjustable tripod stand compatible with all smartphones',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1580894742904-6c36f5f8d6d3?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 60,
    rating: 4.3,
    numReviews: 54
  },
  {
    name: 'Modern Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and touch control',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=400&fit=crop',
    category: 'Home',
    stock: 85,
    rating: 4.4,
    numReviews: 92
  },
  {
    name: 'Cotton Hoodie',
    description: 'Soft and warm cotton hoodie for everyday wear',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1612423284934-46aa6c039f87?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 150,
    rating: 4.6,
    numReviews: 101
  },
  {
    name: 'Fiction Bestseller Book',
    description: 'Gripping novel from an award-winning author',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop',
    category: 'Books',
    stock: 300,
    rating: 4.8,
    numReviews: 420
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Loud and clear sound with deep bass, water-resistant',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 110,
    rating: 4.5,
    numReviews: 198
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Non-slip yoga mat with extra cushioning and durability',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1603286463744-fd3f2f7f69f2?w=400&h=400&fit=crop',
    category: 'Sports',
    stock: 140,
    rating: 4.7,
    numReviews: 233
  },
  {
    name: 'Digital DSLR Camera',
    description: 'Professional DSLR camera with 24MP lens and 4K video support',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 25,
    rating: 4.9,
    numReviews: 65
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
