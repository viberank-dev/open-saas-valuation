export interface ValuationData {
  // Financial Performance
  mrr: number;
  mrp: number;
  avgServicePrice?: number;
  costPerAcquisition?: number;  // This now represents conversion rate percentage
  fixedMonthlyCosts?: number;
  
  // User Traction
  uniqueVisitors: number;
  registrations: number;
  appCategory: AppCategory;
  
  // Social Media
  linkedinFollowers: number;
  xFollowers: number;
  redditKarma: number;
  youtubeSubscribers: number;
  instagramFollowers: number;
  tiktokFollowers: number;
}

export type AppCategory = 
  | 'b2b_saas'
  | 'mobile_app'
  | 'game'
  | 'b2c_app'
  | 'other';


export type CategoryValues = {
  [key in AppCategory]: number;
}


export interface ValuationResult {
  value: number;
  details?: string;
  breakdown?: Record<string, unknown>;
}

export interface RevenueValuationResult extends ValuationResult {
  multiple: number;
  arr: number;
  isProjected?: boolean;
  baseArr?: number;
  projectedUserRevenue?: number;
  userProjectedArr?: number;
}

export interface UserValuationResult extends ValuationResult {
  // User traction valuation based on registrations and conversion
  registrations: number;
  baseConversionRate: number; // baseline by category (0-1)
  priceAdjustedConversionRate: number; // adjusted by avgServicePrice (0-1)
  avgServicePrice: number; // USD
  monthlyPaidConversions: number;
  monthlyTractionRevenue: number; // USD
}

export interface SocialValuationResult extends ValuationResult {
  breakdown: {
    linkedin: number;
    x: number;
    reddit: number;
    youtube: number;
    instagram: number;
    tiktok: number;
  };
}

export interface ValuationResults {
  low: number;
  high: number;
  revenue: RevenueValuationResult;
  user: UserValuationResult;
  userProjectedArr: RevenueValuationResult;
  social: SocialValuationResult;
}

export interface ConfidenceResult {
  level: string;
  score: number;
  description: string;
  factors: string[];
}

export interface FormErrors {
  [key: string]: string;
}
