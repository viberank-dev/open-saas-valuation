import {
  ValuationData,
  CategoryValues,
  SocialMediaValues,
  RevenueValuationResult,
  UserValuationResult,
  ValuationResults,
  ConfidenceResult
} from '../types';

// Standard hourly rate for development (USD)
export const standardHourlyRate = 40; // Average global developer rate

// Value per user by app category (USD)
export const categoryValues: CategoryValues = {
  'b2b_saas': 15,    // B2B SaaS: $12-$18
  'mobile_app': 8,   // Mobile App: $6-$10
  'game': 6,         // Game: $5-$8
  'b2c_app': 10,     // B2C App: $8-$12
  'other': 10        // Other: Default value
};

// Registration → paid (SaaS: account sign-up → paid; Apps: install/account → paid)
export const registrationToPaid: Record<string, [number, number]> = {
  b2b_saas: [0.02, 0.06],
  mobile_app: [0.01, 0.03],
  game: [0.01, 0.03],
  b2c_app: [0.01, 0.03],
  other: [0.01, 0.05],
};

// Recommended default $ value per follower (USD) + reference ranges
export const socialMediaValues = {
  linkedin: 2.0,   // typical CPF ≈ $6–15
  x:        1.5,    // typical CPF ≈ $1.0–2.0
  instagram:0.9,    // practical CPF ≈ $0.5–2.0 (no native follower objective)
  tiktok:   0.5,    // practical CPF ≈ $0.3–1.2
  youtube:  1.2,    // CPS (cost per subscriber) ≈ $0.5–3.0
  reddit:   0.1,    // "subscriber" proxy; no standard CPF
} as const;

export class ValuationCalculator {
  // Revenue-based valuation (current ARR only)
  static calculateRevenueValuation(mrr: number): RevenueValuationResult {
    const revenue = mrr || 0;
    if (revenue <= 0) return { value: 0, multiple: 0, arr: 0 };
    
    const arr = revenue * 12;
    const multiple = 6; // Standard 6x ARR multiple for early-stage SaaS
    
    return {
      value: arr * multiple,
      multiple: multiple,
      arr: arr
    };
  }

  // User-based projected ARR valuation
  static calculateUserProjectedArrValuation(userBasedMonthlyRevenue: number): RevenueValuationResult {
    if (userBasedMonthlyRevenue <= 0) return { value: 0, multiple: 0, arr: 0 };
    
    const projectedArr = userBasedMonthlyRevenue * 12;
    const multiple = 6; // Standard 6x ARR multiple for early-stage SaaS
    
    return {
      value: projectedArr * multiple,
      multiple: multiple,
      arr: projectedArr
    };
  }

  // User-based valuation
  static calculateUserValuation(
    _activeUsers: number, 
    registrations: number, 
    appCategory: string,
    avgServicePrice: number = 0,
    customConversionRate?: number
  ): UserValuationResult {
    const regs = registrations || 0;

    const [minConv, maxConv] = registrationToPaid[appCategory] || registrationToPaid.other;
    const baseConversionRate = customConversionRate !== undefined 
      ? customConversionRate / 100  // Convert percentage to decimal
      : (minConv + maxConv) / 2; // midpoint

    let priceAdjustedConversionRate = baseConversionRate;

    // Only apply price adjustment if using category default conversion rate
    if (customConversionRate === undefined) {
      // Price adjustment: higher price → lower conversion, lower price → higher conversion
      // Use a logistic-like clamp around a reference price to keep rates within [minConv, maxConv]
      const referencePrice = 50; // USD reference
      const price = Math.max(0, avgServicePrice || 0);
      const priceFactorRaw = referencePrice > 0 ? referencePrice / (referencePrice + price) : 1; // 1 when price=0, ~0.5 at ref, →0 as price grows
      const priceFactor = Math.max(0.25, Math.min(1.5, priceFactorRaw * 2)); // keep within sensible bounds

      priceAdjustedConversionRate = Math.max(minConv, Math.min(maxConv, baseConversionRate * priceFactor));
    }

    const monthlyPaidConversions = regs * priceAdjustedConversionRate;
    const avgPrice = Math.max(0, avgServicePrice || 0);
    const monthlyTractionRevenue = monthlyPaidConversions * avgPrice;

    // User traction valuation: monthly registrations × conversion × avg price (no trials)
    const value = monthlyTractionRevenue;

    return {
      value,
      registrations: regs,
      baseConversionRate,
      priceAdjustedConversionRate,
      avgServicePrice: avgPrice,
      monthlyPaidConversions,
      monthlyTractionRevenue
    };
  }

  // Social media valuation
  static calculateSocialMediaValuation(
    linkedinFollowers: number, 
    xFollowers: number, 
    redditKarma: number,
    youtubeSubscribers: number,
    instagramFollowers: number,
    tiktokFollowers: number
  ): ValuationResults['social'] {
    const linkedinValue = (linkedinFollowers || 0) * socialMediaValues.linkedin;
    const xValue = (xFollowers || 0) * socialMediaValues.x;
    const redditValue = (redditKarma || 0) * socialMediaValues.reddit;
    const youtubeValue = (youtubeSubscribers || 0) * socialMediaValues.youtube;
    const instagramValue = (instagramFollowers || 0) * socialMediaValues.instagram;
    const tiktokValue = (tiktokFollowers || 0) * socialMediaValues.tiktok;
    
    return {
      value: linkedinValue + xValue + redditValue + youtubeValue + instagramValue + tiktokValue,
      breakdown: {
        linkedin: linkedinValue,
        x: xValue,
        reddit: redditValue,
        youtube: youtubeValue,
        instagram: instagramValue,
        tiktok: tiktokValue
      }
    };
  }

  // Calculate confidence level
  static calculateConfidence(data: ValuationData, valuationResults: ValuationResults): ConfidenceResult {
    let score = 0;
    const factors: string[] = [];
    
    // Revenue maturity factor (0-35 points)
    if (data.mrr > 0) {
      if (data.mrr >= 10000) {
        score += 35;
        factors.push("Strong recurring revenue ($10K+ MRR)");
      } else if (data.mrr >= 5000) {
        score += 30;
        factors.push("Good recurring revenue ($5K+ MRR)");
      } else if (data.mrr >= 1000) {
        score += 25;
        factors.push("Growing recurring revenue ($1K+ MRR)");
      } else {
        score += 15;
        factors.push("Early recurring revenue");
      }
    } else {
      factors.push("No recurring revenue yet");
    }
    
    // Profitability factor (0-20 points)
    if (data.mrp > 0 && data.mrr > 0) {
      const profitMargin = (data.mrp / data.mrr) * 100;
      if (profitMargin >= 30) {
        score += 20;
        factors.push(`Excellent profitability (${profitMargin.toFixed(1)}% margin)`);
      } else if (profitMargin >= 20) {
        score += 15;
        factors.push(`Good profitability (${profitMargin.toFixed(1)}% margin)`);
      } else if (profitMargin >= 10) {
        score += 10;
        factors.push(`Moderate profitability (${profitMargin.toFixed(1)}% margin)`);
      } else {
        score += 5;
        factors.push(`Low profitability (${profitMargin.toFixed(1)}% margin)`);
      }
    } else if (data.mrr > 0) {
      factors.push("Revenue without clear profitability");
    }
    
    // User engagement & conversion factor (0-25 points)
    const conversionRate = data.registrations > 0 && data.uniqueVisitors > 0 
      ? (data.registrations / data.uniqueVisitors) * 100 : 0;
    
    if (data.registrations > 1000) {
      score += 15;
      factors.push("High monthly registrations (1K+)");
    } else if (data.registrations > 500) {
      score += 10;
      factors.push("Good monthly registrations (500+)");
    } else if (data.registrations > 100) {
      score += 5;
      factors.push("Moderate monthly registrations (100+)");
    }
    
    if (conversionRate >= 5) {
      score += 10;
      factors.push(`Excellent visitor-to-registration rate (${conversionRate.toFixed(2)}%)`);
    } else if (conversionRate >= 2) {
      score += 7;
      factors.push(`Good visitor-to-registration rate (${conversionRate.toFixed(2)}%)`);
    } else if (conversionRate >= 1) {
      score += 3;
      factors.push(`Average visitor-to-registration rate (${conversionRate.toFixed(2)}%)`);
    }
    
    // Market positioning factor (0-10 points)
    const categoryMultipliers = {
      'b2b_saas': { score: 10, label: 'High-value B2B SaaS market' },
      'b2c_app': { score: 7, label: 'Consumer subscription market' },
      'mobile_app': { score: 6, label: 'Mobile app market' },
      'game': { score: 5, label: 'Gaming market' },
      'other': { score: 3, label: 'Unspecified market category' }
    };
    const categoryInfo = categoryMultipliers[data.appCategory] || categoryMultipliers.other;
    score += categoryInfo.score;
    factors.push(categoryInfo.label);
    
    // Social proof factor (0-10 points)
    const totalFollowers = (data.linkedinFollowers || 0) + (data.xFollowers || 0) + 
                          (data.youtubeSubscribers || 0) + (data.instagramFollowers || 0) + 
                          (data.tiktokFollowers || 0) + ((data.redditKarma || 0) / 100);
    
    if (totalFollowers > 10000) {
      score += 10;
      factors.push("Strong social proof (10K+ total followers)");
    } else if (totalFollowers > 5000) {
      score += 7;
      factors.push("Good social proof (5K+ total followers)");
    } else if (totalFollowers > 1000) {
      score += 4;
      factors.push("Moderate social proof (1K+ total followers)");
    } else if (totalFollowers > 0) {
      factors.push("Limited social proof");
    }
    
    // Convert score to confidence level
    let level: string, description: string;
    if (score >= 85) {
      level = "Very High";
      description = "Exceptional metrics across multiple dimensions";
    } else if (score >= 70) {
      level = "High";
      description = "Strong indicators with solid fundamentals";
    } else if (score >= 55) {
      level = "Medium-High";
      description = "Good traction with promising signals";
    } else if (score >= 40) {
      level = "Medium";
      description = "Mixed indicators with growth potential";
    } else if (score >= 25) {
      level = "Medium-Low";
      description = "Early stage with some validation";
    } else if (score >= 10) {
      level = "Low";
      description = "Very early stage with minimal metrics";
    } else {
      level = "Very Low";
      description = "Concept stage with no clear validation";
    }
    
    return {
      level: level,
      score: score,
      description: description,
      factors: factors
    };
  }

  // Generate insights
  static generateInsights(data: ValuationData, valuationResults: ValuationResults, confidence: ConfidenceResult): string[] {
    const insights: string[] = [];
    
    // Financial performance insights
    if (data.mrr > 0) {
      const arr = data.mrr * 12;
      if (data.mrp > 0) {
        const profitMargin = (data.mrp / data.mrr) * 100;
        const monthsToBreakEven = data.fixedMonthlyCosts ? Math.ceil(data.fixedMonthlyCosts / data.mrp) : 0;
        
        if (profitMargin >= 30) {
          insights.push(`**Exceptional Unit Economics:** Your ${profitMargin.toFixed(1)}% profit margin is outstanding. This indicates strong pricing power and operational efficiency that investors highly value.`);
        } else if (profitMargin >= 20) {
          insights.push(`**Strong Profitability:** Your ${profitMargin.toFixed(1)}% profit margin demonstrates healthy unit economics. Focus on scaling while maintaining these margins.`);
        } else if (profitMargin >= 10) {
          insights.push(`**Moderate Profitability:** Your ${profitMargin.toFixed(1)}% profit margin shows promise. Consider optimizing costs or increasing pricing to improve margins before scaling.`);
        } else {
          insights.push(`**Low Margins:** Your ${profitMargin.toFixed(1)}% profit margin needs improvement. Focus on cost optimization or pricing strategy before aggressive scaling.`);
        }
        
        if (monthsToBreakEven > 0 && monthsToBreakEven <= 12) {
          insights.push(`**Cash Flow Positive:** With current profitability, you could cover fixed costs in ${monthsToBreakEven} months, indicating strong cash generation potential.`);
        }
      } else {
        insights.push(`**Revenue Without Profit:** Focus on achieving profitability through cost optimization or pricing adjustments. Sustainable growth requires positive unit economics.`);
      }
      
      if (arr >= 120000) {
        insights.push(`**Scale Achieved:** Your $${(arr/1000).toFixed(0)}K ARR puts you in a strong position for Series A funding or acquisition discussions.`);
      } else if (arr >= 60000) {
        insights.push(`**Growth Stage:** Your $${(arr/1000).toFixed(0)}K ARR shows solid traction. Focus on accelerating growth to reach $100K+ ARR.`);
      } else if (arr >= 12000) {
        insights.push(`**Early Revenue:** Your $${(arr/1000).toFixed(0)}K ARR is a good start. Aim for consistent month-over-month growth of 15-20%.`);
      }
    } else {
      insights.push(`**Pre-Revenue Strategy:** Focus on product-market fit validation, user engagement metrics, and developing a clear monetization strategy before seeking significant funding.`);
    }
    
    // User acquisition and conversion insights
    const visitorToRegRate = data.uniqueVisitors > 0 ? (data.registrations / data.uniqueVisitors) * 100 : 0;
    const regToPaidRate = data.costPerAcquisition || 0; // This is now conversion rate
    
    if (data.registrations > 0) {
      if (visitorToRegRate >= 5) {
        insights.push(`**Excellent Conversion Funnel:** Your ${visitorToRegRate.toFixed(2)}% visitor-to-registration rate is exceptional. This indicates strong product-market fit and effective messaging.`);
      } else if (visitorToRegRate >= 2) {
        insights.push(`**Good Conversion Rate:** Your ${visitorToRegRate.toFixed(2)}% visitor-to-registration rate is solid. Test A/B improvements to push toward 5%+ conversion.`);
      } else if (visitorToRegRate >= 1) {
        insights.push(`**Average Conversion:** Your ${visitorToRegRate.toFixed(2)}% visitor-to-registration rate has room for improvement. Focus on value proposition clarity and user experience.`);
      } else if (visitorToRegRate > 0) {
        insights.push(`**Low Conversion Rate:** Your ${visitorToRegRate.toFixed(2)}% conversion needs significant improvement. Review your landing page, messaging, and user onboarding flow.`);
      }
      
      if (regToPaidRate > 0) {
        if (regToPaidRate >= 5) {
          insights.push(`**Strong Monetization:** Your ${regToPaidRate}% registration-to-paid conversion is excellent. This shows clear value delivery and pricing alignment.`);
        } else if (regToPaidRate >= 2) {
          insights.push(`**Good Monetization:** Your ${regToPaidRate}% registration-to-paid conversion is decent. Consider optimizing onboarding and free trial experience.`);
        } else {
          insights.push(`**Conversion Challenge:** Your ${regToPaidRate}% registration-to-paid rate suggests users aren't seeing enough value. Improve onboarding and demonstrate clear ROI.`);
        }
      }
    }
    
    // Market positioning insights
    const categoryInsights = {
      'b2b_saas': 'B2B SaaS typically commands higher valuations due to predictable revenue and lower churn. Focus on enterprise features and security compliance.',
      'b2c_app': 'Consumer apps require strong user engagement and retention metrics. Focus on DAU/MAU ratios and in-app purchase optimization.',
      'mobile_app': 'Mobile apps benefit from app store optimization and viral growth mechanisms. Consider implementing referral programs.',
      'game': 'Gaming apps need strong retention and monetization metrics. Focus on player lifetime value and engagement analytics.',
      'other': 'Consider specializing in a specific vertical to command higher valuations and clearer market positioning.'
    };
    insights.push(`**Market Strategy:** ${categoryInsights[data.appCategory] || categoryInsights.other}`);
    
    // Social proof and marketing insights
    const totalFollowers = (data.linkedinFollowers || 0) + (data.xFollowers || 0) + (data.youtubeSubscribers || 0) + 
                          (data.instagramFollowers || 0) + (data.tiktokFollowers || 0) + ((data.redditKarma || 0) / 100);
    
    if (totalFollowers > 10000) {
      insights.push(`**Strong Brand Asset:** Your ${totalFollowers.toLocaleString()} total followers represent significant marketing leverage. This audience can drive organic growth and reduce customer acquisition costs.`);
    } else if (totalFollowers > 5000) {
      insights.push(`**Growing Brand Presence:** Your ${totalFollowers.toLocaleString()} followers show good social proof. Focus on content strategy to reach 10K+ for maximum impact.`);
    } else if (totalFollowers > 1000) {
      insights.push(`**Building Community:** Your ${totalFollowers.toLocaleString()} followers are a good start. Consistent content creation and engagement can significantly boost your brand value.`);
    } else {
      insights.push(`**Content Strategy Opportunity:** Building a strong social media presence (target 5K+ followers) can reduce marketing costs and improve valuation multiples.`);
    }
    
    // Cost efficiency insights
    if (data.fixedMonthlyCosts && data.mrr > 0) {
      const costRatio = (data.fixedMonthlyCosts / data.mrr) * 100;
      if (costRatio <= 30) {
        insights.push(`**Efficient Operations:** Your fixed costs represent only ${costRatio.toFixed(1)}% of revenue, indicating excellent operational efficiency and scalability potential.`);
      } else if (costRatio <= 50) {
        insights.push(`**Moderate Cost Structure:** Fixed costs at ${costRatio.toFixed(1)}% of revenue are manageable but have room for optimization as you scale.`);
      } else {
        insights.push(`**Cost Optimization Needed:** Fixed costs at ${costRatio.toFixed(1)}% of revenue are high. Focus on reducing infrastructure costs and improving operational efficiency.`);
      }
    }
    
    // Strategic recommendations based on confidence level
    if (confidence.score >= 70) {
      insights.push(`**Investment Readiness:** Your strong metrics (${confidence.score}/100 confidence) position you well for fundraising. Focus on growth acceleration and market expansion.`);
    } else if (confidence.score >= 40) {
      insights.push(`**Growth Focus:** Your moderate metrics (${confidence.score}/100 confidence) suggest focusing on key performance indicators before seeking significant investment.`);
    } else {
      insights.push(`**Foundation Building:** Your early-stage metrics (${confidence.score}/100 confidence) indicate the need to establish stronger fundamentals before scaling or fundraising.`);
    }
    
    return insights;
  }

  // Main calculation function
  static calculateValuation(data: ValuationData): ValuationResults & { confidence: ConfidenceResult; insights: string[] } {
    // Calculate individual valuations
    const revenueValuation = this.calculateRevenueValuation(data.mrr);
    const userValuation = this.calculateUserValuation(
      data.activeUsers, 
      data.registrations, 
      data.appCategory,
      data.avgServicePrice || 0,
      data.costPerAcquisition  // This now represents conversion rate
    );
    const userProjectedArrValuation = this.calculateUserProjectedArrValuation(userValuation.value);
    
    const socialValuation = this.calculateSocialMediaValuation(
      data.linkedinFollowers, 
      data.xFollowers, 
      data.redditKarma,
      data.youtubeSubscribers,
      data.instagramFollowers,
      data.tiktokFollowers
    );
    
    // Combine valuations using the new hybrid approach
    let finalValuation: number;
    
    if (data.mrr > 0) {
      // Has current revenue - use revenue valuation as base, add user projected if higher
      finalValuation = revenueValuation.value;
      if (userProjectedArrValuation.value > revenueValuation.value) {
        const difference = userProjectedArrValuation.value - revenueValuation.value;
        finalValuation = revenueValuation.value + difference;
      }
    } else {
      // No current revenue - use user projected ARR valuation
      finalValuation = userProjectedArrValuation.value;
    }
    
    // Add social media value
    finalValuation += socialValuation.value;
    
    // Create range around final valuation
    const lowValuation = finalValuation * 0.9;
    const highValuation = finalValuation * 1.1;
    
    const results: ValuationResults = {
      low: lowValuation,
      high: highValuation,
      revenue: revenueValuation,
      user: userValuation,
      userProjectedArr: userProjectedArrValuation,
      social: socialValuation
    };
    
    // Calculate confidence and insights
    const confidence = this.calculateConfidence(data, results);
    const insights = this.generateInsights(data, results, confidence);
    
    return {
      ...results,
      confidence,
      insights
    };
  }

  // Format currency
  static formatCurrency(amount: number): string {
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}
