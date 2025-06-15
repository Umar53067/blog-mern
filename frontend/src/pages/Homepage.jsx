import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard.jsx';

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`); 
        console.log(res.data)
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

   fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Blogs</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading blogs...</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.length === 0 ? (
            <div className="text-center text-gray-600">No blogs available.</div>
          ) : (
            blogs.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
