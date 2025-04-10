import Register from './Register'; 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Container, TextField,
  Card, CardContent, CardMedia, Grid, Box
} from '@mui/material';
import axios from 'axios';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './Login'; // ✅ Import Login from separate file

// Placeholder components (you can customize them)
const AdminPage = () => <Container><h2>Admin Dashboard</h2></Container>;
const Dashboard = () => <Container><h2>User Dashboard</h2></Container>;

// ---------------------- Register ----------------------
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      alert('Registration successful');
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
        </form>
      </Box>
    </Container>
  );
};

// ---------------------- Products ----------------------
const ProductList = ({ token, isAdmin }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    tags: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        tags: newProduct.tags.split(',').map(tag => tag.trim()),
        price: parseFloat(newProduct.price)
      };
      const res = await axios.post('http://localhost:5000/api/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts([...products, res.data]);
      setNewProduct({
        name: '',
        category: '',
        price: 0,
        description: '',
        image: '',
        tags: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Products</Typography>

      {isAdmin && (
        <Box sx={{ mb: 4, p: 2, border: '1px dashed grey' }}>
          <Typography variant="h6" gutterBottom>Add New Product</Typography>
          <Grid container spacing={2}>
            {['name', 'category', 'price', 'image', 'description', 'tags'].map((field, i) => (
              <Grid item xs={12} sm={field === 'description' || field === 'tags' ? 12 : 6} key={i}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  multiline={field === 'description'}
                  rows={field === 'description' ? 2 : 1}
                  value={newProduct[field]}
                  onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAddProduct}>Add Product</Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                <Typography variant="body1">${product.price}</Typography>
                <Typography variant="body2">{product.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// ---------------------- AI Chat ----------------------
const AIChat = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/ai/recommend',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error' }]);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>AI Product Assistant</Typography>

      <Box sx={{
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        p: 2,
        mb: 2,
        overflowY: 'auto'
      }}>
        {messages.length === 0 ? (
          <Typography>Ask me about products you're interested in!</Typography>
        ) : (
          messages.map((msg, i) => (
            <Box key={i} sx={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              mb: 1
            }}>
              <Typography sx={{
                display: 'inline-block',
                p: 1,
                backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: '4px'
              }}>
                {msg.text}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about products..."
        />
        <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>Send</Button>
      </Box>
    </Container>
  );
};

// ---------------------- App ----------------------
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role || '');
      } catch (err) {
        console.error('Invalid token');
      }
    } else {
      localStorage.removeItem('token');
      setUserRole('');
    }
  }, [token]);

  const handleLogout = () => {
    setToken('');
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Product Discovery
          </Typography>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/products">Products</Button>
              <Button color="inherit" component={Link} to="/ai-chat">AI Assistant</Button>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              {userRole === 'admin' && (
                <Button color="inherit" component={Link} to="/admin">Admin</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList token={token} isAdmin={userRole === 'admin'} />} />
        <Route path="/ai-chat" element={<AIChat token={token} />} />
        <Route path="/admin" element={
          <ProtectedRoute token={token} role={userRole} allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute token={token} role={userRole} allowedRoles={['user', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
