import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import logo from '../../assets/ico/logo.svg';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/pokedex');
    } catch (err) {
      setError(err.message || authError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark login-section" >
      <div className="absolute inset-0 bg-gradient-radial from-primary-light/20 via-primary/10 to-transparent" />

      <div className="w-full max-w-md p-6 relative">
        <div className="bg-surface/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
          <div className="p-8">
            <div className="text-center mb-8 login-description">
              <img src={logo} alt="Pokemon Logo" className='login-logo' />
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="text-gray-400 mt-2">Enter your trainer credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || authError) && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center text-sm">
                  {error || authError}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500 transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />

                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white py-3 rounded-xl font-semibold shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="text-accent-purple hover:text-accent-purple/90">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;