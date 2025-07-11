import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/img/logo.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setEmail('');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'An error occurred while sending reset email');
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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Reset Your Password</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we will send you a link to reset your password.
        </p>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-500 text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
