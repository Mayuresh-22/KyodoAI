// Avanish Code

import { useState, useMemo } from "react";
import { ArrowRight, User, DollarSign, Palette, FileText } from "lucide-react";
import { supabase } from  "../lib/supabaseClient";

interface RegistrationFormProps {
  onNavigate: (page: string) => void;
}

const steps = [
  { id: 1, title: "Basic Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Budget Range", icon: DollarSign, description: "Set your collaboration budget" },
  { id: 3, title: "Content Type", icon: Palette, description: "What content do you create?" },
  { id: 4, title: "Preferences", icon: FileText, description: "Invoicing and collaboration preferences" },
];

type FormData = {
  name: string;
  email: string;
  password?: string;
  company: string;
  minBudget: string;
  maxBudget: string;
  contentTypes: string;
  domain: string;
  autoInvoicing: boolean;
  paymentTerms: string;
  notes: string;
};

export default function RegistrationForm({ onNavigate }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(0); // Step 0 = Auth
  const [authMode, setAuthMode] = useState<"login" | "register">("register"); // Default to register
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    company: "",
    minBudget: "",
    maxBudget: "",
    contentTypes: "",
    domain: "",
    autoInvoicing: false,
    paymentTerms: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Step navigation
  const nextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  // Validation for each step
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return formData.name.trim() && formData.email.trim();
      case 2: return true;
      case 3: return formData.domain.trim();
      case 4: return true;
      default: return true;
    }
  }, [currentStep, formData]);

  // Generate temporary password
  const getPassword = (provided?: string) => {
    if (provided && provided.length >= 6) return provided;
    return `Temp-${Math.random().toString(36).slice(2)}-${Date.now()}!Aa`;
  };

  // UPDATED: Step 0 Authentication handler with real Supabase integration
  const handleAuth = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      if (authMode === "login") {
        // LOGIN FLOW: Sign in and go directly to dashboard
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email.trim(),
          password: authData.password,
        });
        
        if (error) throw error;
        
        // Successful login - go to dashboard/home
        onNavigate('dashboard');
        
      } else {
        // REGISTRATION FLOW: Sign up and proceed to profile details
        const password = getPassword(authData.password);
        const { data, error } = await supabase.auth.signUp({
          email: authData.email.trim(),
          password,
          options: {
            data: {
              email: authData.email.trim()
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          setUserId(data.user.id);
          // Pre-fill email in form data
          setFormData({ 
            ...formData, 
            email: authData.email.trim(), 
            password: authData.password || password 
          });
          alert("Registration successful! Please complete your profile setup.");
          setCurrentStep(1); // Move to personal details
        } else {
          throw new Error("Registration failed - no user data returned");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATED: Complete setup with real Supabase profile insertion
  const handleCompleteSetup = async () => {
    if (!userId) return setErrorMsg("User not signed up yet");
    
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Prepare profile data according to your database schema
      const profileData = {
        id: userId,
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        min_budget: formData.minBudget || null,
        max_budget: formData.maxBudget || null,
        content_niche: formData.domain || null, // Using domain as content_niche
        auto_generate_invoice: formData.autoInvoicing,
        guidelines: formData.notes.trim() || null,
      };

      // Insert into profiles table
      const { error } = await supabase
        .from("profiles")
        .insert([profileData]);

      if (error) throw error;

      setSuccessMsg("Profile setup complete! Redirecting...");
      setTimeout(() => onNavigate('dashboard'), 1500);
      
    } catch (err: any) {
      console.error("Profile setup error:", err);
      setErrorMsg(err.message || "Failed to complete profile setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-6 pt-28">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">Profile Setup</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">Configure your collaboration preferences</p>
          <button
            className="mt-4 text-orange-500 text-sm underline hover:text-orange-600 transition-colors"
            onClick={() => onNavigate('home')}
          >
            ← Back to Home
          </button>
        </div>

        {/* Step 0: Auth */}
        {currentStep === 0 && (
          <form className="bg-white shadow p-8 rounded-lg space-y-6">
            <div className="flex justify-between mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-full ${authMode === "login" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setAuthMode("login")}
                disabled={isSubmitting}
              >
                Login
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full ${authMode === "register" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setAuthMode("register")}
                disabled={isSubmitting}
              >
                Register
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full border rounded-lg px-3 py-2"
                  value={authData.email}
                  onChange={e => setAuthData({ ...authData, email: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full border rounded-lg px-3 py-2"
                  value={authData.password}
                  onChange={e => setAuthData({ ...authData, password: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <button
                type="button"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full mt-4 font-semibold transition-colors disabled:opacity-50"
                onClick={handleAuth}
                disabled={isSubmitting || !authData.email || !authData.password}
              >
                {isSubmitting ? "Processing..." : authMode === "login" ? "Login" : "Register"}
              </button>
              {errorMsg && <div className="text-red-600 text-sm mt-2">{errorMsg}</div>}
            </div>
          </form>
        )}

        {/* Progress Steps */}
        {currentStep > 0 && (
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentStep >= step.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                {index < steps.length - 1 && <div className={`h-1 w-8 mx-2 ${currentStep > step.id ? "bg-orange-500" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Steps 1-4 Content */}
        {currentStep > 0 && (
          <form className="bg-white shadow p-8 rounded-lg">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium mb-4 text-gray-700">Basic Information</h2>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    id="name"
                    className="w-full border rounded-lg px-3 py-2"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="formEmail" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    id="formEmail"
                    type="email"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={true} // Pre-filled from auth step
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="formPassword" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-xs text-gray-400">(optional - already set)</span>
                  </label>
                  <input
                    id="formPassword"
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="Leave blank to keep existing password"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company/Brand</label>
                  <input
                    id="company"
                    className="w-full border rounded-lg px-3 py-2"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium mb-4 text-gray-700">Budget Range</h2>
                <div className="flex gap-6">
                  <div className="flex-1 space-y-2">
                    <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700">Minimum Budget</label>
                    <select
                      value={formData.minBudget}
                      onChange={e => setFormData({ ...formData, minBudget: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      id="minBudget"
                      disabled={isSubmitting}
                    >
                      <option value="">Select minimum</option>
                      <option value="500">$500</option>
                      <option value="1000">$1,000</option>
                      <option value="2500">$2,500</option>
                      <option value="5000">$5,000</option>
                      <option value="10000">$10,000+</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700">Maximum Budget</label>
                    <select
                      value={formData.maxBudget}
                      onChange={e => setFormData({ ...formData, maxBudget: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      id="maxBudget"
                      disabled={isSubmitting}
                    >
                      <option value="">Select maximum</option>
                      <option value="2500">$2,500</option>
                      <option value="5000">$5,000</option>
                      <option value="10000">$10,000</option>
                      <option value="25000">$25,000</option>
                      <option value="unlimited">No Limit</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium mb-4 text-gray-700">Content & Domain</h2>
                <div className="space-y-2">
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                    Primary Domain/Industry *
                  </label>
                  <select
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    id="domain"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select your primary domain</option>
                    <option value="technology">Technology</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="fashion">Fashion</option>
                    <option value="fitness">Fitness</option>
                    <option value="food">Food & Beverage</option>
                    <option value="travel">Travel</option>
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contentTypes" className="block text-sm font-medium text-gray-700">Content Types You Create</label>
                  <textarea
                    id="contentTypes"
                    className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                    placeholder="e.g., YouTube videos, Instagram posts..."
                    value={formData.contentTypes}
                    onChange={e => setFormData({ ...formData, contentTypes: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium mb-4 text-gray-700">Preferences</h2>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Invoicing</p>
                    <p className="text-xs text-gray-500">Automatically generate invoices when deals are completed</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoInvoicing}
                    onChange={e => setFormData({ ...formData, autoInvoicing: e.target.checked })}
                    className="w-6 h-6"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    id="paymentTerms"
                    disabled={isSubmitting}
                  >
                    <option value="">Select payment terms</option>
                    <option value="net15">Net 15</option>
                    <option value="net30">Net 30</option>
                    <option value="net45">Net 45</option>
                    <option value="immediate">Immediate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea
                    id="notes"
                    className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                    placeholder="Any special requirements..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
              >
                Previous
              </button>
              <button
                type="button"
                className={`px-6 py-2 rounded-full transition-colors disabled:opacity-50 ${
                  currentStep === 4 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "bg-orange-100 hover:bg-orange-200 text-orange-600"
                }`}
                onClick={currentStep === 4 ? handleCompleteSetup : nextStep}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? "Processing..." : currentStep === 4 ? "Complete Setup" : "Next"}
                <ArrowRight className="inline w-4 h-4 ml-2" />
              </button>
            </div>

            {(errorMsg || successMsg) && (
              <div className="mt-4 space-y-2">
                {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
                {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}