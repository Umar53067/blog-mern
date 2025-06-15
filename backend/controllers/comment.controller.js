import { Comment } from '../models/comment.models.js';

// Create a comment
export const createComment = async (req, res) => {
  const { content, blogId } = req.body;
console.log("This is req.body",req.body)
  try {
    const newComment = new Comment({
      content,
      blog: blogId,
      createdBy: req.user._id,
    });

    await newComment.save();
console.log("This is newcomment",newComment)
    // Populate the createdBy field (for immediate frontend use)
    await newComment.populate('createdBy', 'username');

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Get comments for a blog post
export const getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 }); // Optional: show newest first

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};
