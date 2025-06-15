import { Blog } from '../models/blog.models.js';

export const getAllPosts = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("createdBy", "username email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `images/${req.file.filename}` : null;
  try {
    const blog = new Blog({ title, content, image, createdBy: req.user._id });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `images/${req.file.filename}` : null;
  const update = { title, content };
  if (image) update.image = image;

  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Blog not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

export const deletePost = async (req, res) => {
  try {
      console.log("This is req.params",req.params.id)
    const id = req.params.id
    console.log(id);
    
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy", "username email");
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post' });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.query.userId });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user blogs' });
  }
};
