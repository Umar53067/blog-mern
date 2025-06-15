import CommentSection from "../components/CommentSection";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user from localStorage
  const currentUser = useSelector((state)=>state.auth.user)
  const token = useSelector((state)=>state.auth.token)
  console.log("Token",token)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        console.log(res.data);
        
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog deleted successfully");
      navigate("/"); // Redirect to homepage
    } catch (err) {
      console.error("Failed to delete blog", err);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-500 text-lg animate-pulse">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-600 text-lg">Blog not found.</p>
      </div>
    );
  }

  const isAuthor = blog?.createdBy?._id === currentUser?.id;
  console.log("checking", isAuthor)

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full  bg-white  p-6">
        {blog.image && (
          <img
            src={`http://localhost:5000/${blog.image}`}
            alt={blog.title}
            className="w-full h-80 object-cover rounded mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{blog.title}</h1>
        <p className="text-gray-600 text-sm mb-4">
          Posted on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 leading-relaxed">{blog.content}</p>

        {/* Show buttons if current user is the author */}
        {isAuthor && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate(`/edit-blog/${blog._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      <CommentSection blogId={blog._id} />
      </div>
    </div>
  );
}

export default SingleBlogPage;
