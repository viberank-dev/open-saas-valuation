import React, { useState } from 'react';
import { 
  TrendingUp, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Lightbulb,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  InfoIcon,
  Share2
} from 'lucide-react';
import { ValuationCalculator } from '../utils/valuationCalculator';
import ShareModal from './ShareModal';

interface ValuationResultsProps {
  results: any;
  onReset: () => void;
}

const ValuationResults: React.FC<ValuationResultsProps> = ({ results, onReset }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-green-400 bg-green-900/20 border-green-700';
      case 'Medium-High':
        return 'text-emerald-400 bg-emerald-900/20 border-emerald-700';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'Medium-Low':
        return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'Low':
        return 'text-red-400 bg-red-900/20 border-red-700';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <CheckCircle className="w-4 h-4" />;
      case 'Medium-High':
      case 'Medium':
        return <InfoIcon className="w-4 h-4" />;
      case 'Medium-Low':
      case 'Low':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <InfoIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Main Valuation Range */}
      <div className="bg-gradient-to-br from-secondary-900/20 to-secondary-800/20 border border-secondary-700/50 rounded-lg p-4">
        <div className="text-center">
          <h3 className="text-base font-semibold text-white mb-2">Estimated Valuation Range</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl md:text-3xl font-bold text-secondary-400">
              {ValuationCalculator.formatCurrency(results.low)}
            </span>
            <span className="text-xl text-gray-400">-</span>
            <span className="text-2xl md:text-3xl font-bold text-secondary-400">
              {ValuationCalculator.formatCurrency(results.high)}
            </span>
          </div>
          <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-xs ${getConfidenceColor(results.confidence.level)}`}>
            {getConfidenceIcon(results.confidence.level)}
            <span>Confidence: {results.confidence.level}</span>
          </div>
        </div>
      </div>

      {/* Methodology Breakdown */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2 text-gray-400" />
          Valuation Methods
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {/* Revenue-Based */}
          <div className="bg-gray-700/50 rounded-md p-3 border border-gray-600">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-secondary-400" />
                <span className="font-medium text-white text-sm">Revenue-Based</span>
              </div>
              <span className="font-bold text-secondary-400 text-sm">
                {ValuationCalculator.formatCurrency(results.revenue.value)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {results.revenue.value > 0 
                ? `${ValuationCalculator.formatCurrency(results.revenue.arr)} ARR × ${results.revenue.multiple}x multiple`
                : 'No current recurring revenue'
              }
            </p>
          </div>

          {/* User Projected ARR */}
          <div className="bg-gray-700/50 rounded-md p-3 border border-gray-600">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium text-white text-sm">User Based Projected ARR</span>
              </div>
              <span className="font-bold text-emerald-400 text-sm">
                {ValuationCalculator.formatCurrency(results.userProjectedArr.value)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {results.userProjectedArr.value > 0 
                ? `${results.user.registrations.toLocaleString()} regs/mo × ${(results.user.priceAdjustedConversionRate * 100).toFixed(2)}% conversions × $${results.user.avgServicePrice.toLocaleString()} per month × 12 months × ${results.userProjectedArr.multiple}x multiple`
                : 'No user projection available'}
            </p>
          </div>

          {/* Social Media */}
          <div className="bg-gray-700/50 rounded-md p-3 border border-gray-600">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-medium text-white text-sm">Social Media</span>
              </div>
              <span className="font-bold text-pink-400 text-sm">
                {ValuationCalculator.formatCurrency(results.social.value)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {results.social.value > 0 ? (
                (() => {
                  const breakdown = results.social.breakdown;
                  const parts = [];
                  if (breakdown.linkedin > 0) {
                    const followers = Math.round(breakdown.linkedin / 2.0);
                    parts.push(`LinkedIn: ${followers.toLocaleString()} × $2.0 = ${ValuationCalculator.formatCurrency(breakdown.linkedin)}`);
                  }
                  if (breakdown.x > 0) {
                    const followers = Math.round(breakdown.x / 1.5);
                    parts.push(`X: ${followers.toLocaleString()} × $1.5 = ${ValuationCalculator.formatCurrency(breakdown.x)}`);
                  }
                  if (breakdown.instagram > 0) {
                    const followers = Math.round(breakdown.instagram / 0.9);
                    parts.push(`Instagram: ${followers.toLocaleString()} × $0.9 = ${ValuationCalculator.formatCurrency(breakdown.instagram)}`);
                  }
                  if (breakdown.tiktok > 0) {
                    const followers = Math.round(breakdown.tiktok / 0.5);
                    parts.push(`TikTok: ${followers.toLocaleString()} × $0.5 = ${ValuationCalculator.formatCurrency(breakdown.tiktok)}`);
                  }
                  if (breakdown.youtube > 0) {
                    const subscribers = Math.round(breakdown.youtube / 1.2);
                    parts.push(`YouTube: ${subscribers.toLocaleString()} × $1.2 = ${ValuationCalculator.formatCurrency(breakdown.youtube)}`);
                  }
                  if (breakdown.reddit > 0) {
                    const karma = Math.round(breakdown.reddit / 0.1);
                    parts.push(`Reddit: ${karma.toLocaleString()} × $0.1 = ${ValuationCalculator.formatCurrency(breakdown.reddit)}`);
                  }
                  return parts.join(' + ');
                })()
              ) : (
                'Brand value from social media presence'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Analysis */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-gray-400" />
          Confidence Analysis
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Confidence Score</span>
            <span className="font-bold text-white">{results.confidence.score}/100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-secondary-500 to-secondary-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${results.confidence.score}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 pt-1">{results.confidence.description}</p>
          
          <div className="pt-2">
            <h4 className="text-xs font-medium text-white mb-1.5">Key Factors:</h4>
            <div className="space-y-1">
              {results.confidence.factors.map((factor: string, index: number) => (
                <div key={index} className="flex items-center space-x-1.5 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
          Key Insights & Recommendations
        </h3>
        <div className="space-y-2">
          {results.insights.map((insight: string, index: number) => (
            <div key={index} className="bg-gray-700/30 rounded-md p-3 border border-gray-600">
              <p 
                className="text-xs text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onReset}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1.5 text-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Calculation</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1.5 text-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Results</span>
        </button>
      </div>
      
      {showShareModal && (
        <ShareModal 
          onClose={() => setShowShareModal(false)}
          url={window.location.href}
          valuation={ValuationCalculator.formatCurrency(results.high)}
        />
      )}
    </div>
  );
};

export default ValuationResults;
