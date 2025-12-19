'use client';

import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from './actions';

type ProfileData = {
  display_name: string;
  age_range: string;
  sex: string;
  experience_level: string;
  primary_goal: string;
  training_days_per_week: number;
  preferred_style: string;
  available_equipment: string;
  injuries: string | null;
};

export default function Onboarding() {
  const [formData, setFormData] = useState<ProfileData>({
    display_name: '',
    age_range: '',
    sex: '',
    experience_level: '',
    primary_goal: '',
    training_days_per_week: 0,
    preferred_style: '',
    available_equipment: '',
    injuries: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setFormData({
            display_name: profile.display_name || '',
            age_range: profile.age_range || '',
            sex: profile.sex || '',
            experience_level: profile.experience_level || '',
            primary_goal: profile.primary_goal || '',
            training_days_per_week: profile.training_days_per_week || 0,
            preferred_style: profile.preferred_style || '',
            available_equipment: profile.available_equipment || '',
            injuries: profile.injuries || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'training_days_per_week' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);
    await updateProfile(formDataObj);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center text-white">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Onboarding</h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Display Name */}
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-white mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age_range" className="block text-sm font-medium text-white mb-2">
              Age
            </label>
            <select
              id="age_range"
              name="age_range"
              value={formData.age_range}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select age range</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65+">65+</option>
            </select>
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-white mb-2">
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label htmlFor="experience_level" className="block text-sm font-medium text-white mb-2">
              Experience Level
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Primary Goal */}
          <div>
            <label htmlFor="primary_goal" className="block text-sm font-medium text-white mb-2">
              Primary Goal
            </label>
            <select
              id="primary_goal"
              name="primary_goal"
              value={formData.primary_goal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select primary goal</option>
              <option value="build-muscle">Build Muscle</option>
              <option value="lose-weight">Lose Weight</option>
              <option value="increase-strength">Increase Strength</option>
              <option value="improve-endurance">Improve Endurance</option>
              <option value="general-fitness">General Fitness</option>
              <option value="athletic-performance">Athletic Performance</option>
            </select>
          </div>

          {/* Training Days Per Week */}
          <div>
            <label htmlFor="training_days_per_week" className="block text-sm font-medium text-white mb-2">
              Training Days Per Week
            </label>
            <select
              id="training_days_per_week"
              name="training_days_per_week"
              value={formData.training_days_per_week}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select training days</option>
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
              <option value="7">7 days</option>
            </select>
          </div>

          {/* Preferred Style */}
          <div>
            <label htmlFor="preferred_style" className="block text-sm font-medium text-white mb-2">
              Preferred Training Style
            </label>
            <select
              id="preferred_style"
              name="preferred_style"
              value={formData.preferred_style}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select preferred style</option>
              <option value="weightlifting">Weightlifting</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="crossfit">CrossFit</option>
              <option value="yoga">Yoga</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Available Equipment */}
          <div>
            <label htmlFor="available_equipment" className="block text-sm font-medium text-white mb-2">
              Available Equipment
            </label>
            <select
              id="available_equipment"
              name="available_equipment"
              value={formData.available_equipment}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select available equipment</option>
              <option value="full-gym">Full Gym</option>
              <option value="home-gym">Home Gym</option>
              <option value="dumbbells-only">Dumbbells Only</option>
              <option value="resistance-bands">Resistance Bands</option>
              <option value="bodyweight-only">Bodyweight Only</option>
              <option value="limited">Limited Equipment</option>
            </select>
          </div>

          {/* Injuries */}
          <div>
            <label htmlFor="injuries" className="block text-sm font-medium text-white mb-2">
              Injuries or Limitations
            </label>
            <textarea
              id="injuries"
              name="injuries"
              value={formData.injuries || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Please describe any injuries or physical limitations..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Complete Onboarding
          </button>
        </form>
      </div>
    </main>
  );
}
