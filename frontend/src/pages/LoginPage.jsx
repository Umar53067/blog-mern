import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { loginSuccess} from '../feature/authSlice.js'

function LoginPage() {


  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate()

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setSuccess('Login successful');
      if(res.data.message == 'Login successful'){
        dispatch(loginSuccess(res.data))
        console.log(res.data)
        if(res.data.user.username == 'admin'){
          navigate('/admin')
        }else{
          navigate('/')
        }
        
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Log In</h2>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
        <p className='mt-1'>Want to create new account ? <Link to={'/signup'} className='text-blue-500'>Signup</Link></p>

      </form>
    </div>
  );
}

export default LoginPage;
