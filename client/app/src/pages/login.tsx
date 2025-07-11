import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/img/logo.png';

function Login() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMessage('');
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      localStorage.setItem('user', JSON.stringify(result.user));
      
      navigate('/home', { 
        state: { 
          message: 'Successfully logged in with Google!',
          user: result.user
        }
      });
      
    } catch (err: any) {
      console.error('Google login error:', err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else {
        setError(err.message || 'An error occurred during Google login');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        
        switch (status) {
          case 401:
            setError('Invalid email or password. Please try again.');
            break;
          case 400:
            setError('Please enter both email and password.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(message || 'An error occurred during login');
        }
      } else {
        setError('Network error. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(https://media.istockphoto.com/id/1919116321/photo/aerial-view-of-famous-beach-of-the-south-coast-of-sri-lanka-area-near-the-town-of-weligama.jpg?s=612x612&w=0&k=20&c=c-ZIXo_vHFlR_WQ-Ba_Zg9KIAerRoeKsvc3QGipqiIU=)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <img src={logo} alt="logo" className="h-10 absolute left-5 top-[15px] z-20" />
      <div className="absolute inset-0 backdrop-blur-md bg-opacity-02"></div>
      
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-30">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login to Your Account</h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <hr className="w-full border-gray-300 mb-4" />
          <span className="text-gray-500">OR</span>
          <hr className="w-full border-gray-300 mt-4" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          {googleLoading ? 'Logging in...' : 'Continue with Google'}
        </button>

        <div className="mt-4 text-center space-y-2">
          <a href="/forgot-password" className="text-blue-600 hover:text-blue-500 text-sm">
            Forgot your password?
          </a>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;