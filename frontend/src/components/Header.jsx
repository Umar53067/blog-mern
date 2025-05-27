import {persistor} from '../app/store.js'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../feature/authSlice.js';

function Header() {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const dispatch = useDispatch()
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          MyBlog
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-4">
          {user ? ( <>

            <Link to={`/profile/${user.id}`}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition"
            >
              Profile
            </Link>

            <Link to='/createpost'
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Write Blog
            </Link>

            <button
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              onClick={() => {
                dispatch(logout());
                persistor.purge();
              }}
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
    </header>
  );
}

export default Header;
