import { useState } from 'react';
import { persistor } from '../app/store.js';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../feature/authSlice.js';
import { HiMenu, HiX } from 'react-icons/hi';

function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          MyBlog
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-2xl text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
              >
                Profile
              </Link>
              <Link
                to="/createpost"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Write Blog
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 shadow-md">
          {user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="block text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
              >
                Profile
              </Link>
              <Link
                to="/createpost"
                onClick={() => setIsOpen(false)}
                className="block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Write Blog
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
