import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {useSelector} from 'react-redux'
function EditPostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = useSelector((state)=>state.auth.token)
  if(!token){
    navigate('/')
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/blog/${id}`);
        setFormData(res.data); 
      } catch (err) {
        setError('Failed to fetch post. Please try again.',err);
      }
    };
    
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const updatedForm = new FormData();
    updatedForm.append('title', formData.title);
    updatedForm.append('content', formData.content);
    if (formData.image) {
      updatedForm.append('image', formData.image);
    }

    try {
      const res = await axios.put(`http://localhost:5000/blog/${id}`, updatedForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res)
      setSuccess('Post updated successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect to home page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Post update failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Post</h2>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}

        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Post Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPostPage;
