import { updateProfile } from "./actions";

export default function Onboarding() {
  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Onboarding</h1>

        <form action={updateProfile} className="space-y-6">
          {/* Display Name */}
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-white mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
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
              id="age"
              name="age"
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
