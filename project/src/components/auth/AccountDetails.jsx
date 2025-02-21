import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import logo from '../../assets/ico/logo.svg';
import Navbar from '../partials/Navbar';

const AccountDetails = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(prev => ({
      ...prev,
      username: user.username || '',
      email: user.email || '',
      password: '',
      confirmPassword: ''
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setFormData(prev => ({
      ...prev,
      username: user.username || '',
      email: user.email || '',
      password: '',
      confirmPassword: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    const updateData = {};
    if (formData.username && formData.username !== user.username) {
      updateData.username = formData.username;
    }
    if (formData.email && formData.email !== user.email) {
      updateData.email = formData.email;
    }
    if (formData.password) {
      updateData.password = formData.password;
    }

    if (Object.keys(updateData).length === 0) {
      setError('Aucune modification détectée');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.updateProfile(updateData);
      setIsEditing(false);

      if (response.requiresRelogin) {
        authService.softLogout();
        navigate('/login');
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Date invalide';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-dark flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container bg-surface-dark">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-surface-dark login-section">
        <div className="absolute inset-0 bg-gradient-radial from-primary-light/20 via-primary/10 to-transparent" />

        <div className="w-full max-w-md p-6 relative">
          <div className="bg-surface/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
            <div className="p-8">
              <div className="text-center mb-8 login-description">
                <img src={logo} alt="Pokemon Logo" className="login-logo" />
                <p className="text-gray-400 mt-2">Détails du compte</p>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="bg-surface-dark/50 rounded-xl border border-primary/20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-primary/10">
                      <p className="text-sm text-gray-400">Nom d'utilisateur</p>
                      <p className="text-white font-medium">{user?.username || 'Non disponible'}</p>
                    </div>
                    <div className="px-4 py-3 border-b border-primary/10">
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{user?.email || 'Non disponible'}</p>
                    </div>
                    <div className="px-4 py-3 border-b border-primary/10">
                      <p className="text-sm text-gray-400">Rôle</p>
                      <p className="text-white font-medium">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs ${
                          user?.role === 'ADMIN'
                            ? 'bg-accent-purple/20 text-accent-purple'
                            : 'bg-accent-blue/20 text-accent-blue'
                        }`}>
                          {user?.role || 'USER'}
                        </span>
                      </p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-400">Compte créé le</p>
                      <p className="text-white font-medium">
                        {formatDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleEdit}
                    className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white py-3 rounded-xl font-semibold shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all"
                  >
                    Modifier le profil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-semibold transition-all border border-red-500/20"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Nom d'utilisateur</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Nouveau mot de passe (optionnel)</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                      />
                    </div>

                    {formData.password && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-accent-purple hover:bg-accent-purple/90 text-white py-3 rounded-xl font-semibold shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Mise à jour...
                        </div>
                      ) : (
                        'Enregistrer'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 bg-surface border border-accent-purple/30 text-accent-purple py-3 rounded-xl font-semibold hover:bg-accent-purple/10 transition-all disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;