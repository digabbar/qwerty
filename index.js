const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 29 }
];

const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
  { id: 2, name: 'Phone', price: 599, category: 'Electronics' },
  { id: 3, name: 'Book', price: 19, category: 'Education' },
  { id: 4, name: 'Chair', price: 149, category: 'Furniture' }
];

const todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build an API', completed: true },
  { id: 3, task: 'Deploy to cloud', completed: false },
  { id: 4, task: 'Write documentation', completed: false }
];

// Routes

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Simple Express API!',
    version: '1.0.0',
    endpoints: [
      'GET /users - Get all users',
      'GET /users/:id - Get user by ID',
      'GET /products - Get all products',
      'GET /products/:id - Get product by ID',
      'GET /todos - Get all todos',
      'GET /todos/:id - Get todo by ID',
      'GET /stats - Get API statistics',
      'GET /health - Health check'
    ]
  });
});

// Users endpoints
app.get('/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Products endpoints
app.get('/products', (req, res) => {
  const { category } = req.query;
  
  let filteredProducts = products;
  if (category) {
    filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
});

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Todos endpoints
app.get('/todos', (req, res) => {
  const { completed } = req.query;
  
  let filteredTodos = todos;
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTodos = todos.filter(t => t.completed === isCompleted);
  }
  
  res.json({
    success: true,
    count: filteredTodos.length,
    data: filteredTodos
  });
});

app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  res.json({
    success: true,
    data: todo
  });
});

// Stats endpoint
app.get('/stats', (req, res) => {
  const completedTodos = todos.filter(t => t.completed).length;
  const avgProductPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      totalProducts: products.length,
      totalTodos: todos.length,
      completedTodos: completedTodos,
      pendingTodos: todos.length - completedTodos,
      averageProductPrice: Math.round(avgProductPrice),
      averageUserAge: Math.round(users.reduce((sum, u) => sum + u.age, 0) / users.length)
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableEndpoints: [
      'GET /',
      'GET /users',
      'GET /users/:id',
      'GET /products',
      'GET /products/:id',
      'GET /todos',
      'GET /todos/:id',
      'GET /stats',
      'GET /health'
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📍 Visit: http://localhost:${port}`);
  console.log('📚 Available endpoints:');
  console.log('   GET / - API info');
  console.log('   GET /users - All users');
  console.log('   GET /products - All products');
  console.log('   GET /todos - All todos');
  console.log('   GET /stats - API statistics');
  console.log('   GET /health - Health check');
});