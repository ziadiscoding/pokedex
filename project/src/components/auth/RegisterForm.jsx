import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import logo from '../../assets/ico/logo.svg';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return;
        }

        setIsLoading(true);
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/pokedex');
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-dark register-section">
            <div className="absolute inset-0 bg-gradient-radial from-primary-light/20 via-primary/10 to-transparent" />

            <div className="w-full max-w-md p-6 relative">
                <div className="bg-surface/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
                    <div className="p-8">
                        <div className="text-center mb-8 register-description">
                            <img src={logo} alt="Pokemon Logo" className='register-logo' />
                            <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
                            <p className="text-gray-400 mt-2">Join the world of Pokémon trainers</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />

                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <div className="text-center mt-4">
                                <p className="text-gray-400">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-accent-purple hover:text-accent-purple/90">
                                        Sign In
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

export default RegisterForm;