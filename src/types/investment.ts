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
  latestNews: SearchResult[];
  filings: SearchResult[];
  investorRelations: SearchResult[];
  riskSignals: SearchResult[];
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