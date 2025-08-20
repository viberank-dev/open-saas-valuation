import React, { useState } from 'react';
import { Loader2, DollarSign, Clock, Users, Share2 } from 'lucide-react';
import { ValuationData, AppCategory, FormErrors } from '../types';

interface ValuationFormProps {
  onCalculate: (data: ValuationData) => void;
  isCalculating: boolean;
  initialData: ValuationData;
}

const ValuationForm: React.FC<ValuationFormProps> = ({ onCalculate, isCalculating, initialData }) => {
  const [formData, setFormData] = useState<ValuationData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPreRevenue, setIsPreRevenue] = useState(false);
  const [isNotProfitable, setIsNotProfitable] = useState(false);


  const appCategories = [
    { value: 'b2b_saas', label: 'B2B SaaS', description: 'Business software & tools' },
    { value: 'mobile_app', label: 'Mobile App', description: 'Consumer/prosumer, non-game' },
    { value: 'game', label: 'Game', description: 'F2P or premium games' },
    { value: 'b2c_app', label: 'B2C App', description: 'Consumer subscription apps' },
    { value: 'other', label: 'Other', description: 'Everything else' },
  ] as const;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.appCategory) {
      newErrors.appCategory = 'Please select an app category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate(formData);
    }
  };

  const handlePreRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPreRevenue(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, mrr: 0, mrp: 0 }));
      setIsNotProfitable(true);
    } else {
      setIsNotProfitable(false);
    }
  };

  const handleNotProfitableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotProfitable(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, mrp: 0 }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Financial Performance */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-secondary-400" />
          <h3 className="text-base font-semibold text-white">Financial Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mrr" className="block text-xs font-medium text-gray-300 mb-1">
              Monthly Recurring Revenue (MRR)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                id="mrr"
                name="mrr"
                value={formData.mrr ?? ''}
                onChange={handleChange}
                min="0"
                placeholder="10,000"
                className={`w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm ${isPreRevenue ? 'bg-gray-800 cursor-not-allowed' : ''}`}
                disabled={isPreRevenue}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="mrp" className="block text-xs font-medium text-gray-300 mb-1">
              Monthly Recurring Profit (MRP)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                id="mrp"
                name="mrp"
                value={formData.mrp ?? ''}
                onChange={handleChange}
                min="0"
                placeholder="2,000"
                className={`w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm ${isNotProfitable ? 'bg-gray-800 cursor-not-allowed' : ''}`}
                disabled={isNotProfitable}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="costPerAcquisition" className="block text-xs font-medium text-gray-300 mb-1">
              Conversion Rate - Registration to Paid (%)
            </label>
            <div className="relative">
              <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">%</span>
              <input
                type="number"
                id="costPerAcquisition"
                name="costPerAcquisition"
                value={formData.costPerAcquisition ?? ''}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="2.5"
                className="w-full pl-3 pr-7 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="fixedMonthlyCosts" className="block text-xs font-medium text-gray-300 mb-1">
              Monthly Costs (servers, domain, LLM, ads...)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                id="fixedMonthlyCosts"
                name="fixedMonthlyCosts"
                value={formData.fixedMonthlyCosts ?? ''}
                onChange={handleChange}
                min="0"
                placeholder="500"
                className="w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center">
            <input
              id="pre-revenue"
              type="checkbox"
              checked={isPreRevenue}
              onChange={handlePreRevenueChange}
              className="h-4 w-4 text-secondary-600 bg-gray-700 border-gray-600 rounded focus:ring-secondary-500"
            />
            <label htmlFor="pre-revenue" className="ml-2 block text-xs font-medium text-gray-300">
              I'm Pre-Revenue
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="not-profitable"
              type="checkbox"
              checked={isNotProfitable}
              onChange={handleNotProfitableChange}
              className="h-4 w-4 text-secondary-600 bg-gray-700 border-gray-600 rounded focus:ring-secondary-500"
              disabled={isPreRevenue}
            />
            <label htmlFor="not-profitable" className="ml-2 block text-xs font-medium text-gray-300">
              I'm Not Profitable
            </label>
          </div>
        </div>
      </div>

      {/* User Traction */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-semibold text-white">User Traction</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="registrations" className="block text-xs font-medium text-gray-300 mb-1">
              Registrations per Month
            </label>
            <input
              type="number"
              id="registrations"
              name="registrations"
              value={formData.registrations ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="5,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="uniqueVisitors" className="block text-xs font-medium text-gray-300 mb-1">
              Unique Visitors per Month
            </label>
            <input
              type="number"
              id="uniqueVisitors"
              name="uniqueVisitors"
              value={formData.uniqueVisitors ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="50,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="appCategory" className="block text-xs font-medium text-gray-300 mb-1">
              App Category
            </label>
            <select
              id="appCategory"
              name="appCategory"
              value={formData.appCategory}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm ${errors.appCategory ? 'border-red-500' : 'border-gray-600'}`}
            >
              <option value="">Select Category</option>
              {appCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} - {category.description}
                </option>
              ))}
            </select>
            {errors.appCategory && <p className="mt-1 text-xs text-red-400">{errors.appCategory}</p>}
          </div>
          
          <div>
            <label htmlFor="avgServicePrice" className="block text-xs font-medium text-gray-300 mb-1">
              Average Service Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                id="avgServicePrice"
                name="avgServicePrice"
                value={formData.avgServicePrice ?? ''}
                onChange={handleChange}
                min="0"
                placeholder="50"
                className="w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-pink-400" />
          <h3 className="text-base font-semibold text-white">Social Media Presence</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="linkedinFollowers" className="block text-xs font-medium text-gray-300 mb-1">
              LinkedIn Followers
            </label>
            <input
              type="number"
              id="linkedinFollowers"
              name="linkedinFollowers"
              value={formData.linkedinFollowers ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="2,500"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="xFollowers" className="block text-xs font-medium text-gray-300 mb-1">
              X (Twitter) Followers
            </label>
            <input
              type="number"
              id="xFollowers"
              name="xFollowers"
              value={formData.xFollowers ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="5,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="redditKarma" className="block text-xs font-medium text-gray-300 mb-1">
              Reddit Karma
            </label>
            <input
              type="number"
              id="redditKarma"
              name="redditKarma"
              value={formData.redditKarma ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="12,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="youtubeSubscribers" className="block text-xs font-medium text-gray-300 mb-1">
              YouTube Subscribers
            </label>
            <input
              type="number"
              id="youtubeSubscribers"
              name="youtubeSubscribers"
              value={formData.youtubeSubscribers ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="3,500"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="instagramFollowers" className="block text-xs font-medium text-gray-300 mb-1">
              Instagram Followers
            </label>
            <input
              type="number"
              id="instagramFollowers"
              name="instagramFollowers"
              value={formData.instagramFollowers ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="8,500"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="tiktokFollowers" className="block text-xs font-medium text-gray-300 mb-1">
              TikTok Followers
            </label>
            <input
              type="number"
              id="tiktokFollowers"
              name="tiktokFollowers"
              value={formData.tiktokFollowers ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="15,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4" />
              <span>Calculate Valuation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ValuationForm;
