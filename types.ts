export enum SectionType {
  EXECUTIVE_SUMMARY = 'executive_summary',
  FEATURE_CHECK = 'feature_check',
  PLATFORM_COVERAGE = 'platform_coverage',
  PRICING = 'pricing',
  MOMENTUM = 'momentum',
  REVIEWS = 'reviews',
  RED_FLAGS = 'red_flags',
  SALES_ARGUMENTS = 'sales_arguments',
}

export type CompetitorId = string;

export interface ComparisonPoint {
  category: string;
  hootsuite: string; // This key acts as the "Competitor" column value
  reality: string;
  swatio_advantage: string;
}

export interface ReviewData {
  platform: string;
  count: number;
}

export interface ReviewComment {
  title: string;
  comment: string;
  source: string;
  date: string;
  rating: number; // 1, 2, or 3
}

export interface KillShot {
  title: string;
  statement: string;
  talkTrack: string;
}

export interface AnalysisData {
  id: CompetitorId;
  name: string; // Display name
  url: string; // Added URL for refreshing
  lastUpdated: number; // Timestamp for auto-refresh tracking
  title: string;
  summary: {
    verdict: string;
    painPoints: string[];
    advantages: string[];
  };
  momentum: {
    market_position: string;
    recent_updates: string;
  };
  platform_coverage: {
    summary: string;
    strengths: string[];
  };
  red_flags: {
    warnings: string[];
    win_signals: string[];
  };
  featureComparison: ComparisonPoint[];
  reviewAnalysis: {
    competitor_consensus: string;
    swatio_comparison: string;
  };
  reviews: ReviewData[];
  criticalReviews: ReviewComment[];
  killShots: KillShot[];
  pricing: {
    entry: string;
    cons: string[];
  };
  aiContext: string; // Raw text context for the AI
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}