import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import ValuationForm from './ValuationForm';
import ValuationResults from './ValuationResults';
import { ValuationData, AppCategory, ValuationResults as ValuationResultsType, ConfidenceResult } from '../types';
import { ValuationCalculator as ValuationEngine } from '../utils/valuationCalculator';

const ValuationCalculator: React.FC = () => {
  const [valuationData, setValuationData] = useState<ValuationData>({
    mrr: 0,
    mrp: 0,
    uniqueVisitors: 0,
    registrations: 0,
    appCategory: 'b2b_saas' as AppCategory,
    linkedinFollowers: 0,
    xFollowers: 0,
    redditKarma: 0,
    youtubeSubscribers: 0,
    instagramFollowers: 0,
    tiktokFollowers: 0,
  });

  const [results, setResults] = useState<(ValuationResultsType & { confidence: ConfidenceResult; insights: string[] }) | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (data: ValuationData) => {
    setIsCalculating(true);
    setValuationData(data);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculationResults = ValuationEngine.calculateValuation(data);
      setResults(calculationResults);
      setIsCalculating(false);
    }, 800);
  };

  const resetCalculator = () => {
    setResults(null);
    setValuationData({
      mrr: 0,
      mrp: 0,
      uniqueVisitors: 0,
      registrations: 0,
      appCategory: 'b2b_saas' as AppCategory,
      linkedinFollowers: 0,
      xFollowers: 0,
      redditKarma: 0,
      youtubeSubscribers: 0,
      instagramFollowers: 0,
      tiktokFollowers: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-primary-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Calculator className="w-10 h-10 text-secondary-400 mr-2" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                SaaS Valuation Calculator
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Calculate your early-stage app's worth using multiple valuation methodologies.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {results ? (
          <ValuationResults 
            results={results}
            onReset={resetCalculator}
          />
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 md:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-1">App Information</h2>
              <p className="text-gray-400 text-sm">
                Fill in your app's metrics to get a comprehensive valuation analysis
              </p>
            </div>
            
            <ValuationForm 
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              initialData={valuationData}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ValuationCalculator;
