// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './db/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Blog } from './models/blog.models.js'; // Ensure Blog model is correctly defined
import {User} from './models/user.models.js';

// Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for serving uploaded images
app.use('/images', express.static('public/images'));



// ---------------------
// Multer Setup for Image Upload
// ---------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ---------------------
// JWT Middleware to Protect Routes
// ---------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: user._id }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ---------------------
// Auth Routes
// ---------------------

//Admin routes

app.get('/users', async (req,res)=>{
    console.log("Route hit")
  try {
    const response = await User.find()
    console.log(response);
    res.json({response})
    
  } catch (error) {
    
  }
})


// Sign up route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    console.log(user);
    
    res.status(200).json({ user : {
    id : user._id,
    username : user.username,
    email : user.email,
    } , message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/profile/:id', async (req, res) => {
  const id = req.params.id;  // ✅ Correct

  console.log('Received user ID:', id);

  try {
    const user = await User.findById(id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});





// ---------------------
// Blog Routes (Protected)
// ---------------------

//Fetch all blog posts
app.get('/posts', async (req, res) => {
  try {
    const response = await Blog.find();
    res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});


// Create a new blog post (with image upload)
app.post('/posts', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `images/${req.file.filename}` : null;


    const newBlogPost = new Blog({
      title,
      content,
      image,
      createdBy: req.user.id
    });

    await newBlogPost.save();

    res.status(201).json({ message: 'Post created successfully!', post: newBlogPost });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post. Please try again.' });
  }
});

// Update a blog post (with image upload)
app.put('/blog/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `images/${req.file.filename}` : null;

    const updatedData = { title, content };
    if (image) updatedData.image = image;

    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post updated successfully!', post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post. Please try again.' });
  }
});

// Fetch blogs created by a specific user
app.get('/blogs', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const blogs = await Blog.find({ createdBy: userId });
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blogs for the user' });
  }
});

//For fetching single blog post
app.get('/blog/:id', async (req, res) => {
  const { id } = req.params; // ✅ Correctly using req.params

  try {
    const blog = await Blog.findById(id).populate("createdBy", "username email"); 
    // ✅ Populating author info (only selected fields)

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog); // ✅ Sending blog as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch the blog' });
  }
});
//For deleting a blog
// Delete a blog post (only by the creator)
app.delete('/posts/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Provided by authMiddleware

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the current user is the creator of the blog
    if (blog.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
});


// ---------------------
// Start Server
// ---------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
