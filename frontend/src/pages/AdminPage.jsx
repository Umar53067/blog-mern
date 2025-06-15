import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const admin = useSelector((state) => state.auth.user?.username);
  console.log(admin)

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users'); // Ensure your backend proxy or baseURL is set up
      console.log("Upcoming data checking",res.data)
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle adding a user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', newUser);
      setSuccess('User added successfully');
      setNewUser({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (admin !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-xl text-gray-700">🔐 Please login to access the admin dashboard.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>

      {/* Summary */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">User Statistics</h2>
        <p className="text-gray-600">Total Users: <strong>{users.length}</strong></p>
      </div>

      {/* Add User */}
      <div className="bg-white shadow p-4 rounded mb-8">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="border px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-1 md:col-span-3"
          >
            Add User
          </button>
        </form>
      </div>

      {/* User List Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
