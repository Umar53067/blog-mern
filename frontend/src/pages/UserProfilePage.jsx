import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Destructure id from params
  const { id } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${id}`);
        console.log(userRes)
        // Fetch blogs for the user
        const blogsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs?userId=${id}`);

        setUser(userRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-600 text-lg">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.username}</h1>
          <p className="text-gray-600 mb-1"><span className="font-semibold">Email:</span> {user.email}</p>
          <p className="text-gray-500 text-sm">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Blog Posts Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Blog Posts</h2>
          {blogs.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-gray-500">
              You haven't written any blogs yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {blog.image && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${blog.image}`}
                      alt={blog.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{blog.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{blog.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Posted on {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
