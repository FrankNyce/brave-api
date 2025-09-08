export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  published?: string;
  age?: string;
  favicon?: string;
}

export interface InvestmentPanel {
  ticker: string;
  company: string;
  lastUpdated: string;
  stockOverview?: StockOverview;
  latestNews: SearchResult[];
  filings: SearchResult[];
  investorRelations: SearchResult[];
  riskSignals: SearchResult[];
}

export interface StockOverview {
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketStatus: string;
  lastUpdated: string;
  dayHigh: number;
  dayLow: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  analystRating: {
    rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    score: number;
    analystCount: number;
  };
  relatedStocks: RelatedStock[];
}

export interface RelatedStock {
  ticker: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface SearchFilters {
  dateRange: '1d' | '7d' | '30d' | 'all';
  sources: string[];
}

export interface BraveNewsResponse {
  results?: Array<{
    title: string;
    url: string;
    description?: string;
    source?: { name: string };
    age?: string;
    published?: string;
  }>;
}

export interface BraveWebResponse {
  web?: {
    results?: Array<{
      title: string;
      url: string;
      description?: string;
      meta_url?: {
        favicon?: string;
      };
    }>;
  };
}