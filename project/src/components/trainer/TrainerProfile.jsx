import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import PokemonCollection from './PokemonCollection';
import Navbar from '../partials/Navbar';

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    trainerName: '',
    imgUrl: ''
  });

  const loadTrainerProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await trainerService.getProfile();
      const data = response.data;
      setTrainer(data);
      setFormData({
        trainerName: data.trainerName,
        imgUrl: data.imgUrl
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setTrainer(null);
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrainerProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (trainer) {
        await trainerService.updateProfile(formData);
      } else {
        await trainerService.createProfile(formData);
      }
      
      // Recharger le profil pour avoir les données à jour
      await loadTrainerProfile();
      setIsEditing(false);
    } catch (error) {
      setError(error.message || 'Failed to save profile');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-dark flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!trainer && !isEditing) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Welcome Trainer!</h2>
          <p className="text-gray-400 mb-8">Start your journey by creating your trainer profile</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-3 bg-accent-purple text-white rounded-xl font-semibold shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all"
          >
            Create Trainer Profile
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-primary/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {trainer ? 'Edit Profile' : 'Create Profile'}
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trainer Name
                  </label>
                  <input
                    type="text"
                    value={formData.trainerName}
                    onChange={(e) => setFormData({...formData, trainerName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imgUrl}
                    onChange={(e) => setFormData({...formData, imgUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500 transition-all"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-accent-purple hover:bg-accent-purple/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : trainer ? 'Save Changes' : 'Create Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="flex-1 bg-surface border border-accent-purple/30 text-accent-purple px-6 py-3 rounded-xl font-semibold hover:bg-accent-purple/10 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-primary/20 p-8 mb-8">
          <div className="flex items-center gap-8">
            <img
              src={trainer.imgUrl || '/default-trainer.png'}
              alt={trainer.trainerName}
              className="w-32 h-32 rounded-full object-cover border-4 border-accent-purple/20"
            />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{trainer.trainerName}</h2>
              <p className="text-gray-400 mb-4">Trainer since {new Date(trainer.creationDate).toLocaleDateString()}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-surface border border-accent-purple/30 text-accent-purple rounded-xl font-medium hover:bg-accent-purple/10 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-primary/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Pokémon Collection</h3>
          {trainer.pkmnSeen && trainer.pkmnCatch && (
            <PokemonCollection 
              seenPokemon={trainer.pkmnSeen}
              caughtPokemon={trainer.pkmnCatch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;