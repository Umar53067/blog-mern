import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={`${import.meta.env.VITE_API_URL}/${blog.image}`}
        //src={`/${blog.image}`}
        alt={blog.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {blog.content}
        </p>
        <Link
          to={`/blog/${blog._id}`} // Link to a detailed blog page (You can set up routing for this)
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
