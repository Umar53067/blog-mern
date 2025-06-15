import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
       await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('✅ Post created successfully!');
      setFormData({ title: '', content: '', image: null });
      setPreviewImage(null);

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || '❌ Post creation failed. Please try again.');
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-xl text-gray-700">🔐 Please login to create a post.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">📢 Create New Post</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <textarea
          name="content"
          placeholder="Post Content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full mb-4"
        />

        {previewImage && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded shadow"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          🚀 Publish Post
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
