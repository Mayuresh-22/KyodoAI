import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  contentNiche: string;
  minBudget: string;
  maxBudget: string;
  autoGenerateInvoice: boolean;
  guidelines: string;
}

const contentNiches = [
  'Technology & Software',
  'Health & Wellness',
  'Finance & Investing',
  'E-commerce & Retail',
  'Education & Training',
  'Marketing & Advertising',
  'Travel & Hospitality',
  'Food & Beverage',
  'Entertainment & Media',
  'Other'
];

export const RegisterForm: React.FC = () => {
  const { setAuthMode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    contentNiche: '',
    minBudget: '',
    maxBudget: '',
    autoGenerateInvoice: true,
    guidelines: ''
  });

  const { setCurrentPage } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign up the user with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // 2. Create the user profile in your profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              email: formData.email,
              content_niche: formData.contentNiche,
              min_budget: formData.minBudget,
              max_budget: formData.maxBudget,
              auto_generate_invoice: formData.autoGenerateInvoice,
              guidelines: formData.guidelines
            }
          ]);

        if (profileError) throw profileError;

        // Registration successful
        console.log('Registration successful:', authData.user);
        setCurrentPage('dashboard');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Content Niche */}
          <div>
            <label htmlFor="contentNiche" className="block text-sm font-medium text-gray-700">
              Content Niche
            </label>
            <select
              id="contentNiche"
              name="contentNiche"
              required
              value={formData.contentNiche}
              onChange={(e) => setFormData({ ...formData, contentNiche: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select a niche</option>
              {contentNiches.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700">
                Min Budget ($)
              </label>
              <input
                id="minBudget"
                name="minBudget"
                type="number"
                min="0"
                required
                value={formData.minBudget}
                onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700">
                Max Budget ($)
              </label>
              <input
                id="maxBudget"
                name="maxBudget"
                type="number"
                min="0"
                required
                value={formData.maxBudget}
                onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Auto Generate Invoice Toggle */}
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <span className="text-sm font-medium text-gray-900">Auto Generate Invoice</span>
              <span className="text-sm text-gray-500">
                Generate invoices automatically for new deals
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={formData.autoGenerateInvoice}
              onClick={() =>
                setFormData({ ...formData, autoGenerateInvoice: !formData.autoGenerateInvoice })
              }
              className={`${formData.autoGenerateInvoice ? 'bg-orange-500' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            >
              <span
                aria-hidden="true"
                className={`${formData.autoGenerateInvoice ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>

          {/* Additional Guidelines */}
          <div>
            <label htmlFor="guidelines" className="block text-sm font-medium text-gray-700">
              Additional Guidelines
            </label>
            <textarea
              id="guidelines"
              name="guidelines"
              rows={4}
              value={formData.guidelines}
              onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Any specific requirements or preferences..."
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Create Account'}
            </button>

            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
