import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    if (isAdmin) navigate('/admin', { replace: true });
    else navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="section-title">Welcome Back</h1>
          <p className="section-subtitle mx-auto">
            Log in to your account to enjoy member discounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-alma-charcoal/60">
            Don't have an account?{' '}
            <Link to="/register" className="text-alma-green font-semibold hover:text-alma-green-light">Register here</Link>
          </p>

          <div className="bg-alma-lime/10 rounded-lg p-4 text-center">
            <p className="text-sm text-alma-green font-medium">Register to get 20% off all items!</p>
          </div>
        </form>
      </div>
    </div>
  );
}
