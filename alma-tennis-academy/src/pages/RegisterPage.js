import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="section-title">Create Account</h1>
          <p className="section-subtitle mx-auto">
            Join Alma Tennis Academy and get <span className="text-alma-lime font-bold">20% off</span> all items!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Full Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account & Get 20% Off'}
          </button>

          <p className="text-center text-sm text-alma-charcoal/60">
            Already have an account?{' '}
            <Link to="/login" className="text-alma-green font-semibold hover:text-alma-green-light">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
